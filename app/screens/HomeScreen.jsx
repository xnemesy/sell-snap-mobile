import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, StatusBar, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const InventoryItem = ({ item }) => (
    <TouchableOpacity style={styles.inventoryCard} activeOpacity={0.7}>
        <View style={styles.inventoryIconBox}>
            <Text style={{ fontSize: 20 }}>👟</Text>
        </View>
        <View style={styles.inventoryInfo}>
            <Text style={styles.inventoryTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.inventorySub}>SKU: {item.sku} • {item.date}</Text>
        </View>
        <Text style={styles.inventoryPrice}>€{item.price}</Text>
    </TouchableOpacity>
);

const HomeScreen = ({ onStartNew, onOpenAccount, isPro, remainingAds, inventory }) => {
    return (
        <View style={styles.mainWrapper}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.greeting}>Benvenuto su</Text>
                            <Text style={styles.logo}>SellSnap</Text>
                        </View>
                        <TouchableOpacity style={styles.profileBtn} onPress={onOpenAccount} activeOpacity={0.7}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>U</Text>
                            </View>
                            {isPro && <View style={styles.proIndicator} />}
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.statusBanner, isPro && styles.proBanner]}>
                        <View style={styles.statusInfo}>
                            <Text style={styles.statusLabel}>{isPro ? 'PIANO PRO' : 'PIANO GRATUITO'}</Text>
                            <Text style={styles.statusValue}>
                                {isPro ? 'Potenziale AI sbloccato' : `${remainingAds} annunci disponibili`}
                            </Text>
                        </View>
                        {!isPro && (
                            <TouchableOpacity style={styles.upgradeBtn} onPress={onOpenAccount}>
                                <Text style={styles.upgradeBtnText}>Sblocca</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <TouchableOpacity style={styles.createCard} onPress={onStartNew} activeOpacity={0.9}>
                        <View style={styles.createContent}>
                            <Text style={styles.createTitle}>Vendi ora</Text>
                            <Text style={styles.createSubtitle}>Scatta, analizza e pubblica{"\nin meno di 3 minuti."}</Text>
                        </View>
                        <View style={styles.createIconContainer}>
                            <Text style={styles.cameraEmoji}>📸</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Il tuo Archivio</Text>
                            {inventory && inventory.length > 0 && (
                                <TouchableOpacity>
                                    <Text style={styles.seeAll}>Gestisci</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {!inventory || inventory.length === 0 ? (
                            <View style={styles.emptyCard}>
                                <View style={styles.emptyIconCircle}>
                                    <Text style={styles.emptyIcon}>📦</Text>
                                </View>
                                <Text style={styles.emptyText}>Ancora nessun annuncio in archivio.</Text>
                            </View>
                        ) : (
                            <View style={styles.inventoryList}>
                                {inventory.map(item => <InventoryItem key={item.id} item={item} />)}
                            </View>
                        )}
                    </View>

                    <View style={styles.tipCard}>
                        <View style={styles.tipHeader}>
                            <Text style={styles.tipIcon}>💡</Text>
                            <Text style={styles.tipLabel}>CONSIGLIO PRO</Text>
                        </View>
                        <Text style={styles.tipContent}>
                            Inquadra sempre l'etichetta della scatola per far sì che l'AI recuperi automaticamente i dati ufficiali.
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
    content: {
        paddingHorizontal: 25,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 20,
    },
    greeting: {
        color: '#64748b',
        fontSize: 14,
        fontWeight: '600',
    },
    logo: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: -1,
    },
    profileBtn: {
        position: 'relative',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#1e2229',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2d333d',
    },
    proIndicator: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#8b5cf6',
        borderWidth: 2,
        borderColor: '#121418',
    },
    avatarText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    statusBanner: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 24,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#1e2229',
        marginBottom: 30,
    },
    proBanner: {
        backgroundColor: 'rgba(139, 92, 246, 0.08)',
        borderColor: 'rgba(139, 92, 246, 0.2)',
    },
    statusLabel: {
        color: '#64748b',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    statusValue: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
        marginTop: 2,
    },
    upgradeBtn: {
        backgroundColor: '#8b5cf6',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
    },
    upgradeBtnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '800',
    },
    createCard: {
        backgroundColor: '#fff',
        borderRadius: 32,
        padding: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 45,
        elevation: 10,
    },
    createTitle: {
        color: '#121418',
        fontSize: 24,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    createSubtitle: {
        color: '#64748b',
        fontSize: 14,
        marginTop: 6,
        lineHeight: 20,
    },
    createIconContainer: {
        width: 65,
        height: 65,
        backgroundColor: '#f1f5f9',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraEmoji: {
        fontSize: 32,
    },
    section: {
        marginBottom: 40,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
    },
    seeAll: {
        color: '#8b5cf6',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyCard: {
        backgroundColor: 'rgba(255,255,255,0.01)',
        borderRadius: 28,
        paddingVertical: 45,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1e2229',
        borderStyle: 'dashed',
    },
    emptyIconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#1e2229',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    emptyIcon: {
        fontSize: 28,
    },
    emptyText: {
        color: '#475569',
        fontSize: 14,
        textAlign: 'center',
    },
    inventoryList: {
        gap: 12,
    },
    inventoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e2229',
        padding: 16,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#2d333d',
    },
    inventoryIconBox: {
        width: 48,
        height: 48,
        backgroundColor: '#121418',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    inventoryInfo: {
        flex: 1,
    },
    inventoryTitle: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
    inventorySub: {
        color: '#64748b',
        fontSize: 12,
        marginTop: 2,
    },
    inventoryPrice: {
        color: '#8b5cf6',
        fontSize: 16,
        fontWeight: '800',
    },
    tipCard: {
        backgroundColor: 'rgba(139, 92, 246, 0.05)',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.1)',
    },
    tipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    tipLabel: {
        color: '#8b5cf6',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1,
    },
    tipContent: {
        color: '#94a3b8',
        fontSize: 14,
        lineHeight: 20,
    }
});

export default HomeScreen;
