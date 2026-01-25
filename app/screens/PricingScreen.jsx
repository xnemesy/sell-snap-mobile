import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, StatusBar, Platform } from 'react-native';

const { height } = Dimensions.get('window');

const Feature = ({ text, included = true }) => (
    <View style={styles.featureRow}>
        <View style={[styles.dot, !included && styles.disabledDot]} />
        <Text style={[styles.featureText, !included && styles.disabledText]}>{text}</Text>
    </View>
);

const PricingScreen = ({ onPlanSelect, onBack, limitReached }) => {
    return (
        <View style={styles.mainWrapper}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safeArea}>
                {/* Header con tasto Chiudi rapido */}
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={20}>
                        <Text style={styles.backIcon}>✕</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Abbonamento</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                    <View style={styles.hero}>
                        <Text style={styles.title}>
                            {limitReached ? "Limite raggiunto" : "Sblocca il potenziale"}
                        </Text>
                        <Text style={styles.subtitle}>
                            {limitReached
                                ? "Hai finito i tuoi 3 annunci gratuiti per oggi. Vuoi continuare ora?"
                                : "Scegli come vuoi utilizzare SellSnap. L'etica è inclusa in ogni piano."}
                        </Text>
                    </View>

                    {/* CARD PRO */}
                    <View style={[styles.card, styles.proCard]}>
                        <View style={styles.proHeader}>
                            <View>
                                <Text style={styles.planName}>SELLSNAP PRO</Text>
                                <Text style={styles.planBadgeText}>SCELTA MIGLIORE</Text>
                            </View>
                            <Text style={styles.proIcon}>💎</Text>
                        </View>

                        <View style={styles.pricesRow}>
                            <View style={styles.priceCol}>
                                <Text style={styles.planPrice}>€6,99</Text>
                                <Text style={styles.period}>MENSILE</Text>
                            </View>
                            <View style={styles.priceDivider} />
                            <View style={styles.priceCol}>
                                <Text style={styles.planPrice}>€59</Text>
                                <Text style={styles.period}>ANNUALE</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.features}>
                            <Feature text="Annunci illimitati ogni giorno" />
                            <Feature text="Cronologia intelligente delle bozze" />
                            <Feature text="AI Adaptive (impara il tuo stile)" />
                            <Feature text="Priorità analisi nelle ore di punta" />
                            <Feature text="Nessun limite di caricamento foto" />
                        </View>

                        <TouchableOpacity
                            style={styles.primaryBtn}
                            onPress={() => onPlanSelect('pro_monthly')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.primaryBtnText}>Prova Pro Mensile</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.yearlyBtn}
                            onPress={() => onPlanSelect('pro_yearly')}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.yearlyBtnText}>Pro Annuale (Risparmi €24)</Text>
                        </TouchableOpacity>
                    </View>

                    {/* CARD FREE */}
                    <View style={styles.card}>
                        <Text style={styles.planName}>SELLSNAP FREE</Text>
                        <Text style={styles.planPriceFree}>O€</Text>
                        <Text style={styles.planDescFree}>Per vendite occasionali e cura dei dettagli.</Text>

                        <View style={styles.divider} />

                        <View style={styles.features}>
                            <Feature text="3 annunci completi al giorno" />
                            <Feature text="Analisi Gemini Flash inclusa" />
                            <Feature text="Controllo manuale totale" />
                            <Feature text="Esporta su tutti i marketplace" />
                        </View>

                        <TouchableOpacity
                            style={styles.secondaryBtn}
                            onPress={() => onPlanSelect('free')}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.secondaryBtnText}>Continua con Free</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.ethicalNote}>
                        <Text style={styles.noteTitle}>LA NOSTRA PROMESSA</Text>
                        <Text style={styles.noteText}>
                            Qualunque piano tu scelga, SellSnap non pubblicherà mai senza il tuo permesso e non userà i tuoi dati per addestrare modelli esterni.
                        </Text>
                    </View>

                </ScrollView>
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
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 1,
    },
    scroll: {
        padding: 24,
        paddingBottom: 40,
    },
    hero: {
        marginBottom: 40,
    },
    title: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: -1,
    },
    subtitle: {
        color: '#94a3b8',
        fontSize: 16,
        marginTop: 10,
        lineHeight: 24,
    },
    card: {
        backgroundColor: '#1e2229',
        borderRadius: 32,
        padding: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#2d333d',
    },
    proCard: {
        backgroundColor: '#1a1825', // Viola molto scuro e profondo
        borderColor: '#8b5cf6',
        borderWidth: 1.5,
    },
    proHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    planName: {
        color: '#8b5cf6',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1.5,
    },
    planBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
        marginTop: 4,
        opacity: 0.6,
    },
    proIcon: {
        fontSize: 32,
    },
    pricesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    priceCol: {
        flex: 1,
    },
    planPrice: {
        color: '#fff',
        fontSize: 36,
        fontWeight: '900',
        letterSpacing: -1,
    },
    period: {
        color: '#64748b',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
        marginTop: 4,
    },
    priceDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginHorizontal: 15,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginVertical: 20,
    },
    features: {
        marginBottom: 30,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#8b5cf6',
    },
    disabledDot: {
        backgroundColor: '#334155',
    },
    featureText: {
        color: '#cbd5e1',
        fontSize: 15,
        fontWeight: '500',
    },
    disabledText: {
        color: '#475569',
    },
    primaryBtn: {
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
    primaryBtnText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 16,
    },
    yearlyBtn: {
        marginTop: 15,
        padding: 18,
        borderRadius: 100,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.3)',
    },
    yearlyBtnText: {
        color: '#a78bfa',
        fontWeight: '700',
        fontSize: 14,
    },
    planPriceFree: {
        color: '#fff',
        fontSize: 36,
        fontWeight: '900',
        marginVertical: 10,
    },
    planDescFree: {
        color: '#64748b',
        fontSize: 14,
        marginBottom: 10,
    },
    secondaryBtn: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        padding: 18,
        borderRadius: 100,
        alignItems: 'center',
    },
    secondaryBtnText: {
        color: '#64748b',
        fontWeight: '700',
        fontSize: 15,
    },
    ethicalNote: {
        backgroundColor: 'rgba(255, 255, 255, 0.01)',
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.03)',
        marginBottom: 20,
    },
    noteTitle: {
        color: '#475569',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
        marginBottom: 8,
        textAlign: 'center',
    },
    noteText: {
        color: '#64748b',
        fontSize: 13,
        lineHeight: 20,
        textAlign: 'center',
    },
});

export default PricingScreen;
