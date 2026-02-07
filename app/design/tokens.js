/**
 * SellSnap Design System - Tokens
 * Centralizza colori, spacing, typography, animazioni
 */

export const Colors = {
    // Brand
    primary: '#8b5cf6',        // Viola principale
    primaryDark: '#6d28d9',    // Viola scuro
    primaryLight: '#a78bfa',   // Viola chiaro

    // Background
    bgPrimary: '#121418',      // Sfondo principale
    bgSecondary: '#1a1d24',    // Card/containers
    bgTertiary: '#252930',     // Input fields

    // Text
    textPrimary: '#ffffff',    // Testo principale
    textSecondary: '#a0a0a0',  // Testo secondario
    textTertiary: '#6b7280',   // Testo disabilitato

    // Semantic
    success: '#10b981',        // Verde successo
    warning: '#f59e0b',        // Giallo warning
    error: '#ef4444',          // Rosso errore
    info: '#3b82f6',           // Blu info

    // UI Elements
    border: '#2d3139',         // Bordi
    overlay: 'rgba(0,0,0,0.7)',// Overlay modali
    shadow: 'rgba(0,0,0,0.3)', // Ombre
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
};

export const Typography = {
    // Font Families
    regular: 'System',
    medium: 'System',
    bold: 'System',

    // Font Sizes
    h1: { fontSize: 32, lineHeight: 40, fontWeight: '700' },
    h2: { fontSize: 24, lineHeight: 32, fontWeight: '700' },
    h3: { fontSize: 20, lineHeight: 28, fontWeight: '600' },
    body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
    bodySmall: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
    caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
    button: { fontSize: 16, lineHeight: 24, fontWeight: '600' },
};

export const BorderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 9999,
};

export const Shadows = {
    sm: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
};

export const Animations = {
    // Durations (ms)
    fast: 150,
    normal: 250,
    slow: 400,

    // Easing
    easeOut: [0.25, 0.1, 0.25, 1],
    easeIn: [0.42, 0, 1, 1],
    easeInOut: [0.42, 0, 0.58, 1],

    // Configs per Animated
    timing: {
        fast: { duration: 150, useNativeDriver: true },
        normal: { duration: 250, useNativeDriver: true },
        slow: { duration: 400, useNativeDriver: true },
    },

    spring: {
        damping: 15,
        stiffness: 150,
        useNativeDriver: true,
    },
};

export const Layout = {
    screenPadding: Spacing.lg,
    containerMaxWidth: 600,
    buttonHeight: 56,
    inputHeight: 48,
    iconSize: {
        sm: 16,
        md: 24,
        lg: 32,
        xl: 48,
    },
};

// Helper per gradient
export const Gradients = {
    primary: {
        colors: [Colors.primary, Colors.primaryDark],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
    },
    dark: {
        colors: [Colors.bgSecondary, Colors.bgPrimary],
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
    },
};
