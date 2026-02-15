import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Alert, Image } from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Ionicons } from '@expo/vector-icons';

interface Appointment {
    id: string;
    serviceName: string;
    doctorName?: string;
    patientName?: string;
    date: string;
    timeSlot: string;
    price?: number;
    duration?: string;
    status: 'booked' | 'accepted' | 'rejected' | 'completed';
    serviceImageUrl?: string;
    doctor?: { _id: string; name: string };
    patient?: { _id: string; name: string };
}

interface AppointmentCardProps {
    appointment: Appointment;
    onCancel?: (id: string) => void;
    onReview?: (id: string) => void;
    onReschedule?: (appointment: Appointment) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onCancel, onReview, onReschedule }) => {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const isDark = colorScheme === 'dark';

    const handleCancel = () => {
        if (!onCancel) return;
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
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        } catch (e) {
            return dateStr;
        }
    };

    const getStatusColor = () => {
        switch (appointment.status) {
            case 'accepted':
                return colors.success;
            case 'booked':
                return colors.warning;
            case 'rejected':
                return colors.error;
            case 'completed':
                return '#2196F3';
            default:
                return colors.textSecondary;
        }
    };

    const getStatusIcon = () => {
        switch (appointment.status) {
            case 'accepted':
                return 'checkmark.circle.fill';
            case 'booked':
                return 'clock.fill';
            case 'rejected':
                return 'xmark.circle.fill';
            case 'completed':
                return 'checkmark.seal.fill';
            default:
                return 'circle.fill';
        }
    };

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: colors.card },
                Shadows.md,
            ]}
        >
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <View style={[styles.serviceImageContainer, { backgroundColor: isDark ? '#1F2937' : '#F5F3FF' }]}>
                        <Image
                            source={require('../../assets/images/profile_doc.png')}
                            style={styles.serviceIcon}
                        />
                    </View>
                    <View style={styles.titleWrapper}>
                        <Text style={[styles.serviceName, { color: colors.text }]} numberOfLines={1}>
                            {appointment.serviceName}
                        </Text>
                        <Text style={[styles.subText, { color: colors.textSecondary }]}>
                            {appointment.patientName ? `Patient: ${appointment.patientName}` : `Doctor: ${appointment.doctorName}`}
                        </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '15' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor() }]}>
                            {appointment.status.toUpperCase()}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={[styles.divider, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]} />

            <View style={styles.footer}>
                <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={16} color="#6366F1" />
                    <Text style={[styles.infoText, { color: colors.text }]}>
                        {formatDate(appointment.date)}
                    </Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={16} color="#6366F1" />
                    <Text style={[styles.infoText, { color: colors.text }]}>{appointment.timeSlot}</Text>
                </View>
            </View>

            {appointment.status === 'booked' && (
                <View style={styles.actionRow}>
                    {onReschedule && (
                        <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: isDark ? '#312E81' : '#F5F3FF' }]}
                            onPress={() => onReschedule(appointment)}
                        >
                            <Text style={[styles.actionBtnText, { color: isDark ? '#A5B4FC' : '#6366F1' }]}>Reschedule</Text>
                        </TouchableOpacity>
                    )}
                    {onCancel && (
                        <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: isDark ? '#7F1D1D' : '#FEF2F2' }]}
                            onPress={handleCancel}
                        >
                            <Text style={[styles.actionBtnText, { color: isDark ? '#FCA5A5' : '#EF4444' }]}>Cancel</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {appointment.status === 'completed' && onReview && (
                <TouchableOpacity
                    style={[styles.reviewBtn, { backgroundColor: '#6366F1' }]}
                    onPress={() => onReview(appointment.id)}
                >
                    <Text style={styles.reviewBtnText}>Post Review</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        padding: 16,
        marginBottom: 16,
        overflow: 'hidden',
    },
    header: {
        marginBottom: 12,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    serviceImageContainer: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: '#F5F3FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        overflow: 'hidden',
    },
    serviceIcon: {
        width: '100%',
        height: '100%',
    },
    titleWrapper: {
        flex: 1,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 2,
    },
    subText: {
        fontSize: 13,
        fontWeight: '500',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '800',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    infoText: {
        fontSize: 14,
        fontWeight: '600',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 15,
    },
    actionBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionBtnText: {
        fontSize: 14,
        fontWeight: '700',
    },
    reviewBtn: {
        marginTop: 15,
        paddingVertical: 12,
        borderRadius: 16,
        alignItems: 'center',
    },
    reviewBtnText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
});
