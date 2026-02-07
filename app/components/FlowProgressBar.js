import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../design/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PROGRESS_BAR_WIDTH = SCREEN_WIDTH * 0.9;

/**
 * FlowProgressBar - Barra progresso animata per flow multi-step
 * 
 * @param {number} currentStep - Step corrente (1-based)
 * @param {number} totalSteps - Numero totale step
 * @param {string} stepLabel - Label descrittiva step corrente
 * @param {boolean} showPercentage - Mostra % invece di step numbers
 */
export const FlowProgressBar = ({
    currentStep,
    totalSteps,
    stepLabel,
    showPercentage = false,
}) => {
    const progressAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animazione ingresso al mount
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        // Animazione progresso ad ogni cambio step
        const targetProgress = (currentStep / totalSteps) * PROGRESS_BAR_WIDTH;

        Animated.spring(progressAnim, {
            toValue: targetProgress,
            damping: 15,
            stiffness: 150,
            useNativeDriver: false, // width non supporta native driver
        }).start();
    }, [currentStep, totalSteps]);

    const percentage = Math.round((currentStep / totalSteps) * 100);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            {/* Label e contatore */}
            <View style={styles.header}>
                <Text style={styles.label}>{stepLabel}</Text>
                <Text style={styles.counter}>
                    {showPercentage ? `${percentage}%` : `${currentStep}/${totalSteps}`}
                </Text>
            </View>

            {/* Barra progresso */}
            <View style={styles.track}>
                <Animated.View
                    style={[
                        styles.progress,
                        {
                            width: progressAnim,
                        },
                    ]}
                />
            </View>

            {/* Step indicators (dots) */}
            <View style={styles.dots}>
                {Array.from({ length: totalSteps }).map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            index < currentStep && styles.dotActive,
                            index === currentStep - 1 && styles.dotCurrent,
                        ]}
                    />
                ))}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        backgroundColor: Colors.bgPrimary,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    label: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    counter: {
        ...Typography.caption,
        color: Colors.primary,
        fontWeight: '700',
    },
    track: {
        width: PROGRESS_BAR_WIDTH,
        height: 6,
        backgroundColor: Colors.bgTertiary,
        borderRadius: BorderRadius.sm,
        overflow: 'hidden',
    },
    progress: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.sm,
    },
    dots: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: Spacing.sm,
        paddingHorizontal: Spacing.xs,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.bgTertiary,
    },
    dotActive: {
        backgroundColor: Colors.primaryLight,
    },
    dotCurrent: {
        backgroundColor: Colors.primary,
        width: 12,
        height: 12,
        borderRadius: 6,
    },
});

/**
 * Configurazione steps per App.js
 * Mappa status → step info
 */
export const FLOW_STEPS = {
    SNAP: {
        index: 1,
        total: 6,
        label: 'Scatta foto',
    },
    VISION: {
        index: 2,
        total: 6,
        label: 'Conferma dettagli',
    },
    READINESS: {
        index: 3,
        total: 6,
        label: 'Verifica dati',
    },
    LISTING: {
        index: 4,
        total: 6,
        label: 'Rivedi annunci',
    },
    PRICE: {
        index: 5,
        total: 6,
        label: 'Imposta prezzo',
    },
    SUCCESS: {
        index: 6,
        total: 6,
        label: 'Completato',
    },
};

// Stati da escludere (loading/transition)
export const EXCLUDED_FROM_PROGRESS = [
    'HOME',
    'ACCOUNT',
    'INVENTORY_DETAIL',
    'PRICING',
    'PROCESSING',
    'GENERATING_LISTINGS',
    'PUBLISHING',
];
