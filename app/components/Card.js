import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '../design/tokens';

/**
 * Card Component - Design System
 * Container generico per raggruppare contenuti
 * 
 * @param {node} children - Contenuto della card
 * @param {boolean} elevated - Mostra shadow
 * @param {boolean} interactive - Abilita press (mostra feedback)
 * @param {function} onPress - Handler se interactive
 * @param {object} style - Style override
 */
export const Card = ({
    children,
    elevated = true,
    interactive = false,
    onPress,
    style,
    ...props
}) => {
    const containerStyles = [
        styles.base,
        elevated && styles.elevated,
        style,
    ];

    if (interactive) {
        return (
            <TouchableOpacity
                style={containerStyles}
                onPress={onPress}
                activeOpacity={0.9}
                {...props}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return (
        <View style={containerStyles} {...props}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    base: {
        backgroundColor: Colors.bgSecondary,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    elevated: {
        ...Shadows.md,
    },
});

/**
 * CardHeader - Sezione header card con titolo/subtitle
 */
export const CardHeader = ({ title, subtitle, action, style }) => (
    <View style={[styles.header, style]}>
        <View style={styles.headerText}>
            {title}
            {subtitle}
        </View>
        {action && <View>{action}</View>}
    </View>
);

/**
 * CardContent - Sezione contenuto principale
 */
export const CardContent = ({ children, style }) => (
    <View style={[styles.content, style]}>
        {children}
    </View>
);

/**
 * CardFooter - Sezione footer con azioni
 */
export const CardFooter = ({ children, style }) => (
    <View style={[styles.footer, style]}>
        {children}
    </View>
);

const headerFooterStyles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.md,
    },
    headerText: {
        flex: 1,
    },
    content: {
        // Contenuto flessibile
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: Spacing.md,
        gap: Spacing.sm,
    },
});

Object.assign(styles, headerFooterStyles);
