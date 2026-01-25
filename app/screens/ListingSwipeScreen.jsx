import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const ListingCard = ({ name, title, description, onEdit }) => {
    return (
        <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
                <Text style={styles.marketName}>{name}</Text>
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>TITOLO</Text>
                <Text style={styles.titleValue} numberOfLines={1}>{title}</Text>
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>DESCRIZIONE</Text>
                <Text style={styles.descValue} numberOfLines={8}>{description}</Text>
            </View>

            <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
                <Text style={styles.editBtnText}>Modifica</Text>
            </TouchableOpacity>
        </View>
    );
};

const ListingSwipeScreen = ({ drafts, onNext }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const marketplaces = Object.keys(drafts);

    const handleScroll = (event) => {
        const slide = Math.round(event.nativeEvent.contentOffset.x / width);
        if (slide !== activeIndex) {
            setActiveIndex(slide);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Bozze generate</Text>
                <View style={styles.dots}>
                    {marketplaces.map((_, i) => (
                        <View key={i} style={[styles.dot, activeIndex === i && styles.activeDot]} />
                    ))}
                </View>
            </View>

            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {marketplaces.map((key) => (
                    <ListingCard
                        key={key}
                        name={key.toUpperCase()}
                        title={drafts[key].title}
                        description={drafts[key].description}
                        onEdit={() => alert('Bottom sheet editor in arrivo!')}
                    />
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.nextBtn} onPress={onNext}>
                    <Text style={styles.nextBtnText}>Continua</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0b0e14',
    },
    header: {
        padding: 24,
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 12,
    },
    dots: {
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    activeDot: {
        backgroundColor: '#6366f1',
        width: 20,
    },
    cardContainer: {
        width: width,
        padding: 24,
    },
    cardHeader: {
        marginBottom: 30,
    },
    marketName: {
        color: '#6366f1',
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: -1,
    },
    field: {
        marginBottom: 24,
    },
    label: {
        color: '#94a3b8',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
        marginBottom: 8,
    },
    titleValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    descValue: {
        color: '#cbd5e1',
        fontSize: 15,
        lineHeight: 22,
    },
    editBtn: {
        marginTop: 20,
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'rgba(99, 102, 241, 0.3)',
    },
    editBtnText: {
        color: '#818cf8',
        fontWeight: '700',
    },
    footer: {
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
    },
    nextBtn: {
        backgroundColor: '#6366f1',
        padding: 18,
        borderRadius: 100,
        alignItems: 'center',
    },
    nextBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default ListingSwipeScreen;
