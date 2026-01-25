import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Dimensions, StatusBar, Platform } from 'react-native';

const { width } = Dimensions.get('window');

const ListingCard = ({ name, title, description, isEdited, onEdit }) => {
    return (
        <View style={styles.cardContainer}>
            <View style={styles.marketHeader}>
                <Text style={styles.marketName}>{name}</Text>
                {isEdited && (
                    <View style={styles.editedBadge}>
                        <Text style={styles.editedText}>PERSONALIZZATO</Text>
                    </View>
                )}
            </View>

            <View style={styles.fieldGroup}>
                <View style={styles.field}>
                    <Text style={styles.label}>TITOLO SUGGERITO</Text>
                    <Text style={[styles.titleValue, isEdited && styles.editedValue]} numberOfLines={2}>{title}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.field}>
                    <Text style={styles.label}>DESCRIZIONE</Text>
                    <Text style={[styles.descValue, isEdited && styles.editedValue]} numberOfLines={10}>{description}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.editBtn} onPress={onEdit} activeOpacity={0.7}>
                <Text style={styles.editBtnIcon}>✏️</Text>
                <Text style={styles.editBtnText}>Personalizza</Text>
            </TouchableOpacity>
        </View>
    );
};

const ListingSwipeScreen = ({ drafts, onNext, onCancel }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [editedStatus, setEditedStatus] = useState({ vinted: false, ebay: false, subito: false });
    const marketplaces = Object.keys(drafts);

    const handleScroll = (event) => {
        const slide = Math.round(event.nativeEvent.contentOffset.x / width);
        if (slide !== activeIndex) {
            setActiveIndex(slide);
        }
    };

    return (
        <View style={styles.mainWrapper}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safeArea}>
                {/* Header con tasto Home/Annulla */}
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={onCancel} style={styles.backBtn} hitSlop={20}>
                        <Text style={styles.backIcon}>✕</Text>
                    </TouchableOpacity>
                    <View style={styles.headerTitleGroup}>
                        <Text style={styles.headerTitle}>Bozze AI</Text>
                        <View style={styles.dots}>
                            {marketplaces.map((_, i) => (
                                <View key={i} style={[styles.dot, activeIndex === i && styles.activeDot]} />
                            ))}
                        </View>
                    </View>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    style={styles.swipeArea}
                >
                    {marketplaces.map((key) => (
                        <ListingCard
                            key={key}
                            name={key.charAt(0).toUpperCase() + key.slice(1)}
                            title={drafts[key].title}
                            description={drafts[key].description}
                            isEdited={editedStatus[key]}
                            onEdit={() => alert('L\'editor manuale sarà disponibile a breve!')}
                        />
                    ))}
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.nextBtn} onPress={onNext} activeOpacity={0.8}>
                        <Text style={styles.nextBtnText}>Scegli Prezzo & Pubblica</Text>
                    </TouchableOpacity>
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
    headerTitleGroup: {
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 1,
    },
    dots: {
        flexDirection: 'row',
        gap: 6,
        marginTop: 8,
    },
    dot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    activeDot: {
        backgroundColor: '#8b5cf6',
        width: 15,
    },
    swipeArea: {
        flex: 1,
    },
    cardContainer: {
        width: width,
        padding: 24,
    },
    marketHeader: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    marketName: {
        color: '#8b5cf6',
        fontSize: 40,
        fontWeight: '900',
        letterSpacing: -1.5,
    },
    editedBadge: {
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.3)',
    },
    editedText: {
        color: '#a78bfa',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 1,
    },
    fieldGroup: {
        backgroundColor: '#1e2229',
        borderRadius: 32,
        padding: 24,
        borderWidth: 1,
        borderColor: '#2d333d',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
    },
    field: {
        marginVertical: 4,
    },
    label: {
        color: '#475569',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.5,
        marginBottom: 10,
    },
    titleValue: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        lineHeight: 26,
    },
    divider: {
        height: 1,
        backgroundColor: '#2d333d',
        marginVertical: 20,
    },
    descValue: {
        color: '#94a3b8',
        fontSize: 15,
        lineHeight: 24,
    },
    editedValue: {
        color: '#a78bfa',
    },
    editBtn: {
        marginTop: 25,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    editBtnIcon: {
        fontSize: 16,
        marginRight: 10,
    },
    editBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    footer: {
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
    },
    nextBtn: {
        backgroundColor: '#8b5cf6',
        padding: 18,
        borderRadius: 100,
        alignItems: 'center',
        shadowColor: '#8b5cf6',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    nextBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },
});

export default ListingSwipeScreen;
