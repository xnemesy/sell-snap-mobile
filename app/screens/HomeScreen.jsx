import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Platform, Dimensions, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const InventoryItem = ({ item, onSelect }) => (
    <TouchableOpacity style={styles.inventoryCard} onPress={() => onSelect(item)} activeOpacity={0.7}>
        <View style={styles.inventoryIconBox}>
            {item.coverImage ? (
                <Image
                    source={{ uri: item.coverImage }}
                    style={styles.inventoryImage}
                    resizeMode="cover"
                />
            ) : (
                <Text style={{ fontSize: 18, color: '#64748b' }}>#</Text>
            )}
        </View>
        <View style={styles.inventoryInfo}>
            <Text style={styles.inventoryTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.inventorySub}>Modello: {item.sku} • {item.date}</Text>
        </View>
        <View style={styles.actionCol}>
            <Text style={styles.inventoryPrice}>€{item.price}</Text>
            <View style={styles.baseBadge}>
                <Text style={styles.baseText}>Usa come base</Text>
            </View>
        </View>
    </TouchableOpacity>
);

const HomeScreen = ({ onStartNew, onOpenAccount, isPro, remainingAds, inventory, onSelectItem }) => {
    const [search, setSearch] = useState('');

    const filteredInventory = inventory.filter(item =>
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.sku?.toLowerCase().includes(search.toLowerCase())
    );

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
                            <Text style={styles.createTitle}>Vendi nuovo oggetto</Text>
                            <Text style={styles.createSubtitle}>Scatta, analizza e pubblica in pochi tap.</Text>
                        </View>
                        <View style={styles.createIconContainer}>
                            <Text style={styles.cameraIcon}>+</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.section}>
                        <View style={styles.sectionHeaderCol}>
                            <Text style={styles.sectionTitle}>Archivio</Text>
                            <Text style={styles.sectionSub}>Oggetti che hai già venduto o riutilizzato</Text>

                            <View style={styles.searchBar}>
                                <Text style={styles.searchIcon}>🔍</Text>
                                <TextInput
                                    placeholder="Cerca per codice modello, categoria o nome"
                                    placeholderTextColor="#475569"
                                    style={styles.searchInput}
                                    value={search}
                                    onChangeText={setSearch}
                                />
                            </View>
                        </View>

                        {inventory.length === 0 ? (
                            <View style={styles.emptyCard}>
                                <View style={styles.emptyIconCircle}>
                                    <Text style={styles.emptyIcon}>Ø</Text>
                                </View>
                                <Text style={styles.emptyTitle}>Il tuo archivio è vuoto.</Text>
                                <Text style={styles.emptySubtitle}>Qui troverai gli oggetti che hai già preparato con SellSnap.</Text>
                            </View>
                        ) : (
                            <View style={styles.inventoryList}>
                                {filteredInventory.map(item => <InventoryItem key={item.id} item={item} onSelect={onSelectItem} />)}
                            </View>
                        )}
                    </View>

                    <View style={styles.tipCard}>
                        <View style={styles.tipHeader}>
                            <Text style={styles.tipIcon}>💡</Text>
                            <Text style={styles.tipLabel}>RISPARMIO TEMPO</Text>
                        </View>
                        <Text style={styles.tipContent}>
                            La duplicazione accelera il lavoro. Recupereremo brand e modello, tu aggiungerai solo le nuove foto.
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
    },
    createTitle: {
        color: '#121418',
        fontSize: 22,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    createSubtitle: {
        color: '#64748b',
        fontSize: 13,
        marginTop: 6,
        lineHeight: 18,
    },
    createIconContainer: {
        width: 65,
        height: 65,
        backgroundColor: '#f1f5f9',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraIcon: {
        fontSize: 32,
        color: '#121418',
        fontWeight: '300'
    },
    section: {
        marginBottom: 40,
    },
    sectionHeaderCol: {
        marginBottom: 20,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
    },
    sectionSub: {
        color: '#475569',
        fontSize: 13,
        marginTop: 4,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e2229',
        borderRadius: 14,
        paddingHorizontal: 15,
        marginTop: 15,
        height: 48,
        borderWidth: 1,
        borderColor: '#2d333d',
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 10,
    },
    searchInput: {
        color: '#fff',
        flex: 1,
        fontSize: 14,
    },
    emptyCard: {
        paddingVertical: 45,
        alignItems: 'center',
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
    emptyTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    emptySubtitle: {
        color: '#475569',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 6,
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
    actionCol: {
        alignItems: 'flex-end',
        gap: 6,
    },
    inventoryPrice: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },
    baseBadge: {
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    baseText: {
        color: '#a78bfa',
        fontSize: 10,
        fontWeight: '800',
    },
    inventoryImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
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
