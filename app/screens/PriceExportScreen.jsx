import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Switch, StatusBar, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';

const MarketToggle = ({ name, active, onToggle }) => (
    <TouchableOpacity style={styles.toggleRow} onPress={onToggle} activeOpacity={0.7}>
        <Text style={styles.marketName}>{name}</Text>
        <Switch
            value={active}
            onValueChange={onToggle}
            trackColor={{ false: '#2d3139', true: '#8b5cf6' }}
            thumbColor="#fff"
        />
    </TouchableOpacity>
);

const PriceExportScreen = ({ onNext, onCancel }) => {
    const [price, setPrice] = useState('');
    const [selected, setSelected] = useState({ vinted: true, ebay: true, subito: true });
    const [language, setLanguage] = useState('Italian');

    const toggle = (m) => setSelected(prev => ({ ...prev, [m]: !prev[m] }));

    return (
        <View style={styles.mainWrapper}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safeArea}>
                {/* Header con tasto Annulla */}
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={onCancel} style={styles.backBtn} hitSlop={20}>
                        <Text style={styles.backIcon}>✕</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Export Finale</Text>
                    <View style={{ width: 40 }} />
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 }}>
                        <Text style={styles.title}>Quanto chiedi?</Text>
                        <Text style={styles.subtitle}>Il prezzo è sempre deciso da te.</Text>

                        <View style={styles.priceContainer}>
                            <Text style={styles.currency}>€</Text>
                            <TextInput
                                style={styles.priceInput}
                                keyboardType="numeric"
                                value={price}
                                onChangeText={setPrice}
                                placeholder="0"
                                placeholderTextColor="rgba(255,255,255,0.05)"
                                maxLength={6}
                                autoFocus={true}
                            />
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionHeader}>LINGUA ANNUNCIO</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.langList}>
                                {[
                                    { id: 'Italian', label: 'Italiano', flag: '🇮🇹' },
                                    { id: 'English', label: 'English', flag: '🇬🇧' },
                                    { id: 'French', label: 'Français', flag: '🇫🇷' },
                                    { id: 'German', label: 'Deutsch', flag: '🇩🇪' },
                                    { id: 'Spanish', label: 'Español', flag: '🇪🇸' },
                                ].map((lang) => (
                                    <TouchableOpacity
                                        key={lang.id}
                                        style={[styles.langChip, language === lang.id && styles.langChipActive]}
                                        onPress={() => setLanguage(lang.id)}
                                    >
                                        <Text style={styles.langFlag}>{lang.flag}</Text>
                                        <Text style={[styles.langText, language === lang.id && styles.langTextActive]}>{lang.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionHeader}>CANALI DI VENDITA</Text>
                            <View style={styles.groupCard}>
                                <MarketToggle name="Vinted" active={selected.vinted} onToggle={() => toggle('vinted')} />
                                <View style={styles.innerDivider} />
                                <MarketToggle name="eBay" active={selected.ebay} onToggle={() => toggle('ebay')} />
                                <View style={styles.innerDivider} />
                                <MarketToggle name="Subito.it" active={selected.subito} onToggle={() => toggle('subito')} />
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.nextBtn, !price && styles.nextBtnDisabled]}
                        onPress={() => onNext({ price, language })}
                        disabled={!price}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.nextBtnText}>Prepara bozze finali</Text>
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
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        height: 60,
    },
    backIcon: {
        color: '#64748b',
        fontSize: 22,
        fontWeight: '300',
    },
    headerTitle: {
        color: '#e2e8f0',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    content: {
        padding: 24,
        flex: 1,
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    subtitle: {
        color: '#94a3b8',
        fontSize: 15,
        marginTop: 8,
        lineHeight: 22,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 60,
    },
    currency: {
        color: '#8b5cf6',
        fontSize: 40,
        fontWeight: '900',
        marginRight: 15,
    },
    priceInput: {
        color: '#fff',
        fontSize: 100, // Prezzo gigante per enfasi
        fontWeight: '900',
        minWidth: 120,
        textAlign: 'center',
        letterSpacing: -2,
    },
    section: {
        marginTop: 20,
    },
    sectionHeader: {
        color: '#475569',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.5,
        marginBottom: 15,
        marginLeft: 4,
    },
    groupCard: {
        backgroundColor: '#1e2229',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#2d333d',
        paddingHorizontal: 4,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 18,
    },
    marketName: {
        color: '#f1f5f9',
        fontSize: 16,
        fontWeight: '600',
    },
    innerDivider: {
        height: 1,
        backgroundColor: '#2d333d',
        marginHorizontal: 16,
    },
    footer: {
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        backgroundColor: '#121418',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
    },
    nextBtn: {
        backgroundColor: '#8b5cf6',
        padding: 18,
        borderRadius: 100,
        alignItems: 'center',
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    nextBtnDisabled: {
        opacity: 0.3,
        backgroundColor: '#1e2229',
    },
    nextBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },
    langList: {
        gap: 12,
        paddingLeft: 4,
    },
    langChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e2229',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#2d333d',
    },
    langChipActive: {
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        borderColor: '#8b5cf6',
    },
    langFlag: {
        fontSize: 18,
        marginRight: 8,
    },
    langText: {
        color: '#94a3b8',
        fontSize: 14,
        fontWeight: '700',
    },
    langTextActive: {
        color: '#fff',
    },
});

export default PriceExportScreen;
