import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, StatusBar, Platform, Dimensions, Image } from 'react-native';

const { width } = Dimensions.get('window');

const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
    </View>
);

const InventoryDetailScreen = ({ item, onBack, onDuplicate }) => {
    if (!item) return null;

    return (
        <View style={styles.mainWrapper}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={20}>
                        <Text style={styles.backIcon}>✕</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Dettaglio Oggetto</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.heroSection}>
                        <View style={styles.imagePlaceholder}>
                            {item.coverImage ? (
                                <Image
                                    source={{ uri: item.coverImage }}
                                    style={styles.heroImage}
                                    resizeMode="cover"
                                />
                            ) : (
                                <Text style={{ fontSize: 50 }}>📦</Text>
                            )}
                        </View>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.skuText}>Modello: {item.sku}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>INFO SECTION (READ-ONLY)</Text>
                        <View style={styles.groupCard}>
                            <InfoRow label="Categoria" value={item.raw_data?.product?.category_hint || "N/A"} />
                            <View style={styles.innerDivider} />
                            <InfoRow label="Condizione" value={item.raw_data?.condition?.level || "N/A"} />
                            <View style={styles.innerDivider} />
                            <InfoRow label="Marketplace usati" value="Vinted, eBay, Subito" />
                        </View>
                    </View>

                    <View style={styles.actionSection}>
                        <TouchableOpacity style={styles.primaryBtn} onPress={() => onDuplicate(item)}>
                            <Text style={styles.primaryBtnText}>Crea annuncio simile</Text>
                        </TouchableOpacity>
                        <Text style={styles.microCopy}>Useremo la struttura. I dettagli li confermi tu.</Text>
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
    header: {
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
        textTransform: 'uppercase',
    },
    content: {
        padding: 24,
        paddingBottom: 40,
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    imagePlaceholder: {
        width: 200,
        height: 200,
        borderRadius: 32,
        backgroundColor: '#1e2229',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#2d333d',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        borderRadius: 32,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '900',
        textAlign: 'center',
    },
    skuText: {
        color: '#64748b',
        fontSize: 14,
        marginTop: 4,
        fontWeight: '600',
    },
    section: {
        marginBottom: 40,
    },
    sectionHeader: {
        color: '#475569',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
        marginBottom: 15,
        marginLeft: 5,
    },
    groupCard: {
        backgroundColor: '#1e2229',
        borderRadius: 24,
        paddingHorizontal: 5,
        borderWidth: 1,
        borderColor: '#2d333d',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 18,
    },
    infoLabel: {
        color: '#475569',
        fontSize: 14,
        fontWeight: '700',
    },
    infoValue: {
        color: '#f1f5f9',
        fontSize: 14,
        fontWeight: '600',
    },
    innerDivider: {
        height: 1,
        backgroundColor: '#2d333d',
        marginHorizontal: 18,
    },
    actionSection: {
        alignItems: 'center',
        marginTop: 20,
    },
    primaryBtn: {
        backgroundColor: '#8b5cf6',
        width: '100%',
        padding: 20,
        borderRadius: 100,
        alignItems: 'center',
        marginBottom: 15,
    },
    primaryBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },
    microCopy: {
        color: '#475569',
        fontSize: 13,
        fontWeight: '500',
    }
});

export default InventoryDetailScreen;
