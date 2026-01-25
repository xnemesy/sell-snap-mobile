import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, Dimensions, StatusBar } from 'react-native';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

const { width } = Dimensions.get('window');

const AuthScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false);

    const handleAuth = async () => {
        if (!email || !password) return;
        setLoading(true);
        try {
            if (isRegister) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (error) {
            alert("Errore: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.mainWrapper}>
            <StatusBar barStyle="light-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <SafeAreaView style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.logoBox}>
                            <Text style={styles.logoLabel}>S</Text>
                        </View>
                        <Text style={styles.title}>SellSnap</Text>
                        <Text style={styles.subtitle}>
                            {isRegister ? "Crea un account per iniziare a vendere." : "Bentornato! Accedi per gestire i tuoi annunci."}
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>EMAIL</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="nome@esempio.it"
                                placeholderTextColor="#475569"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>PASSWORD</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor="#475569"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.primaryBtn}
                            onPress={handleAuth}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.primaryBtnText}>
                                    {isRegister ? "Registrati ora" : "Accedi"}
                                </Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.dividerRow}>
                            <View style={styles.divider} />
                            <Text style={styles.dividerText}>OPPURE</Text>
                            <View style={styles.divider} />
                        </View>

                        <TouchableOpacity style={styles.googleBtn} activeOpacity={0.8}>
                            <Text style={styles.googleEmoji}>G</Text>
                            <Text style={styles.googleBtnText}>Continua con Google</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
                            <Text style={styles.footerText}>
                                {isRegister ? "Hai già un account? " : "Non hai un account? "}
                                <Text style={styles.footerAction}>{isRegister ? "Accedi" : "Registrati"}</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: '#121418',
    },
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoBox: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: '#1e2229',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#2d333d',
    },
    logoLabel: {
        fontSize: 32,
        color: '#fff',
        fontWeight: '900',
    },
    title: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: -1,
    },
    subtitle: {
        color: '#64748b',
        fontSize: 15,
        textAlign: 'center',
        marginTop: 10,
        lineHeight: 22,
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        color: '#475569',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.5,
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#1e2229',
        borderRadius: 16,
        padding: 16,
        color: '#fff',
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#2d333d',
    },
    primaryBtn: {
        backgroundColor: '#8b5cf6',
        borderRadius: 100,
        padding: 18,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    primaryBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 25,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#2d333d',
    },
    dividerText: {
        color: '#475569',
        fontSize: 10,
        fontWeight: '800',
        marginHorizontal: 15,
    },
    googleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 100,
        padding: 18,
        gap: 12,
    },
    googleEmoji: {
        fontSize: 18,
        fontWeight: '900',
        color: '#4285F4',
    },
    googleBtnText: {
        color: '#121418',
        fontSize: 15,
        fontWeight: '800',
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
    },
    footerText: {
        color: '#64748b',
        fontSize: 14,
    },
    footerAction: {
        color: '#8b5cf6',
        fontWeight: '800',
    },
});

export default AuthScreen;
