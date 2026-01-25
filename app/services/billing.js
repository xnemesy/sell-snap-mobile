import { Platform } from 'react-native';

// Mock per react-native-iap per permettere il test nel simulatore (Expo Go) 
// senza causare il crash per moduli nativi mancanti.
let RNIap;
try {
    RNIap = require('react-native-iap');
} catch (e) {
    console.log("react-native-iap non caricato (probabile ambiente Expo Go)");
}

const skus = Platform.select({
    android: ['pro_monthly', 'pro_yearly'],
    default: [],
});

export const initBilling = async () => {
    if (!RNIap || !RNIap.initConnection) {
        console.log("[Mock Billing] Inizializzazione simulata");
        return true;
    }
    try {
        await RNIap.initConnection();
        console.log("Billing connection initialized");
    } catch (err) {
        console.error("Billing init error", err);
    }
};

export const getSubscriptions = async () => {
    if (!RNIap || !RNIap.getSubscriptions) {
        console.log("[Mock Billing] Recupero prodotti simulato");
        return [
            { productId: 'pro_monthly', price: '€6,99', title: 'SellSnap Pro Monthly' },
            { productId: 'pro_yearly', price: '€59,00', title: 'SellSnap Pro Yearly' }
        ];
    }
    try {
        return await RNIap.getSubscriptions({ skus: skus });
    } catch (err) {
        console.error("Error fetching subscriptions", err);
        return [];
    }
};

export const purchasePro = async (sku) => {
    if (!RNIap || !RNIap.requestSubscription) {
        console.log("[Mock Billing] Acquisto simulato per:", sku);
        return { success: true, mock: true };
    }
    try {
        return await RNIap.requestSubscription({ sku });
    } catch (err) {
        console.error("Purchase error", err);
        throw err;
    }
};

export const endBilling = async () => {
    if (!RNIap || !RNIap.endConnection) return;
    try {
        await RNIap.endConnection();
    } catch (err) {
        console.error("Billing end error", err);
    }
};
