import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const SnapScreen = ({ onNext }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.cameraPlaceholder}>
                <Text style={styles.placeholderText}>📸 Camera Preview</Text>
                <Text style={styles.instructionText}>Inquadra l'oggetto in luce naturale</Text>
            </View>

            <View style={styles.controls}>
                <View style={styles.galleryPreview}>
                    <TouchableOpacity style={styles.thumbnail}>
                        <Text>🖼️</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.captureBtn} onPress={onNext}>
                    <View style={styles.captureBtnInner} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.flashBtn}>
                    <Text style={styles.btnIcon}>⚡</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>"Snap it. Review it. Sell it."</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    cameraPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111',
    },
    placeholderText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 10,
    },
    instructionText: {
        color: '#94a3b8',
        fontSize: 14,
    },
    controls: {
        height: 150,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: 20,
    },
    captureBtn: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureBtnInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#fff',
    },
    thumbnail: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    flashBtn: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnIcon: {
        fontSize: 24,
    },
    footer: {
        padding: 10,
        alignItems: 'center',
    },
    footerText: {
        color: '#444',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
    },
});

export default SnapScreen;
