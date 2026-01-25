import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Animated, StatusBar, Platform, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';

const ExportAction = ({ label, icon, color, onPress }) => (
    <TouchableOpacity
        style={[styles.actionBtn, { borderColor: color + '30' }]}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={[styles.actionIconBox, { backgroundColor: color + '15' }]}>
            <Text style={styles.actionIcon}>{icon}</Text>
        </View>
        <Text style={[styles.actionLabel, { color: color }]}>{label}</Text>
        <Text style={styles.chevron}></Text>
    </TouchableOpacity>
);

const ChecklistItem = ({ text, checked, info }) => (
    <View style={styles.checkRow}>
        <View style={[
            styles.checkBox,
            checked && styles.checkBoxActive,
            info && styles.checkBoxInfo
        ]}>
            {checked ? <Text style={styles.checkMark}>✓</Text> : info ? <Text style={styles.checkMark}>ℹ</Text> : null}
        </View>
        <Text style={[
            styles.checkText,
            (checked || info) && styles.checkTextActive
        ]}>{text}</Text>
    </View>
);

const SuccessExportScreen = ({ onReset, isPro, drafts }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    const [copiedMarkets, setCopiedMarkets] = useState({ vinted: false, ebay: false, subito: false });

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const copyToClipboard = async (market) => {
        const marketKey = market.toLowerCase();
        const draft = drafts ? drafts[marketKey] : null;

        if (draft) {
            const textToCopy = `${draft.title}\n\n${draft.description}`;
            await Clipboard.setStringAsync(textToCopy);
            setCopiedMarkets(prev => ({ ...prev, [marketKey]: true }));
            Alert.alert("Copiato!", `Testo per ${market} pronto.`);
        }
    };

    const openMarketplace = (market) => {
        let url = "";
        switch (market.toLowerCase()) {
            case 'vinted': url = "https://www.vinted.it/items/new"; break;
            case 'ebay': url = "https://www.ebay.it/sl/sell"; break;
            case 'subito': url = "https://www.subito.it/inserisci/index.htm"; break;
            default: url = "https://www.google.com";
        }
        Linking.openURL(url);
    };

    return (
        <View style={styles.mainWrapper}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                    <Animated.View style={[
                        styles.successIcon,
                        { transform: [{ scale: scaleAnim }], opacity: opacityAnim }
                    ]}>
                        <Text style={{ fontSize: 40 }}>✅</Text>
                    </Animated.View>

                    <Animated.View style={{ opacity: opacityAnim, alignItems: 'center' }}>
                        <Text style={styles.title}>Bozza pronta</Text>
                        <Text style={styles.subtitle}>
                            Controllata da te. Pronta per la pubblicazione manuale.
                        </Text>
                    </Animated.View>

                    <View style={styles.guideCard}>
                        <Text style={styles.guideHeader}>VERIFICA FINALE</Text>
                        <ChecklistItem text="Foto pronte" checked={true} />
                        <ChecklistItem text="Titolo copiato" checked={Object.values(copiedMarkets).some(v => v)} />
                        <ChecklistItem text="Descrizione copiata" checked={Object.values(copiedMarkets).some(v => v)} />
                        <ChecklistItem text="Prezzo inserito manualmente" info={true} />
                    </View>

                    <View style={styles.actions}>
                        <Text style={styles.sectionHeader}>CANALI</Text>

                        <View style={styles.marketGroup}>
                            <View style={styles.marketCard}>
                                <View style={styles.marketInfo}>
                                    <Text style={styles.marketTitle}>Vinted</Text>
                                    <TouchableOpacity onPress={() => copyToClipboard('Vinted')}>
                                        <Text style={[styles.copyLink, copiedMarkets.vinted && styles.copyDone]}>
                                            {copiedMarkets.vinted ? "Copiato ✓" : "Copia testo"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={[styles.openBtn, { backgroundColor: '#10b981' }]} onPress={() => openMarketplace('Vinted')}>
                                    <Text style={styles.openBtnText}>Apri Vinted</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.marketCard}>
                                <View style={styles.marketInfo}>
                                    <Text style={styles.marketTitle}>eBay</Text>
                                    <TouchableOpacity onPress={() => copyToClipboard('ebay')}>
                                        <Text style={[styles.copyLink, copiedMarkets.ebay && styles.copyDone]}>
                                            {copiedMarkets.ebay ? "Copiato ✓" : "Copia testo"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={[styles.openBtn, { backgroundColor: '#8b5cf6' }]} onPress={() => openMarketplace('ebay')}>
                                    <Text style={styles.openBtnText}>Apri eBay</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.marketCard}>
                                <View style={styles.marketInfo}>
                                    <Text style={styles.marketTitle}>Subito</Text>
                                    <TouchableOpacity onPress={() => copyToClipboard('subito')}>
                                        <Text style={[styles.copyLink, copiedMarkets.subito && styles.copyDone]}>
                                            {copiedMarkets.subito ? "Copiato ✓" : "Copia testo"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={[styles.openBtn, { backgroundColor: '#f43f5e' }]} onPress={() => openMarketplace('subito')}>
                                    <Text style={styles.openBtnText}>Apri Subito</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={styles.transparencyBox}>
                        <Text style={styles.transparencyText}>
                            SellSnap utilizza l’AI solo come supporto.{"\n"}
                            Tutti i contenuti devono essere verificati dall’utente prima della pubblicazione.
                        </Text>
                    </View>

                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.resetBtn} onPress={onReset} activeOpacity={0.8}>
                        <Text style={styles.resetBtnText}>Fine, torna alla Dashboard</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: '#121418',
    },
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0,
    },
    content: {
        padding: 24,
        alignItems: 'center',
        paddingBottom: 150,
    },
    successIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    subtitle: {
        color: '#64748b',
        fontSize: 15,
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 22,
    },
    guideCard: {
        backgroundColor: '#1e2229',
        width: '100%',
        borderRadius: 24,
        padding: 20,
        marginTop: 30,
        borderWidth: 1,
        borderColor: '#2d333d',
    },
    guideHeader: {
        color: '#475569',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
        marginBottom: 15,
    },
    checkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    checkBox: {
        width: 18,
        height: 18,
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: '#334155',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkBoxActive: {
        backgroundColor: '#10b981',
        borderColor: '#10b981',
    },
    checkBoxInfo: {
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
    },
    checkMark: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
    },
    checkText: {
        color: '#475569',
        fontSize: 14,
        fontWeight: '600',
    },
    checkTextActive: {
        color: '#f1f5f9',
    },
    actions: {
        width: '100%',
        marginTop: 30,
    },
    sectionHeader: {
        color: '#475569',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.5,
        marginBottom: 15,
        marginLeft: 4,
    },
    marketGroup: {
        gap: 12,
    },
    marketCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e2229',
        padding: 12,
        paddingLeft: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#2d333d',
    },
    marketInfo: {
        flex: 1,
    },
    marketTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },
    copyLink: {
        color: '#8b5cf6',
        fontSize: 13,
        fontWeight: '700',
        marginTop: 2,
    },
    copyDone: {
        color: '#10b981',
    },
    openBtn: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    openBtnText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '800',
    },
    transparencyBox: {
        marginTop: 40,
    },
    transparencyText: {
        color: '#475569',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        backgroundColor: '#121418',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
    },
    resetBtn: {
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 100,
        alignItems: 'center',
    },
    resetBtnText: {
        color: '#121418',
        fontSize: 16,
        fontWeight: '800',
    },
});

export default SuccessExportScreen;
