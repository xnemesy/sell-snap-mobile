import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const FactCard = ({ label, value, isUncertain, onPress }) => {
    return (
        <TouchableOpacity
            style={[styles.card, isUncertain && styles.uncertainCard]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.content}>
                <Text style={styles.label}>{label.toUpperCase()}</Text>
                <Text style={styles.value}>{value || 'Non specificato'}</Text>
            </View>
            <Text style={styles.arrow}>{isUncertain ? '⚠️' : '>'}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    uncertainCard: {
        borderColor: '#fbbf24',
        backgroundColor: 'rgba(251, 191, 36, 0.05)',
    },
    content: {
        flex: 1,
    },
    label: {
        color: '#94a3b8',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 4,
    },
    value: {
        color: '#f8fafc',
        fontSize: 16,
        fontWeight: '600',
    },
    arrow: {
        color: '#94a3b8',
        fontSize: 18,
        marginLeft: 10,
    },
});

export default FactCard;
