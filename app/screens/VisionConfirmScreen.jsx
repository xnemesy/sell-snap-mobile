import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import FactCard from '../components/FactCard';

const VisionConfirmScreen = ({ data, onUpdate, onConfirm }) => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.header}>
                    <Text style={styles.title}>Analisi Vision 🔍</Text>
                    <Text style={styles.subtitle}>Verifica che i dati minimi siano corretti.</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>OGGETTO</Text>
                    <FactCard label="Tipo" value={data.product.type} />
                    <FactCard label="Brand" value={data.product.brand} />
                    <FactCard label="Modello" value={data.product.model} />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>DETTAGLI</Text>
                    <FactCard label="Condizione" value={data.condition.level} />
                    {data.missing_or_uncertain.map((item, idx) => (
                        <FactCard key={idx} label="Da Confermare" value={item} isUncertain={true} />
                    ))}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
                    <Text style={styles.confirmBtnText}>Conferma Dati & Procedi</Text>
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
        padding: 20,
        paddingBottom: 100,
    },
    header: {
        marginBottom: 30,
        marginTop: 20,
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontFamily: 'sans-serif-condensed',
        fontWeight: '900',
    },
    subtitle: {
        color: '#94a3b8',
        fontSize: 16,
        marginTop: 5,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        color: '#6366f1',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 2,
        marginBottom: 15,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: '#0b0e14',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
    },
    confirmBtn: {
        backgroundColor: '#6366f1',
        padding: 18,
        borderRadius: 100,
        alignItems: 'center',
        elevation: 4,
    },
    confirmBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default VisionConfirmScreen;
