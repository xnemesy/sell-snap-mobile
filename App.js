import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, StatusBar, Alert, Animated, Dimensions, ActivityIndicator, LogBox } from 'react-native';

// Fix billing simulator error
LogBox.ignoreLogs(['[RN-IAP]', 'Billing init error']);
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './app/services/firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore';

import HomeScreen from './app/screens/HomeScreen';
import AccountScreen from './app/screens/AccountScreen';
import SnapScreen from './app/screens/SnapScreen';
import VisionProcessing from './app/screens/VisionProcessing';
import VisionConfirmScreen from './app/screens/VisionConfirmScreen';
import ImageReadinessScreen from './app/screens/ImageReadinessScreen';
import ListingSwipeScreen from './app/screens/ListingSwipeScreen';
import PriceExportScreen from './app/screens/PriceExportScreen';
import SuccessExportScreen from './app/screens/SuccessExportScreen';
import PricingScreen from './app/screens/PricingScreen';
import InventoryDetailScreen from './app/screens/InventoryDetailScreen';
import AuthScreen from './app/screens/AuthScreen';
import PublishingOverlay from './app/components/PublishingOverlay';

import { analyzeImagesWithGemini, generateListingsWithGemini } from './app/services/geminiService';
import { initBilling } from './app/services/billing';

const { width } = Dimensions.get('window');

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [status, setStatus] = useState('HOME');
  const [data, setData] = useState(null);
  const [drafts, setDrafts] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [dailyAdsCount, setDailyAdsCount] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [duplicateBase, setDuplicateBase] = useState(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let unsubscribeInventory = () => { };

    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);

      if (u) {
        const q = query(
          collection(db, "inventory"),
          where("userId", "==", u.uid),
          orderBy("createdAt", "desc")
        );

        unsubscribeInventory = onSnapshot(q, (snapshot) => {
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setInventory(items);
        });
      } else {
        setInventory([]);
        unsubscribeInventory();
      }
    });

    initBilling();
    return () => {
      unsubscribeAuth();
      unsubscribeInventory();
    };
  }, []);

  const changeStatus = (newStatus) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -20, duration: 150, useNativeDriver: true })
    ]).start(() => {
      setStatus(newStatus);
      slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true })
      ]).start();
    });
  };

  const resetFlow = () => {
    Alert.alert("Annulla", "Tornare alla Home? I progressi andranno persi.", [
      { text: "No", style: "cancel" },
      {
        text: "Sì", onPress: () => {
          setData(null);
          setDrafts(null);
          setDuplicateBase(null);
          setSelectedItem(null);
          changeStatus('HOME');
        }
      }
    ]);
  };

  const saveToInventory = async (price) => {
    if (!data || !user) return;
    try {
      await addDoc(collection(db, "inventory"), {
        userId: user.uid,
        title: `${data.product.brand} ${data.product.model}`,
        sku: data.product.sku || "N/A",
        price: price || "0",
        date: new Date().toLocaleDateString('it-IT'),
        raw_data: data,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Firestore Error:", err);
      Alert.alert("Errore", "Impossibile salvare nell'archivio cloud.");
    }
  };

  const handleDuplicateRequest = (item) => {
    Alert.alert(
      "Creare un annuncio simile?",
      "Categoria e struttura verranno riutilizzate. Foto, condizioni e difetti saranno rivalutati.",
      [
        { text: "Annulla", style: "cancel" },
        {
          text: "Continua",
          onPress: () => {
            setDuplicateBase(item.raw_data);
            changeStatus('SNAP');
          }
        }
      ]
    );
  };

  const handleNext = async (val) => {
    if (status === 'SNAP') {
      if (!isPro && dailyAdsCount >= 3) { changeStatus('PRICING'); return; }
      changeStatus('PROCESSING');
      try {
        let visionResult;
        if (val) {
          visionResult = await analyzeImagesWithGemini(val);
          if (duplicateBase) {
            visionResult.product = { ...duplicateBase.product, ...visionResult.product };
          }
        } else {
          visionResult = duplicateBase ? { ...duplicateBase, condition: { level: "Da confermare" } } : mockVisionData;
        }
        setData(visionResult);
        setDuplicateBase(null);
        setTimeout(() => changeStatus('VISION'), 800);
      } catch (err) {
        Alert.alert("Errore", "Riprova più tardi.");
        changeStatus('SNAP');
      }
    }
    else if (status === 'VISION') changeStatus('READINESS');
    else if (status === 'READINESS') {
      changeStatus('GENERATING_LISTINGS');
      try {
        const listingResult = await generateListingsWithGemini(data);
        setDrafts(listingResult);
        changeStatus('LISTING');
      } catch (err) { changeStatus('READINESS'); }
    }
    else if (status === 'LISTING') changeStatus('PRICE');
    else if (status === 'PRICE') {
      saveToInventory(val);
      changeStatus('PUBLISHING');
    }
    else if (status === 'PUBLISHING') {
      setDailyAdsCount(prev => prev + 1);
      changeStatus('SUCCESS');
    }
    else if (status === 'SUCCESS') {
      changeStatus('HOME');
      setData(null);
      setDrafts(null);
      setSelectedItem(null);
    }
  };

  const mockVisionData = {
    product: { type: "Sneakers", brand: "Nike", model: "Air Jordan 4 Retro", sku: "IM4002 100" },
    condition: { level: "Ottime" },
    missing_or_uncertain: []
  };

  const renderScreen = () => {
    if (!user) return <AuthScreen />;

    switch (status) {
      case 'HOME':
        return <HomeScreen
          onStartNew={() => { setDuplicateBase(null); changeStatus('SNAP'); }}
          onOpenAccount={() => changeStatus('ACCOUNT')}
          isPro={isPro}
          remainingAds={isPro ? null : 3 - dailyAdsCount}
          inventory={inventory}
          onSelectItem={(item) => { setSelectedItem(item); changeStatus('INVENTORY_DETAIL'); }}
        />;
      case 'INVENTORY_DETAIL':
        return <InventoryDetailScreen
          item={selectedItem}
          onBack={() => changeStatus('HOME')}
          onDuplicate={handleDuplicateRequest}
        />;
      case 'ACCOUNT':
        return <AccountScreen
          onBack={() => changeStatus('HOME')}
          isPro={isPro}
          onUpgrade={() => changeStatus('PRICING')}
          inventoryCount={inventory.length}
          userEmail={user.email}
        />;
      case 'SNAP':
        return <SnapScreen
          onNext={handleNext}
          isPro={isPro}
          remainingAds={isPro ? null : 3 - dailyAdsCount}
          onShowPricing={() => changeStatus('PRICING')}
          onCancel={() => changeStatus('HOME')}
          isDuplicating={!!duplicateBase}
        />;
      case 'PRICING':
        return <PricingScreen onPlanSelect={(p) => { if (p !== 'free') setIsPro(true); changeStatus('HOME'); }} onBack={() => changeStatus('HOME')} limitReached={!isPro && dailyAdsCount >= 3} />;
      case 'PROCESSING':
      case 'GENERATING_LISTINGS':
        return <VisionProcessing onComplete={() => { }} />;
      case 'VISION':
        return <VisionConfirmScreen data={data} onUpdate={setData} onConfirm={() => handleNext()} onCancel={resetFlow} />;
      case 'READINESS':
        return <ImageReadinessScreen onNext={() => handleNext()} onCancel={resetFlow} />;
      case 'LISTING':
        return <ListingSwipeScreen drafts={drafts} onNext={() => handleNext()} onCancel={resetFlow} />;
      case 'PRICE':
        return <PriceExportScreen onNext={handleNext} onCancel={resetFlow} />;
      case 'SUCCESS':
        return <SuccessExportScreen onReset={() => handleNext()} isPro={isPro} drafts={drafts} />;
      default: return null;
    }
  };

  if (authLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#121418', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121418" />
      <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {renderScreen()}
      </Animated.View>
      <PublishingOverlay visible={status === 'PUBLISHING'} onComplete={() => handleNext()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121418' },
  animatedContainer: { flex: 1 },
});
