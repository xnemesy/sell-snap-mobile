import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';

const ExportAction = ({ label, icon, color, onPress }) => (
    <TouchableOpacity
        style={[styles.actionBtn, { borderColor: color + '40' }]}
        onPress={onPress}
    >
        <Text style={styles.actionIcon}>{icon}</Text>
        <Text style={[styles.actionLabel, { color: color }]}>{label}</Text>
    </TouchableOpacity>
);

const SuccessExportScreen = ({ onReset }) => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.successIcon}>
                    <Text style={{ fontSize: 60 }}>✅</Text>
                </View>
                <Text style={styles.title}>Bozze pronte!</Text>
                <Text style={styles.subtitle}>Puoi ora pubblicare manualmente sulle piattaforme.</Text>

                <View style={styles.actions}>
                    <ExportAction label="Copia testo Vinted" icon="👗" color="#10b981" onPress={() => alert('Copiato!')} />
                    <ExportAction label="Apri Vinted" icon="↗️" color="#10b981" onPress={() => alert('Apertura Vinted...')} />

                    <View style={styles.divider} />

                    <ExportAction label="Copia testo eBay" icon="📦" color="#6366f1" onPress={() => alert('Copiato!')} />
                    <ExportAction label="Apri eBay" icon="↗️" color="#6366f1" onPress={() => alert('Apertura eBay...')} />

                    <View style={styles.divider} />

                    <ExportAction label="Copia testo Subito" icon="🇮🇹" color="#ef4444" onPress={() => alert('Copiato!')} />
                    <ExportAction label="Apri Subito" icon="↗️" color="#ef4444" onPress={() => alert('Apertura Subito...')} />
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.resetBtn} onPress={onReset}>
                    <Text style={styles.resetBtnText}>Finito, torna alla Home</Text>
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
        alignItems: 'center',
    },
    successIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 40,
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '900',
        marginBottom: 8,
    },
    subtitle: {
        color: '#94a3b8',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
    },
    actions: {
        width: '100%',
        gap: 12,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    actionIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    actionLabel: {
        fontSize: 16,
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        marginVertical: 10,
    },
    footer: {
        padding: 24,
    },
    resetBtn: {
        padding: 18,
        borderRadius: 100,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    resetBtnText: {
        color: '#94a3b8',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default SuccessExportScreen;
