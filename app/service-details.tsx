import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    useColorScheme,
    Image,
    Platform,
    Alert,
    TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { services, generateTimeSlots } from '@/data/mockData';
import { useAppointments } from '@/context/AppointmentContext';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
// import { IconSymbol } from '@/components/ui/icon-symbol';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/booking/Button';
import { TimeSlotPicker } from '@/components/booking/TimeSlotPicker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ServiceDetailsScreen() {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const { id } = useLocalSearchParams<{ id: string }>();
    const { addAppointment, appointments } = useAppointments();

    const service = services.find((s) => s.id === id);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [baseTimeSlots] = useState(generateTimeSlots());

    if (!service) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={[styles.errorText, { color: colors.error }]}>Service not found</Text>
            </View>
        );
    }

    // Function to check if a time slot is already booked or in the past
    const getAvailableTimeSlots = () => {
        const selectedDateStr = selectedDate.toISOString().split('T')[0]; // Get YYYY-MM-DD format
        const todayStr = new Date().toISOString().split('T')[0];
        const isToday = selectedDateStr === todayStr;

        // Get current time for filtering past slots
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // Get all booked appointments for this service on the selected date
        const bookedSlots = appointments
            .filter((apt) => {
                if (apt.status === 'cancelled') return false;
                const aptDate = new Date(apt.date).toISOString().split('T')[0];
                return apt.serviceId === service.id && aptDate === selectedDateStr;
            })
            .map((apt) => apt.timeSlot);

        // Filter and mark time slots
        return baseTimeSlots
            .filter((slot) => {
                // If selected date is today, filter out past time slots
                if (isToday) {
                    const [slotHour, slotMinute] = slot.time.split(':').map(Number);

                    // Hide slot if it's in the past
                    if (slotHour < currentHour || (slotHour === currentHour && slotMinute <= currentMinute)) {
                        return false;
                    }
                }
                return true;
            })
            .map((slot) => ({
                ...slot,
                available: slot.available && !bookedSlots.includes(slot.time),
            }));
    };

    const availableTimeSlots = getAvailableTimeSlots();

    const handleDateChange = (event: any, date?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (date) {
            setSelectedDate(date);
            setSelectedTimeSlot(null); // Reset time slot when date changes
        }
    };

    const handleBookAppointment = () => {
        if (!selectedTimeSlot) {
            Alert.alert('Select Time', 'Please select a time slot for your appointment');
            return;
        }

        addAppointment({
            serviceId: service.id,
            serviceName: service.name,
            duration: service.duration,
            price: service.price,
            date: selectedDate.toISOString(),
            timeSlot: selectedTimeSlot,
        });

        Alert.alert(
            'Success!',
            'Your appointment has been booked successfully',
            [
                {
                    text: 'View Appointments',
                    onPress: () => router.push('/(tabs)/explore'),
                },
                {
                    text: 'Book Another',
                    onPress: () => {
                        setSelectedTimeSlot(null);
                        setSelectedDate(new Date());
                        router.push('/(tabs)');
                    },
                },
            ]
        );
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Service Image */}
                <Image source={{ uri: service.imageUrl }} style={styles.image} />

                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back-circle" size={36} color={colors.primary} />

                </TouchableOpacity>

                {/* Service Details */}
                <View style={styles.content}>
                    <View style={[styles.categoryBadge, { backgroundColor: colors.primary + '20' }]}>
                        <Text style={[styles.categoryText, { color: colors.primary }]}>
                            {service.category}
                        </Text>
                    </View>

                    <Text style={[styles.title, { color: colors.text }]}>{service.name}</Text>
                    <Text style={[styles.description, { color: colors.textSecondary }]}>
                        {service.description}
                    </Text>

                    {/* Service Info Cards */}
                    <View style={styles.infoCards}>
                        <View style={[styles.infoCard, { backgroundColor: colors.card }, Shadows.sm]}>
                            <Ionicons name="time" size={24} color={colors.primary} />
                            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Duration</Text>
                            <Text style={[styles.infoValue, { color: colors.text }]}>
                                {service.duration} min
                            </Text>
                        </View>
                        <View style={[styles.infoCard, { backgroundColor: colors.card }, Shadows.sm]}>
                            <Ionicons name="logo-usd" size={24} color={colors.success} />
                            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Price</Text>
                            <Text style={[styles.infoValue, { color: colors.text }]}>${service.price}</Text>
                        </View>
                    </View>

                    {/* Date Selection */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Date</Text>
                        <View
                            style={[
                                styles.dateButton,
                                { backgroundColor: colors.card, borderColor: colors.border },
                                Shadows.sm,
                            ]}
                        >
                           <Ionicons name="calendar" size={24} color={colors.primary} />


                            <Text
                                style={[styles.dateText, { color: colors.text }]}
                                onPress={() => setShowDatePicker(true)}
                            >
                                {formatDate(selectedDate)}
                            </Text>
                        </View>
                    </View>

                    {showDatePicker && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleDateChange}
                            minimumDate={new Date()}
                        />
                    )}

                    {/* Time Slot Selection */}
                    <View style={styles.section}>
                        {availableTimeSlots.length > 0 ? (
                            <TimeSlotPicker
                                timeSlots={availableTimeSlots}
                                selectedSlot={selectedTimeSlot}
                                onSelectSlot={setSelectedTimeSlot}
                            />
                        ) : (
                            <View style={[styles.noSlotsContainer, { backgroundColor: colors.error + '10' }]}>
                                <Ionicons name="alert-circle" size={24} color={colors.error} />

                                <Text style={[styles.noSlotsText, { color: colors.error }]}>
                                    No slots available for this date. Please try another day.
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Book Button */}
                    <View style={styles.bookingSection}>
                        <Button
                            title="Book Appointment"
                            onPress={handleBookAppointment}
                            disabled={!selectedTimeSlot}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: 280,
        backgroundColor: '#E5E7EB',
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 20,
        left: Spacing.md,
        zIndex: 10,
    },
    content: {
        padding: Spacing.md,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.sm,
        marginBottom: Spacing.md,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '700',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: Spacing.sm,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: Spacing.lg,
    },
    infoCards: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginBottom: Spacing.lg,
    },
    infoCard: {
        flex: 1,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        gap: Spacing.xs,
    },
    infoLabel: {
        fontSize: 12,
    },
    infoValue: {
        fontSize: 18,
        fontWeight: '700',
    },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: Spacing.md,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
    },
    dateText: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    bookingSection: {
        marginTop: Spacing.md,
        marginBottom: Spacing.xl,
    },
    errorText: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: Spacing.xxl,
    },
    noSlotsContainer: {
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    noSlotsText: {
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
    },
});
