import React, { useEffect, useRef } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows, Layout } from '../design/tokens';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * ErrorModal - Modal errore custom con animazioni
 * 
 * @param {boolean} visible - Visibilità modal
 * @param {string} title - Titolo errore
 * @param {string} message - Descrizione errore
 * @param {string} primaryAction - Testo button primario
 * @param {function} onPrimaryAction - Handler button primario
 * @param {string} secondaryAction - Testo button secondario (opzionale)
 * @param {function} onSecondaryAction - Handler button secondario
 * @param {string} type - 'error' | 'warning' | 'info'
 */
export const ErrorModal = ({
    visible,
    title,
    message,
    primaryAction = 'OK',
    onPrimaryAction,
    secondaryAction,
    onSecondaryAction,
    type = 'error',
}) => {
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Animazione entrata
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    damping: 20,
                    stiffness: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            // Animazione uscita
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: SCREEN_HEIGHT,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const getIconForType = () => {
        switch (type) {
            case 'error': return '❌';
            case 'warning': return '⚠️';
            case 'info': return 'ℹ️';
            default: return '❌';
        }
    };

    const getColorForType = () => {
        switch (type) {
            case 'error': return Colors.error;
            case 'warning': return Colors.warning;
            case 'info': return Colors.info;
            default: return Colors.error;
        }
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onPrimaryAction}
        >
            <TouchableWithoutFeedback onPress={onPrimaryAction}>
                <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[
                                styles.modal,
                                {
                                    transform: [{ translateY: slideAnim }],
                                },
                            ]}
                        >
                            {/* Icon */}
                            <View style={[styles.iconContainer, { backgroundColor: `${getColorForType()}20` }]}>
                                <Text style={styles.icon}>{getIconForType()}</Text>
                            </View>

                            {/* Content */}
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.message}>{message}</Text>

                            {/* Actions */}
                            <View style={styles.actions}>
                                {secondaryAction && (
                                    <TouchableOpacity
                                        style={[styles.button, styles.buttonSecondary]}
                                        onPress={onSecondaryAction}
                                    >
                                        <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
                                            {secondaryAction}
                                        </Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        styles.buttonPrimary,
                                        { backgroundColor: getColorForType() },
                                    ]}
                                    onPress={onPrimaryAction}
                                >
                                    <Text style={styles.buttonText}>{primaryAction}</Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </Animated.View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: Colors.overlay,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Layout.screenPadding,
    },
    modal: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: Colors.bgSecondary,
        borderRadius: BorderRadius.lg,
        padding: Spacing.xl,
        alignItems: 'center',
        ...Shadows.lg,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    icon: {
        fontSize: 32,
    },
    title: {
        ...Typography.h3,
        color: Colors.textPrimary,
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    message: {
        ...Typography.body,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: Spacing.xl,
        lineHeight: 24,
    },
    actions: {
        width: '100%',
        gap: Spacing.sm,
    },
    button: {
        height: Layout.buttonHeight,
        borderRadius: BorderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonPrimary: {
        // backgroundColor set dinamicamente
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

/**
 * Hook per gestire ErrorModal facilmente
 * 
 * Usage:
 * const { showError } = useErrorModal();
 * showError('Titolo', 'Messaggio', () => console.log('OK'));
 */
export const useErrorModal = () => {
    const [modalState, setModalState] = React.useState({
        visible: false,
        title: '',
        message: '',
        primaryAction: 'OK',
        onPrimaryAction: null,
        secondaryAction: null,
        onSecondaryAction: null,
        type: 'error',
    });

    const showError = (
        title,
        message,
        onPrimaryAction = null,
        primaryActionText = 'OK',
        options = {}
    ) => {
        setModalState({
            visible: true,
            title,
            message,
            primaryAction: primaryActionText,
            onPrimaryAction: () => {
                onPrimaryAction?.();
                hideError();
            },
            secondaryAction: options.secondaryAction,
            onSecondaryAction: options.onSecondaryAction
                ? () => {
                    options.onSecondaryAction();
                    hideError();
                }
                : null,
            type: options.type || 'error',
        });
    };

    const hideError = () => {
        setModalState(prev => ({ ...prev, visible: false }));
    };

    return {
        showError,
        hideError,
        ErrorModalComponent: <ErrorModal {...modalState} />,
    };
};
