import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, StatusBar, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

const SnapScreen = ({ onNext, isPro, remainingAds, onShowPricing, onCancel, isDuplicating }) => {
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            selectionLimit: 5,
            quality: 0.8,
            base64: true,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const base64Array = result.assets.map(asset => asset.base64);
            onNext(base64Array);
        }
    };

    return (
        <View style={styles.mainWrapper}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onCancel} style={styles.homeBtn} hitSlop={20}>
                        <Text style={styles.homeIcon}>✕</Text>
                    </TouchableOpacity>
                    <View style={styles.badgeContainer}>
                        {isPro ? (
                            <View style={[styles.statusBadge, styles.proBadge]}>
                                <Text style={styles.statusBadgeText}>PRO</Text>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.statusBadge} onPress={onShowPricing}>
                                <Text style={styles.statusBadgeText}>FREE • {remainingAds} RIMANENTI</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.cameraPlaceholder}>
                    {isDuplicating && (
                        <View style={styles.duplicationNotice}>
                            <Text style={styles.duplicationText}>Nuove foto per un nuovo annuncio</Text>
                        </View>
                    )}

                    <View style={styles.focusFrame}>
                        <Text style={styles.placeholderEmoji}>📸</Text>
                    </View>
                    <Text style={styles.instructionText}>Inquadra l'oggetto in luce naturale</Text>
                    <Text style={styles.subInstruction}>L'AI analizzerà i dettagli visibili</Text>

                    <View style={styles.tipBox}>
                        <Text style={styles.tipText}>"Sfondo semplice = più chiarezza."</Text>
                    </View>
                </View>

                <View style={styles.controls}>
                    <View style={styles.sideBtnContainer}>
                        <TouchableOpacity style={styles.galleryBtn} onPress={pickImage} activeOpacity={0.7}>
                            <Text style={styles.btnEmoji}>🖼️</Text>
                            <View style={styles.galleryIndicator}>
                                <Text style={styles.galleryLabel}>GALLERIA</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.captureBtn} onPress={() => onNext("")} activeOpacity={0.8}>
                        <View style={styles.captureBtnInner} />
                    </TouchableOpacity>

                    <View style={styles.sideBtnContainer}>
                        <TouchableOpacity style={styles.flashBtn} activeOpacity={0.7}>
                            <Text style={styles.btnEmoji}>⚡</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Review it. Sell it. Snap it.</Text>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: '#121418',
    },
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        height: 60,
    },
    homeIcon: {
        color: '#64748b',
        fontSize: 22,
        fontWeight: '300',
    },
    statusBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    proBadge: {
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderColor: 'rgba(139, 92, 246, 0.3)',
    },
    statusBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.2,
    },
    cameraPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    duplicationNotice: {
        position: 'absolute',
        top: 40,
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.3)',
    },
    duplicationText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '800',
    },
    focusFrame: {
        width: 220,
        height: 220,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.01)',
        marginBottom: 30,
    },
    placeholderEmoji: {
        fontSize: 50,
        opacity: 0.2,
    },
    instructionText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
        textAlign: 'center',
    },
    subInstruction: {
        color: '#64748b',
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
    tipBox: {
        marginTop: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 12,
    },
    tipText: {
        color: '#475569',
        fontSize: 12,
        fontStyle: 'italic',
    },
    controls: {
        height: 180,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingBottom: 20,
    },
    sideBtnContainer: {
        width: 70,
        alignItems: 'center',
    },
    captureBtn: {
        width: 84,
        height: 84,
        borderRadius: 42,
        borderWidth: 5,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureBtnInner: {
        width: 62,
        height: 62,
        borderRadius: 31,
        backgroundColor: '#fff',
    },
    galleryBtn: {
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: '#1e2229',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2d333d',
    },
    galleryIndicator: {
        position: 'absolute',
        top: -12,
        backgroundColor: '#10b981',
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#121418',
    },
    galleryLabel: {
        color: '#fff',
        fontSize: 8,
        fontWeight: '900',
    },
    flashBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnEmoji: {
        fontSize: 20,
    },
    footer: {
        paddingBottom: 20,
        alignItems: 'center',
    },
    footerText: {
        color: '#2d333d',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
});

export default SnapScreen;
