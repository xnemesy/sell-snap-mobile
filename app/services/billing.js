import { Platform } from 'react-native';

// IAP Mock for Expo Go / Simulator
let RNIap;
try {
    RNIap = require('react-native-iap');
} catch (e) { }

const skus = Platform.select({
    android: ['pro_monthly', 'pro_yearly'],
    default: [],
});

export const initBilling = async () => {
    if (__DEV__) return true;

    if (!RNIap || !RNIap.initConnection) return true;
    try {
        await RNIap.initConnection();
    } catch (err) {
        console.warn("Billing init ignored:", err.message);
    }
};

export const getSubscriptions = async () => {
    if (!RNIap || !RNIap.getSubscriptions) {
        return [
            { productId: 'pro_monthly', price: '€6,99', title: 'SellSnap Pro Monthly' },
            { productId: 'pro_yearly', price: '€59,00', title: 'SellSnap Pro Yearly' }
        ];
    }
    try {
        return await RNIap.getSubscriptions({ skus: skus });
    } catch (err) {
        console.warn("Error fetching subscriptions (likely Emulator):", err.message);
        return [
            { productId: 'pro_monthly', price: '€6,99', title: 'SellSnap Pro Monthly' },
            { productId: 'pro_yearly', price: '€59,00', title: 'SellSnap Pro Yearly' }
        ];
    }
};

export const purchasePro = async (sku) => {
    if (!RNIap || !RNIap.requestSubscription) {
        return { success: true, mock: true };
    }
    try {
        return await RNIap.requestSubscription({ sku });
    } catch (err) {
        console.warn("Purchase error (likely Emulator):", err.message);
        return { success: false, error: err.message };
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
