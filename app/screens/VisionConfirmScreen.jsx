import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Animated, StatusBar, Platform, Modal, TextInput, KeyboardAvoidingView } from 'react-native';
import FactCard from '../components/FactCard';

const VisionConfirmScreen = ({ data, onUpdate, onConfirm, onCancel }) => {
    if (!data) return null;

    const pulseAnim = useRef(new Animated.Value(1)).current;
    const hasUncertainties = data.missing_or_uncertain && data.missing_or_uncertain.length > 0;

    const [editingField, setEditingField] = useState(null); // { section: 'product', key: 'brand', label: 'Brand' }
    const [tempValue, setTempValue] = useState('');
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    useEffect(() => {
        if (hasUncertainties) {
            Animated.sequence([
                Animated.delay(1000),
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [hasUncertainties]);

    const openEdit = (section, key, label, initialValue) => {
        setEditingField({ section, key, label });
        setTempValue(initialValue || '');
        setIsEditModalVisible(true);
    };

    const saveEdit = () => {
        if (!editingField) return;

        const newData = { ...data };
        if (editingField.section === 'uncertain') {
            // Se stiamo modificando un item incerto, lo rimuoviamo da missing_or_uncertain
            // e lo mettiamo nel campo corretto (se lo conosciamo) o lo aggiorniamo nell'array
            const idx = editingField.key;
            newData.missing_or_uncertain[idx] = tempValue;
        } else {
            newData[editingField.section][editingField.key] = tempValue;
        }

        onUpdate(newData);
        setIsEditModalVisible(false);
        setEditingField(null);
    };

    return (
        <View style={styles.mainWrapper}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={onCancel} style={styles.backBtn} hitSlop={20}>
                        <Text style={styles.backIcon}>✕</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Verifica Dati</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                    <View style={styles.intro}>
                        <Text style={styles.title}>Analisi completata</Text>
                        <Text style={styles.subtitle}>Ecco cosa ho rilevato. Conferma i dettagli per generare gli annunci.</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>OGGETTO</Text>
                        <View style={styles.cardGroup}>
                            <FactCard label="Tipo" value={data.product.type} onPress={() => openEdit('product', 'type', 'Tipo', data.product.type)} />
                            <View style={styles.cardDivider} />
                            <FactCard label="Brand" value={data.product.brand} onPress={() => openEdit('product', 'brand', 'Brand', data.product.brand)} />
                            <View style={styles.cardDivider} />
                            <FactCard label="Modello" value={data.product.model} onPress={() => openEdit('product', 'model', 'Modello', data.product.model)} />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>DETTAGLI RIPORTATI</Text>
                        <View style={styles.cardGroup}>
                            <FactCard label="Condizione" value={data.condition.level} onPress={() => openEdit('condition', 'level', 'Condizione', data.condition.level)} />
                            {data.missing_or_uncertain && data.missing_or_uncertain.map((item, idx) => (
                                <View key={idx}>
                                    <View style={styles.cardDivider} />
                                    <FactCard
                                        label="Da Confermare"
                                        value={item}
                                        isUncertain={true}
                                        onPress={() => openEdit('uncertain', idx, 'Dato Incerto', item)}
                                    />
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>

                <Modal
                    visible={isEditModalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setIsEditModalVisible(false)}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.modalOverlay}
                    >
                        <TouchableOpacity
                            style={styles.modalDismiss}
                            activeOpacity={1}
                            onPress={() => setIsEditModalVisible(false)}
                        />
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalLabel}>{editingField?.label.toUpperCase()}</Text>
                                <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                                    <View style={styles.modalCloseBtn}>
                                        <Text style={styles.modalCloseText}>✕</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <TextInput
                                style={styles.modalInput}
                                value={tempValue}
                                onChangeText={setTempValue}
                                autoFocus={true}
                                placeholder="Inserisci valore..."
                                placeholderTextColor="#475569"
                                selectionColor="#8b5cf6"
                            />

                            <TouchableOpacity style={styles.modalSaveBtn} onPress={saveEdit}>
                                <Text style={styles.modalSaveText}>Conferma Modifica</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>

                <View style={styles.footer}>
                    <Animated.View style={{ transform: [{ scale: pulseAnim }], width: '100%' }}>
                        <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm} activeOpacity={0.8}>
                            <Text style={styles.confirmBtnText}>Crea Annunci Ora</Text>
                        </TouchableOpacity>
                    </Animated.View>
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
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        height: 60,
    },
    backIcon: {
        color: '#64748b',
        fontSize: 22,
        fontWeight: '300',
    },
    headerTitle: {
        color: '#e2e8f0',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    scroll: {
        padding: 24,
        paddingBottom: 150,
    },
    intro: {
        marginBottom: 35,
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    subtitle: {
        color: '#94a3b8',
        fontSize: 15,
        marginTop: 8,
        lineHeight: 22,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        color: '#475569',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.5,
        marginBottom: 15,
        marginLeft: 4,
    },
    cardGroup: {
        backgroundColor: '#1e2229',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#2d333d',
        paddingHorizontal: 4,
    },
    cardDivider: {
        height: 1,
        backgroundColor: '#2d333d',
        marginHorizontal: 16,
    },
    tipCard: {
        backgroundColor: 'rgba(139, 92, 246, 0.05)',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.1)',
        marginBottom: 30,
    },
    tipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    tipIcon: {
        fontSize: 14,
    },
    tipLabel: {
        color: '#8b5cf6',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1,
    },
    tipContent: {
        color: '#94a3b8',
        fontSize: 14,
        lineHeight: 20,
    },
    trustBanner: {
        marginTop: 10,
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    trustText: {
        color: '#475569',
        fontSize: 12,
        lineHeight: 18,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        backgroundColor: '#121418',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: 'center',
    },
    confirmBtn: {
        backgroundColor: '#8b5cf6',
        padding: 18,
        borderRadius: 100,
        alignItems: 'center',
    },
    confirmBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    modalDismiss: {
        flex: 1,
    },
    modalContent: {
        backgroundColor: '#1e2229',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 45 : 30,
        borderWidth: 1,
        borderColor: '#2d333d',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    modalLabel: {
        color: '#8b5cf6',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1.5,
    },
    modalCloseBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCloseText: {
        color: '#94a3b8',
        fontSize: 14,
    },
    modalInput: {
        backgroundColor: '#121418',
        borderRadius: 16,
        padding: 18,
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        borderWidth: 1,
        borderColor: '#2d333d',
        marginBottom: 25,
    },
    modalSaveBtn: {
        backgroundColor: '#8b5cf6',
        borderRadius: 100,
        padding: 18,
        alignItems: 'center',
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    modalSaveText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },
});

export default VisionConfirmScreen;
