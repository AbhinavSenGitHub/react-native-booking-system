import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';
import { TimeSlot } from '@/data/mockData';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

interface TimeSlotPickerProps {
    timeSlots: TimeSlot[];
    selectedSlot: string | null;
    onSelectSlot: (time: string) => void;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
    timeSlots,
    selectedSlot,
    onSelectSlot,
}) => {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.text }]}>Select Time Slot</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.slotsContainer}
            >
                {timeSlots.map((slot) => {
                    const isSelected = selectedSlot === slot.time;
                    const isDisabled = !slot.available;

                    return (
                        <TouchableOpacity
                            key={slot.id}
                            style={[
                                styles.slotButton,
                                {
                                    backgroundColor: isSelected
                                        ? colors.primary
                                        : isDisabled
                                            ? colors.disabled + '40'
                                            : colors.card,
                                    borderColor: isSelected ? colors.primary : colors.border,
                                },
                            ]}
                            onPress={() => onSelectSlot(slot.time)}
                            disabled={isDisabled}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.slotText,
                                    {
                                        color: isSelected
                                            ? '#FFFFFF'
                                            : isDisabled
                                                ? colors.disabled
                                                : colors.text,
                                        fontWeight: isSelected ? '700' : '600',
                                    },
                                ]}
                            >
                                {slot.time}
                            </Text>
                            {!slot.available && (
                                <Text style={[styles.unavailableText, { color: colors.textSecondary }]}>
                                    Booked
                                </Text>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.lg,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: Spacing.md,
    },
    slotsContainer: {
        gap: Spacing.sm,
        paddingVertical: Spacing.xs,
    },
    slotButton: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm + 2,
        borderRadius: BorderRadius.md,
        borderWidth: 2,
        minWidth: 90,
        alignItems: 'center',
    },
    slotText: {
        fontSize: 16,
    },
    unavailableText: {
        fontSize: 10,
        marginTop: 2,
    },
});
