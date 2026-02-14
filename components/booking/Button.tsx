import React from 'react';
import { TouchableOpacity, Text, StyleSheet, useColorScheme, ActivityIndicator } from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    fullWidth = true,
}) => {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

    const getBackgroundColor = () => {
        if (disabled) return colors.disabled;

        switch (variant) {
            case 'primary':
                return colors.primary;
            case 'secondary':
                return colors.secondary;
            case 'outline':
                return 'transparent';
            default:
                return colors.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return colors.textSecondary;
        return variant === 'outline' ? colors.primary : '#FFFFFF';
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: variant === 'outline' ? colors.primary : 'transparent',
                    width: fullWidth ? '100%' : 'auto',
                },
                variant !== 'outline' && Shadows.sm,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        minHeight: 50,
    },
    text: {
        fontSize: 16,
        fontWeight: '700',
    },
});
