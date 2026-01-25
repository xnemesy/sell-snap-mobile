import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, StatusBar, Alert, Animated, Dimensions } from 'react-native';
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
import PublishingOverlay from './app/components/PublishingOverlay';
import { analyzeImagesWithGemini, generateListingsWithGemini } from './app/services/geminiService';
import { initBilling, purchasePro } from './app/services/billing';

const { width } = Dimensions.get('window');

export default function App() {
  const [status, setStatus] = useState('HOME');
  const [data, setData] = useState(null);
  const [drafts, setDrafts] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [dailyAdsCount, setDailyAdsCount] = useState(0);
  const [inventory, setInventory] = useState([]);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    initBilling();
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
      { text: "Sì", onPress: () => { setData(null); setDrafts(null); changeStatus('HOME'); } }
    ]);
  };

  const saveToInventory = (price) => {
    if (!data) return;
    const newItem = {
      id: Date.now().toString(),
      title: `${data.product.brand} ${data.product.model}`,
      sku: data.product.sku || "N/A",
      price: price || "0",
      date: new Date().toLocaleDateString('it-IT'),
      image: null,
    };
    setInventory(prev => [newItem, ...prev]);
  };

  const handleNext = async (val) => {
    if (status === 'SNAP') {
      if (!isPro && dailyAdsCount >= 3) { changeStatus('PRICING'); return; }
      changeStatus('PROCESSING');
      try {
        const visionResult = val ? await analyzeImagesWithGemini(val) : mockVisionData;
        setData(visionResult);
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
    }
  };

  const mockVisionData = {
    product: { type: "Sneakers", brand: "Nike", model: "Air Jordan 4 Retro", sku: "IM4002 100" },
    condition: { level: "Ottime" },
    missing_or_uncertain: []
  };

  const renderScreen = () => {
    switch (status) {
      case 'HOME':
        return <HomeScreen onStartNew={() => changeStatus('SNAP')} onOpenAccount={() => changeStatus('ACCOUNT')} isPro={isPro} remainingAds={isPro ? null : 3 - dailyAdsCount} inventory={inventory} />;
      case 'ACCOUNT':
        return <AccountScreen onBack={() => changeStatus('HOME')} isPro={isPro} onUpgrade={() => changeStatus('PRICING')} />;
      case 'SNAP':
        return <SnapScreen onNext={handleNext} isPro={isPro} remainingAds={isPro ? null : 3 - dailyAdsCount} onShowPricing={() => changeStatus('PRICING')} onCancel={() => changeStatus('HOME')} />;
      case 'PRICING':
        return <PricingScreen onPlanSelect={(p) => { if (p !== 'free') setIsPro(true); changeStatus('HOME'); }} onBack={() => changeStatus('HOME')} limitReached={!isPro && dailyAdsCount >= 3} />;
      case 'PROCESSING':
      case 'GENERATING_LISTINGS':
        return <VisionProcessing onComplete={() => { }} />;
      case 'VISION':
        return <VisionConfirmScreen data={data} onConfirm={() => handleNext()} onCancel={resetFlow} />;
      case 'READINESS':
        return <ImageReadinessScreen onNext={() => handleNext()} onCancel={resetFlow} />;
      case 'LISTING':
        return <ListingSwipeScreen drafts={drafts} onNext={() => handleNext()} onCancel={resetFlow} />;
      case 'PRICE':
        return <PriceExportScreen onNext={handleNext} onCancel={resetFlow} />;
      case 'SUCCESS':
        return <SuccessExportScreen onReset={() => handleNext()} isPro={isPro} />;
      default: return null;
    }
  };

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
