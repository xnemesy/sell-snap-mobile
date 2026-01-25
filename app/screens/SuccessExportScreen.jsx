import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Animated, StatusBar, Platform } from 'react-native';

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

const SuccessExportScreen = ({ onReset, isPro }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

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

    return (
        <View style={styles.mainWrapper}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    <Animated.View style={[
                        styles.successIcon,
                        { transform: [{ scale: scaleAnim }], opacity: opacityAnim }
                    ]}>
                        <Text style={{ fontSize: 50 }}>✨</Text>
                    </Animated.View>

                    <Animated.View style={{ opacity: opacityAnim, alignItems: 'center', paddingHorizontal: 20 }}>
                        <Text style={styles.title}>Ottimo lavoro!</Text>
                        <Text style={styles.subtitle}>
                            Le tue bozze sono pronte. Puoi copiarle e incollarle sui tuoi marketplace preferiti.
                        </Text>
                    </Animated.View>

                    <View style={styles.actions}>
                        <Text style={styles.sectionHeader}>VINTED</Text>
                        <View style={styles.groupCard}>
                            <ExportAction label="Copia testo" icon="📋" color="#10b981" onPress={() => alert('Copiato!')} />
                            <View style={styles.innerDivider} />
                            <ExportAction label="Apri app Vinted" icon="↗️" color="#10b981" onPress={() => alert('Apertura...')} />
                        </View>

                        <Text style={styles.sectionHeader}>EBAY</Text>
                        <View style={styles.groupCard}>
                            <ExportAction label="Copia testo" icon="📋" color="#8b5cf6" onPress={() => alert('Copiato!')} />
                            <View style={styles.innerDivider} />
                            <ExportAction label="Apri app eBay" icon="↗️" color="#8b5cf6" onPress={() => alert('Apertura...')} />
                        </View>

                        <Text style={styles.sectionHeader}>SUBITO.IT</Text>
                        <View style={styles.groupCard}>
                            <ExportAction label="Copia testo" icon="📋" color="#f43f5e" onPress={() => alert('Copiato!')} />
                            <View style={styles.innerDivider} />
                            <ExportAction label="Apri app Subito" icon="↗️" color="#f43f5e" onPress={() => alert('Apertura...')} />
                        </View>
                    </View>

                    {!isPro && (
                        <TouchableOpacity style={styles.proHintBox} activeOpacity={0.8}>
                            <Text style={styles.proHintText}>
                                💎 Passa a Pro per salvare la cronologia e non dover ricopiare i dati la prossima volta.
                            </Text>
                        </TouchableOpacity>
                    )}
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
        paddingBottom: 120,
    },
    successIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 20,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.2)',
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
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 22,
    },
    actions: {
        width: '100%',
        marginTop: 40,
    },
    sectionHeader: {
        color: '#475569',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.5,
        marginBottom: 12,
        marginTop: 20,
        marginLeft: 4,
    },
    groupCard: {
        backgroundColor: '#1e2229',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#2d333d',
        paddingHorizontal: 4,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    actionIconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    actionIcon: {
        fontSize: 16,
    },
    actionLabel: {
        flex: 1,
        fontSize: 15,
        fontWeight: '700',
    },
    chevron: {
        color: '#334155',
        fontSize: 18,
    },
    innerDivider: {
        height: 1,
        backgroundColor: '#2d333d',
        marginHorizontal: 16,
    },
    proHintBox: {
        marginTop: 40,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    proHintText: {
        color: '#64748b',
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 20,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        backgroundColor: '#121418',
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
