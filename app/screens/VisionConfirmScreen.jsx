import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Animated, StatusBar, Platform } from 'react-native';
import FactCard from '../components/FactCard';

const VisionConfirmScreen = ({ data, onUpdate, onConfirm, onCancel }) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const hasUncertainties = data.missing_or_uncertain && data.missing_or_uncertain.length > 0;

    useEffect(() => {
        if (hasUncertainties) {
            Animated.sequence([
                Animated.delay(1000),
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, []);

    return (
        <View style={styles.mainWrapper}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safeArea}>
                {/* Header con tasto Annulla */}
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={onCancel} style={styles.backBtn} hitSlop={20}>
                        <Text style={styles.backIcon}>✕</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Verifica Dati</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                    <View style={styles.intro}>
                        <Text style={styles.title}>Analisi AI completata</Text>
                        <Text style={styles.subtitle}>Ecco cosa ho rilevato. Conferma i dettagli per generare gli annunci.</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>OGGETTO</Text>
                        <View style={styles.cardGroup}>
                            <FactCard label="Tipo" value={data.product.type} />
                            <View style={styles.cardDivider} />
                            <FactCard label="Brand" value={data.product.brand} />
                            <View style={styles.cardDivider} />
                            <FactCard label="Modello" value={data.product.model} />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>DETTAGLI RIPORTATI</Text>
                        <View style={styles.cardGroup}>
                            <FactCard label="Condizione" value={data.condition.level} />
                            {data.missing_or_uncertain.map((item, idx) => (
                                <View key={idx}>
                                    <View style={styles.cardDivider} />
                                    <FactCard label="Da Confermare" value={item} isUncertain={true} />
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.trustBanner}>
                        <Text style={styles.trustText}>🛡️ Questi dati verranno usati per scrivere annunci onesti e chiari. Tu rimani sempre in controllo.</Text>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <Animated.View style={{ transform: [{ scale: pulseAnim }], width: '100%' }}>
                        <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm} activeOpacity={0.8}>
                            <Text style={styles.confirmBtnText}>Crea Annunci Ora</Text>
                        </TouchableOpacity>
                    </Animated.View>
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
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        color: '#475569',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.5,
        marginBottom: 15,
        marginLeft: 4,
    },
    cardGroup: {
        backgroundColor: '#1e2229',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#2d333d',
        paddingHorizontal: 4,
    },
    cardDivider: {
        height: 1,
        backgroundColor: '#2d333d',
        marginHorizontal: 16,
    },
    trustBanner: {
        marginTop: 10,
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    trustText: {
        color: '#64748b',
        fontSize: 12,
        lineHeight: 18,
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
        alignItems: 'center',
    },
    confirmBtn: {
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
    confirmBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },
});

export default VisionConfirmScreen;
