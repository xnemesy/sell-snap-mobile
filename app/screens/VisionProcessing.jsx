import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated, StatusBar } from 'react-native';

const VisionProcessing = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const steps = [
        "Caricamento immagini...",
        "Identificazione prodotto",
        "Verifica dettagli e condizioni",
        "Generazione descrizioni"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev >= steps.length - 1) {
                    clearInterval(interval);
                    setTimeout(onComplete, 800);
                    return prev;
                }
                return prev + 1;
            });
        }, 2200);
        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.loaderIcon}>
                <ActivityIndicator size="large" color="#8b5cf6" />
            </View>

            <View style={styles.stepsContainer}>
                {steps.map((text, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;

                    return (
                        <View key={index} style={styles.stepRow}>
                            <View style={styles.iconContainer}>
                                {isCompleted ? (
                                    <Text style={styles.checkIcon}>✓</Text>
                                ) : isCurrent ? (
                                    <View style={styles.currentDot} />
                                ) : (
                                    <View style={styles.emptyDot} />
                                )}
                            </View>
                            <Text style={[
                                styles.stepText,
                                isCompleted && styles.completedText,
                                !isCompleted && !isCurrent && styles.pendingText
                            ]}>
                                {text}
                            </Text>
                        </View>
                    );
                })}
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerNote}>Elaborazione in corso...</Text>
                <Text style={styles.ethicsMotto}>Velocità • Semplicità • Ordine</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121418',
        justifyContent: 'center',
        padding: 40,
    },
    loaderIcon: {
        marginBottom: 60,
        alignItems: 'center',
    },
    stepsContainer: {
        gap: 28,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    iconContainer: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkIcon: {
        color: '#10b981',
        fontWeight: '900',
        fontSize: 20,
    },
    currentDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#8b5cf6',
    },
    emptyDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#334155',
    },
    stepText: {
        color: '#f1f5f9',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    completedText: {
        color: '#475569',
    },
    pendingText: {
        color: '#2d333d',
    },
    footer: {
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    footerNote: {
        color: '#64748b',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    ethicsMotto: {
        color: '#334155',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 3,
        textTransform: 'uppercase',
    }
});

export default VisionProcessing;
