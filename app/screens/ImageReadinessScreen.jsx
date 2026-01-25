import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';

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
            case 'ready': return 'Ready';
            case 'attention': return 'Needs Attention';
            case 'not_recommended': return 'Not Recommended';
            default: return 'Unknown';
        }
    };

    return (
        <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
                <Text style={styles.marketIcon}>{icon}</Text>
                <Text style={styles.marketName}>{name}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20', borderColor: getStatusColor() + '40' }]}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
                <Text style={[styles.statusText, { color: getStatusColor() }]}>{getStatusLabel()}</Text>
            </View>
        </TouchableOpacity>
    );
};

const ImageReadinessScreen = ({ onNext }) => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>Prontezza immagini</Text>
                <Text style={styles.subtitle}>Compatibility check for each marketplace</Text>

                <View style={styles.list}>
                    <ReadinessRow name="Vinted" status="ready" icon="👗" />
                    <ReadinessRow name="eBay" status="attention" icon="📦" />
                    <ReadinessRow name="Subito.it" status="ready" icon="🇮🇹" />
                </View>

                <View style={styles.detailBox}>
                    <Text style={styles.detailTitle}>DETTAGLIO EBAY</Text>
                    <Text style={styles.detailText}>• Una foto ha una risoluzione inferiore a 1600x1600</Text>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.nextBtn} onPress={onNext}>
                    <Text style={styles.nextBtnText}>Continua</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0b0e14',
    },
    scroll: {
        padding: 24,
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '900',
        marginTop: 20,
    },
    subtitle: {
        color: '#94a3b8',
        fontSize: 14,
        marginTop: 4,
        marginBottom: 40,
    },
    list: {
        gap: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    marketIcon: {
        fontSize: 24,
    },
    marketName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 100,
        borderWidth: 1,
        gap: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    detailBox: {
        marginTop: 40,
        backgroundColor: 'rgba(245, 158, 11, 0.05)',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(245, 158, 11, 0.2)',
    },
    detailTitle: {
        color: '#f59e0b',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
        marginBottom: 8,
    },
    detailText: {
        color: '#fff',
        fontSize: 14,
        lineHeight: 20,
    },
    footer: {
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
    },
    nextBtn: {
        backgroundColor: '#6366f1',
        padding: 18,
        borderRadius: 100,
        alignItems: 'center',
    },
    nextBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default ImageReadinessScreen;
