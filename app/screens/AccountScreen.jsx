import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, Dimensions, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

const SettingsItem = ({ icon, title, value, type = 'chevron', onPress }) => (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.6}>
        <View style={styles.itemLeft}>
            <View style={styles.iconContainer}>
                <Text style={styles.itemIcon}>{icon}</Text>
            </View>
            <Text style={styles.itemText}>{title}</Text>
        </View>
        <View style={styles.itemRight}>
            {type === 'chevron' ? (
                <Text style={styles.chevron}></Text>
            ) : type === 'switch' ? (
                <Switch
                    value={value}
                    trackColor={{ false: '#2d3139', true: '#8b5cf6' }}
                    thumbColor="#fff"
                />
            ) : (
                <Text style={styles.valueText}>{value}</Text>
            )}
        </View>
    </TouchableOpacity>
);

const AccountScreen = ({ onBack, isPro, onUpgrade, inventoryCount, userEmail }) => {
    const [notifications, setNotifications] = useState(true);

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Sei sicuro di voler uscire?",
            [
                { text: "Annulla", style: "cancel" },
                { text: "Esci", onPress: () => signOut(auth).catch(err => alert(err.message)) }
            ]
        );
    };

    return (
        <View style={styles.mainWrapper}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onBack} style={styles.closeBtn} hitSlop={20}>
                        <Text style={styles.closeIcon}>✕</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Il tuo Profilo</Text>
                    <TouchableOpacity onPress={() => Alert.alert("In arrivo", "Funzione di modifica profilo in arrivo!")}>
                        <Text style={styles.editLabel}>Modifica</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.profileHero}>
                        <View style={styles.avatarWrapper}>
                            <View style={styles.avatarGradient}>
                                <Text style={styles.avatarText}>{userEmail ? userEmail[0].toUpperCase() : 'U'}</Text>
                            </View>
                            {isPro && (
                                <View style={styles.proCrown}>
                                    <Text style={{ fontSize: 10, color: '#fff' }}>★</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.userName}>{userEmail || "Venditore"}</Text>
                        <View style={[styles.planBadge, isPro && styles.proPlanBadge]}>
                            <Text style={styles.planBadgeText}>{isPro ? 'ACCOUNT PRO' : 'PIANO FREE'}</Text>
                        </View>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{inventoryCount}</Text>
                            <Text style={styles.statLabel}>Annunci</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>3</Text>
                            <Text style={styles.statLabel}>Canali</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{inventoryCount * 12}m</Text>
                            <Text style={styles.statLabel}>Risparmiati</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>ETICA & PRIVACY</Text>
                        <View style={styles.insightBox}>
                            <Text style={styles.insightText}>
                                • SellSnap utilizza l’AI solo come supporto. Tutti i contenuti devono essere verificati dall’utente prima della pubblicazione.{"\n"}
                                • Le immagini vengono elaborate temporaneamente e non vengono memorizzate in modo permanente sui nostri server.{"\n"}
                                • La tua privacy è la nostra priorità: i dati non vengono mai venduti o condivisi per scopi pubblicitari.
                            </Text>
                        </View>
                    </View>

                    {!isPro && (
                        <TouchableOpacity style={styles.promoCard} onPress={onUpgrade} activeOpacity={0.9}>
                            <View style={styles.promoContent}>
                                <Text style={styles.promoTitle}>Passa a Pro</Text>
                                <Text style={styles.promoSubtitle}>Sblocca annunci illimitati e l'archivio intelligente completo.</Text>
                            </View>
                            <View style={styles.promoIconContainer}>
                                <Text style={styles.promoSymbol}>*</Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>IMPOSTAZIONI</Text>
                        <View style={styles.groupCard}>
                            <SettingsItem
                                icon="!"
                                title="Notifiche"
                                type="switch"
                                value={notifications}
                                onPress={() => setNotifications(!notifications)}
                            />
                            <View style={styles.innerDivider} />
                            <SettingsItem icon="#" title="Privacy & Sicurezza" />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutButtonText}>Chiudi Sessione</Text>
                    </TouchableOpacity>

                    <Text style={styles.footerInfo}>SellSnap v1.1.0 • Privacy by Design</Text>
                </ScrollView>
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
        paddingHorizontal: 25,
        paddingVertical: 15,
    },
    closeBtn: {
        width: 40,
    },
    closeIcon: {
        color: '#64748b',
        fontSize: 20,
        fontWeight: '300',
    },
    headerTitle: {
        color: '#e2e8f0',
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    editLabel: {
        color: '#8b5cf6',
        fontSize: 14,
        fontWeight: '600',
        width: 60,
        textAlign: 'right',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    profileHero: {
        alignItems: 'center',
        marginVertical: 30,
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 15,
    },
    avatarGradient: {
        width: 86,
        height: 86,
        borderRadius: 43,
        backgroundColor: '#1e2229',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2d333d',
    },
    avatarText: {
        color: '#fff',
        fontSize: 30,
        fontWeight: '700',
    },
    proCrown: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#8b5cf6',
        padding: 6,
        borderRadius: 12,
        borderWidth: 3,
        borderColor: '#121418',
    },
    userName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.5,
        marginTop: 5,
    },
    planBadge: {
        marginTop: 10,
        backgroundColor: '#1e2229',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#2d333d',
    },
    proPlanBadge: {
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderColor: '#8b5cf6',
    },
    planBadgeText: {
        color: '#64748b',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    statsRow: {
        flexDirection: 'row',
        marginHorizontal: 25,
        backgroundColor: '#1e2229',
        borderRadius: 24,
        paddingVertical: 20,
        borderWidth: 1,
        borderColor: '#2d333d',
        marginBottom: 30,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '900',
    },
    statLabel: {
        color: '#64748b',
        fontSize: 11,
        marginTop: 2,
        fontWeight: '700',
    },
    statDivider: {
        width: 1,
        height: '50%',
        backgroundColor: '#2d333d',
        alignSelf: 'center',
    },
    insightBox: {
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.01)',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    insightText: {
        color: '#94a3b8',
        fontSize: 14,
        lineHeight: 24,
        fontWeight: '500',
    },
    promoCard: {
        marginHorizontal: 25,
        backgroundColor: '#8b5cf6',
        borderRadius: 28,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 40,
    },
    promoContent: {
        flex: 1,
    },
    promoTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '900',
    },
    promoSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13,
        marginTop: 4,
        lineHeight: 18,
    },
    promoIconContainer: {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    },
    promoSymbol: {
        fontSize: 20,
        color: '#fff',
        fontWeight: '900'
    },
    section: {
        marginBottom: 35,
        paddingHorizontal: 25,
    },
    sectionHeader: {
        color: '#475569',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
        marginBottom: 15,
        marginLeft: 5,
    },
    groupCard: {
        backgroundColor: '#1e2229',
        borderRadius: 24,
        paddingHorizontal: 5,
        borderWidth: 1,
        borderColor: '#2d333d',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 18,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    iconContainer: {
        width: 38,
        height: 38,
        backgroundColor: '#121418',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemIcon: {
        fontSize: 18,
    },
    itemText: {
        color: '#f1f5f9',
        fontSize: 15,
        fontWeight: '600',
    },
    valueText: {
        color: '#64748b',
        fontSize: 14,
        fontWeight: '500',
    },
    chevron: {
        color: '#334155',
        fontSize: 20,
    },
    innerDivider: {
        height: 1,
        backgroundColor: '#2d333d',
        marginHorizontal: 18,
    },
    logoutButton: {
        marginTop: 10,
        marginHorizontal: 25,
        padding: 18,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    logoutButtonText: {
        color: '#ef4444',
        fontSize: 15,
        fontWeight: '700',
    },
    footerInfo: {
        textAlign: 'center',
        color: '#334155',
        fontSize: 11,
        marginTop: 40,
        fontWeight: '600',
    }
});

export default AccountScreen;
