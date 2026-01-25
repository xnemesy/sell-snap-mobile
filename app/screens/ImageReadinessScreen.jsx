import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, StatusBar, Platform } from 'react-native';

const ReadinessRow = ({ name, status, icon }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'ready': return '#10b981';
            case 'attention': return '#f59e0b';
            case 'not_recommended': return '#ef4444';
            default: return '#94a3b8';
        }
    };

    const getStatusLabel = () => {
        switch (status) {
            case 'ready': return 'Ottimale';
            case 'attention': return 'Da verificare';
            case 'not_recommended': return 'Non raccomandato';
            default: return 'Sconosciuto';
        }
    };

    return (
        <View style={styles.row}>
            <View style={styles.rowLeft}>
                <View style={styles.iconBox}>
                    <Text style={styles.marketIcon}>{icon}</Text>
                </View>
                <Text style={styles.marketName}>{name}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '15', borderColor: getStatusColor() + '30' }]}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
                <Text style={[styles.statusText, { color: getStatusColor() }]}>{getStatusLabel()}</Text>
            </View>
        </View>
    );
};

const ImageReadinessScreen = ({ onNext, onCancel }) => {
    return (
        <View style={styles.mainWrapper}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safeArea}>
                {/* Header con tasto Annulla */}
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={onCancel} style={styles.backBtn} hitSlop={20}>
                        <Text style={styles.backIcon}>✕</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Check Qualità</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                    <View style={styles.intro}>
                        <Text style={styles.title}>Compatibilità Flash</Text>
                        <Text style={styles.subtitle}>Verifica che le foto siano ottimali per i marketplace selezionati.</Text>
                    </View>

                    <View style={styles.list}>
                        <ReadinessRow name="Vinted" status="ready" icon="👗" />
                        <ReadinessRow name="eBay" status="attention" icon="📦" />
                        <ReadinessRow name="Subito.it" status="ready" icon="🇮🇹" />
                    </View>

                    <View style={styles.detailBox}>
                        <Text style={styles.detailTitle}>NOTIFICA EBAY</Text>
                        <Text style={styles.detailText}>
                            Una delle foto caricate ha una risoluzione inferiore a quella consigliata. Gemini Flash compenserà i dettagli mancanti, ma il risultato finale potrebbe richiedere un controllo extra.
                        </Text>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.nextBtn} onPress={onNext} activeOpacity={0.8}>
                        <Text style={styles.nextBtnText}>Prosegui all'Analisi AI</Text>
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
    scroll: {
        padding: 24,
        paddingBottom: 120,
    },
    intro: {
        marginBottom: 35,
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
    list: {
        gap: 15,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1e2229',
        padding: 16,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#2d333d',
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    iconBox: {
        width: 40,
        height: 40,
        backgroundColor: '#121418',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    marketIcon: {
        fontSize: 20,
    },
    marketName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 100,
        borderWidth: 1,
        gap: 8,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    detailBox: {
        marginTop: 40,
        backgroundColor: 'rgba(245, 158, 11, 0.03)',
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(245, 158, 11, 0.1)',
    },
    detailTitle: {
        color: '#f59e0b',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
        marginBottom: 10,
    },
    detailText: {
        color: '#94a3b8',
        fontSize: 14,
        lineHeight: 22,
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
    nextBtn: {
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 100,
        alignItems: 'center',
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 8,
    },
    nextBtnText: {
        color: '#121418',
        fontSize: 16,
        fontWeight: '800',
    },
});

export default ImageReadinessScreen;
