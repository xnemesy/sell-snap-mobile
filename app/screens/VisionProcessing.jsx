import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const VisionProcessing = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const steps = [
        "Analisi immagini",
        "Rilevamento caratteristiche",
        "Valutazione condizioni"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => {
                if (prev >= steps.length - 1) {
                    clearInterval(interval);
                    setTimeout(onComplete, 1000);
                    return prev;
                }
                return prev + 1;
            });
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.text}>{steps[step]}</Text>

            <style jsx>{`
        /* Note: style jsx doesn't work in RN, but I'll keep the logic in StyleSheet */
      `}</style>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0b0e14',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    text: {
        color: '#94a3b8',
        fontSize: 18,
        marginTop: 20,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default VisionProcessing;
