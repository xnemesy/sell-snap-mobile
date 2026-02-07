import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '../design/tokens';
import { logError } from '../services/ErrorHandler';

/**
 * ErrorBoundary - Catch errori React non gestiti
 * 
 * Uso:
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error) {
        // Aggiorna state per mostrare UI fallback
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log errore per debugging/monitoring
        console.error('[ErrorBoundary] Caught error:', error, errorInfo);

        logError(error, {
            component: 'ErrorBoundary',
            componentStack: errorInfo.componentStack,
        });

        this.setState({
            error,
            errorInfo,
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });

        // Opzionale: trigger app restart/reset
        if (this.props.onReset) {
            this.props.onReset();
        }
    };

    handleReport = () => {
        // TODO: Invia report a servizio monitoring (Sentry, Bugsnag, etc.)
        const { error, errorInfo } = this.state;

        const report = {
            error: error?.toString(),
            stack: error?.stack,
            componentStack: errorInfo?.componentStack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
        };

        console.log('[ErrorBoundary] Report:', report);

        // Placeholder feedback
        alert('Report inviato. Grazie per la segnalazione!');
    };

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <View style={styles.content}>
                        {/* Icon/Illustration */}
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>⚠️</Text>
                        </View>

                        {/* Title */}
                        <Text style={styles.title}>Ops! Qualcosa è andato storto</Text>

                        {/* Description */}
                        <Text style={styles.description}>
                            L'app ha riscontrato un errore imprevisto. Puoi provare a riavviare o segnalare il problema.
                        </Text>

                        {/* Error details (collapsible, solo in dev mode) */}
                        {__DEV__ && this.state.error && (
                            <ScrollView style={styles.errorDetails}>
                                <Text style={styles.errorText}>
                                    {this.state.error.toString()}
                                </Text>
                                {this.state.errorInfo && (
                                    <Text style={styles.errorStack}>
                                        {this.state.errorInfo.componentStack}
                                    </Text>
                                )}
                            </ScrollView>
                        )}

                        {/* Actions */}
                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonPrimary]}
                                onPress={this.handleReset}
                            >
                                <Text style={styles.buttonText}>Riavvia App</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.buttonSecondary]}
                                onPress={this.handleReport}
                            >
                                <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
                                    Segnala Problema
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgPrimary,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Layout.screenPadding,
    },
    content: {
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: Spacing.xl,
    },
    icon: {
        fontSize: 64,
    },
    title: {
        ...Typography.h2,
        color: Colors.textPrimary,
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    description: {
        ...Typography.body,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: Spacing.xl,
        lineHeight: 24,
    },
    errorDetails: {
        width: '100%',
        maxHeight: 200,
        backgroundColor: Colors.bgTertiary,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        marginBottom: Spacing.lg,
    },
    errorText: {
        ...Typography.caption,
        color: Colors.error,
        fontFamily: 'monospace',
        marginBottom: Spacing.sm,
    },
    errorStack: {
        ...Typography.caption,
        color: Colors.textTertiary,
        fontFamily: 'monospace',
    },
    actions: {
        width: '100%',
        gap: Spacing.md,
    },
    button: {
        height: Layout.buttonHeight,
        borderRadius: BorderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonPrimary: {
        backgroundColor: Colors.primary,
    },
    buttonSecondary: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: Colors.border,
    },
    buttonText: {
        ...Typography.button,
        color: Colors.textPrimary,
    },
    buttonTextSecondary: {
        color: Colors.textSecondary,
    },
});
