import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Modal } from 'react-native';

const PublishingOverlay = ({ visible, onComplete }) => {
    const [step, setStep] = useState(0);
    const steps = [
        "Checking image compatibility",
        "Formatting listing",
        "Draft preparation completed"
    ];

    useEffect(() => {
        if (visible) {
            let current = 0;
            const interval = setInterval(() => {
                if (current >= steps.length - 1) {
                    clearInterval(interval);
                    setTimeout(onComplete, 1000);
                } else {
                    current++;
                    setStep(current);
                }
            }, 1500);
            return () => clearInterval(interval);
        }
    }, [visible]);

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <ActivityIndicator size="large" color="#6366f1" />
                    <Text style={styles.title}>Preparazione bozze</Text>
                    <Text style={styles.subtitle}>{steps[step]}</Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    content: {
        alignItems: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '800',
        marginTop: 30,
        marginBottom: 10,
    },
    subtitle: {
        color: '#94a3b8',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default PublishingOverlay;
