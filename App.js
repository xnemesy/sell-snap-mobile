import React, { useState } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import SnapScreen from './app/screens/SnapScreen';
import VisionProcessing from './app/screens/VisionProcessing';
import VisionConfirmScreen from './app/screens/VisionConfirmScreen';
import ImageReadinessScreen from './app/screens/ImageReadinessScreen';
import ListingSwipeScreen from './app/screens/ListingSwipeScreen';
import PriceExportScreen from './app/screens/PriceExportScreen';
import SuccessExportScreen from './app/screens/SuccessExportScreen';
import PublishingOverlay from './app/components/PublishingOverlay';

export default function App() {
  const [status, setStatus] = useState('SNAP'); // SNAP, PROCESSING, VISION, READINESS, LISTING, PRICE, PUBLISHING, SUCCESS
  const [data, setData] = useState(null);
  const [drafts, setDrafts] = useState(null);

  const mockVisionData = {
    product: {
      type: "Sneakers",
      brand: "Nike",
      model: "Air Jordan 1",
      category_hint: "Scarpe da ginnastica",
      quantity: 1
    },
    appearance: {
      colors: ["Nero", "Rosso", "Bianco"],
      materials: ["Pelle", "Gomma"],
      visible_style_notes: ["High-top design", "Logo Swoosh visibile"]
    },
    condition: {
      level: "Very Good",
      wear_description: "Leggera abrasione sulla suola destra, pieghe minime sulla punta."
    },
    defects: ["Graffio quasi invisibile su tallone sinistro"],
    accessories_included: ["Scatola originale", "Lacci extra rossi"],
    missing_or_uncertain: ["Autenticità non verificabile visivamente", "Anno di produzione incerto"],
    confidence_notes: ["Analisi basata su 3 immagini ad alta risoluzione"]
  };

  const handleNext = () => {
    switch (status) {
      case 'SNAP':
        setStatus('PROCESSING');
        break;
      case 'PROCESSING':
        setData(mockVisionData);
        setStatus('VISION');
        break;
      case 'VISION':
        setStatus('READINESS');
        break;
      case 'READINESS':
        // Generazione mock dei listing basata sui dati vision
        setDrafts({
          vinted: { title: "Nike Air Jordan 1", description: "Sneakers Nike in ottimo stato..." },
          ebay: { title: "Nike Air Jordan 1 Sneakers Nero Rosso", description: "Oggetto: Sneakers. Marca: Nike..." },
          subito: { title: "Nike Air Jordan 1", description: "Vengo bellissime Jordan 1..." }
        });
        setStatus('LISTING');
        break;
      case 'LISTING':
        setStatus('PRICE');
        break;
      case 'PRICE':
        setStatus('PUBLISHING');
        break;
      case 'PUBLISHING':
        setStatus('SUCCESS');
        break;
      case 'SUCCESS':
        setStatus('SNAP');
        setData(null);
        setDrafts(null);
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0b0e14" />

      {status === 'SNAP' && (
        <SnapScreen onNext={handleNext} />
      )}

      {status === 'PROCESSING' && (
        <VisionProcessing onComplete={handleNext} />
      )}

      {status === 'VISION' && (
        <VisionConfirmScreen
          data={data}
          onUpdate={setData}
          onConfirm={handleNext}
        />
      )}

      {status === 'READINESS' && (
        <ImageReadinessScreen onNext={handleNext} />
      )}

      {status === 'LISTING' && (
        <ListingSwipeScreen drafts={drafts} onNext={handleNext} />
      )}

      {status === 'PRICE' && (
        <PriceExportScreen onNext={handleNext} />
      )}

      {status === 'SUCCESS' && (
        <SuccessExportScreen onReset={handleNext} />
      )}

      <PublishingOverlay
        visible={status === 'PUBLISHING'}
        onComplete={handleNext}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0e14',
  },
});
