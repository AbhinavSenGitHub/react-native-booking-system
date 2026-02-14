import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import { Appointment } from '@/data/mockData';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface AppointmentCardProps {
    appointment: Appointment;
    onCancel: (id: string) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onCancel }) => {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

    const handleCancel = () => {
        Alert.alert(
            'Cancel Appointment',
            'Are you sure you want to cancel this appointment?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: () => onCancel(appointment.id),
                },
            ]
        );
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getStatusColor = () => {
        switch (appointment.status) {
            case 'confirmed':
                return colors.success;
            case 'pending':
                return colors.warning;
            case 'cancelled':
                return colors.error;
            default:
                return colors.textSecondary;
        }
    };

    const getStatusIcon = () => {
        switch (appointment.status) {
            case 'confirmed':
                return 'checkmark.circle.fill';
            case 'pending':
                return 'clock.fill';
            case 'cancelled':
                return 'xmark.circle.fill';
            default:
                return 'circle.fill';
        }
    };

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: colors.card, borderColor: colors.border },
                Shadows.sm,
            ]}
        >
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={[styles.serviceName, { color: colors.text }]} numberOfLines={1}>
                        {appointment.serviceName}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
                        <IconSymbol name={getStatusIcon()} size={14} color={getStatusColor()} />
                        <Text style={[styles.statusText, { color: getStatusColor() }]}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.details}>
                <View style={styles.detailsGrid}>
                    <View style={styles.detailRow}>
                        <IconSymbol name="calendar" size={18} color={colors.textSecondary} />
                        <Text style={[styles.detailText, { color: colors.text }]}>
                            {formatDate(appointment.date)}
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <IconSymbol name="clock" size={18} color={colors.textSecondary} />
                        <Text style={[styles.detailText, { color: colors.text }]}>{appointment.timeSlot}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <IconSymbol name="hourglass" size={18} color={colors.textSecondary} />
                        <Text style={[styles.detailText, { color: colors.text }]}>{appointment.duration} min</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <IconSymbol name="dollarsign.circle" size={18} color={colors.textSecondary} />
                        <Text style={[styles.detailText, { color: colors.text }]}>${appointment.price}</Text>
                    </View>
                </View>
            </View>

            {appointment.status === 'confirmed' && (
                <TouchableOpacity
                    style={[styles.cancelButton, { backgroundColor: colors.error + '15' }]}
                    onPress={handleCancel}
                    activeOpacity={0.7}
                >
                    <IconSymbol name="xmark.circle" size={18} color={colors.error} />
                    <Text style={[styles.cancelButtonText, { color: colors.error }]}>Cancel Appointment</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        borderWidth: 1,
    },
    header: {
        marginBottom: Spacing.md,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: '700',
        flex: 1,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: BorderRadius.sm,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    details: {
        marginBottom: Spacing.md,
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        width: '45%', // Two columns
    },
    detailText: {
        fontSize: 15,
        fontWeight: '500',
    },
    cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        paddingVertical: Spacing.sm + 2,
        borderRadius: BorderRadius.md,
    },
    cancelButtonText: {
        fontSize: 15,
        fontWeight: '600',
    },
});
