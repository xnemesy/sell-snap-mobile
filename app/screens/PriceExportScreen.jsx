import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Switch } from 'react-native';

const MarketToggle = ({ name, active, onToggle }) => (
    <View style={styles.toggleRow}>
        <Text style={styles.marketName}>{name}</Text>
        <Switch
            value={active}
            onValueChange={onToggle}
            trackColor={{ false: '#1e293b', true: '#6366f1' }}
            thumbColor={active ? '#fff' : '#94a3b8'}
        />
    </View>
);

const PriceExportScreen = ({ onNext }) => {
    const [price, setPrice] = useState('0');
    const [selected, setSelected] = useState({ vinted: true, ebay: true, subito: true });

    const toggle = (m) => setSelected(prev => ({ ...prev, [m]: !prev[m] }));

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Prezzo finale</Text>
                <Text style={styles.subtitle}>Il prezzo è sempre deciso da te</Text>

                <View style={styles.priceContainer}>
                    <Text style={styles.currency}>€</Text>
                    <TextInput
                        style={styles.priceInput}
                        keyboardType="numeric"
                        value={price}
                        onChangeText={setPrice}
                        maxLength={6}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>PREPARA PER</Text>
                    <MarketToggle name="Vinted" active={selected.vinted} onToggle={() => toggle('vinted')} />
                    <MarketToggle name="eBay" active={selected.ebay} onToggle={() => toggle('ebay')} />
                    <MarketToggle name="Subito.it" active={selected.subito} onToggle={() => toggle('subito')} />
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.nextBtn} onPress={onNext}>
                    <Text style={styles.nextBtnText}>Prepare drafts</Text>
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
    content: {
        padding: 24,
        flex: 1,
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
        marginBottom: 60,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 60,
    },
    currency: {
        color: '#6366f1',
        fontSize: 48,
        fontWeight: '900',
        marginRight: 10,
    },
    priceInput: {
        color: '#fff',
        fontSize: 64,
        fontWeight: '900',
        minWidth: 100,
        textAlign: 'center',
    },
    section: {
        gap: 16,
    },
    sectionTitle: {
        color: '#6366f1',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2,
        marginBottom: 8,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        padding: 16,
        borderRadius: 12,
    },
    marketName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
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

export default PriceExportScreen;
