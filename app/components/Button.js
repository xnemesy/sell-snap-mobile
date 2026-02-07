import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Colors, Typography, BorderRadius, Spacing, Shadows, Layout } from '../design/tokens';

/**
 * Button Component - Design System
 * 
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
 * @param {string} size - 'small' | 'medium' | 'large'
 * @param {boolean} disabled - Disabilita il button
 * @param {boolean} loading - Mostra spinner
 * @param {boolean} fullWidth - Larghezza 100%
 * @param {function} onPress - Handler click
 * @param {string} children - Testo button
 * @param {node} icon - Icona opzionale (a sinistra del testo)
 */
export const Button = ({
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    fullWidth = false,
    onPress,
    children,
    icon,
    style,
    textStyle,
    ...props
}) => {
    const buttonStyles = [
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
    ];

    const textStyles = [
        styles.text,
        styles[`${variant}Text`],
        styles[`${size}Text`],
        (disabled || loading) && styles.disabledText,
        textStyle,
    ];

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            {...props}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'primary' ? Colors.textPrimary : Colors.primary}
                />
            ) : (
                <View style={styles.content}>
                    {icon && <View style={styles.iconContainer}>{icon}</View>}
                    <Text style={textStyles}>{children}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    // Base
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BorderRadius.md,
        ...Shadows.sm,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        marginRight: Spacing.sm,
    },

    // Variants
    primary: {
        backgroundColor: Colors.primary,
    },
    secondary: {
        backgroundColor: Colors.bgSecondary,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    danger: {
        backgroundColor: Colors.error,
    },

    // Sizes
    small: {
        height: 40,
        paddingHorizontal: Spacing.md,
    },
    medium: {
        height: Layout.buttonHeight,
        paddingHorizontal: Spacing.lg,
    },
    large: {
        height: 64,
        paddingHorizontal: Spacing.xl,
    },

    // Text Styles
    text: {
        ...Typography.button,
    },
    primaryText: {
        color: Colors.textPrimary,
    },
    secondaryText: {
        color: Colors.textPrimary,
    },
    outlineText: {
        color: Colors.primary,
    },
    ghostText: {
        color: Colors.primary,
    },
    dangerText: {
        color: Colors.textPrimary,
    },

    // Size Text
    smallText: {
        fontSize: 14,
    },
    mediumText: {
        fontSize: 16,
    },
    largeText: {
        fontSize: 18,
    },

    // States
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.5,
    },
    disabledText: {
        opacity: 0.7,
    },
});
