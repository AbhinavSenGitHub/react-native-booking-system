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
    const isDark = colorScheme === 'dark';

    return (
        <View style={styles.container}>
            <View style={styles.grid}>
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
                                        ? '#6366F1'
                                        : colors.card,
                                    borderColor: isSelected ? '#6366F1' : (isDark ? '#374151' : '#F3F4F6'),
                                },
                                isDisabled && [styles.disabledButton, { backgroundColor: isDark ? '#111827' : '#F3F4F6' }]
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
                                            : colors.text,
                                        fontWeight: isSelected ? '800' : '600',
                                    },
                                    isDisabled && styles.disabledText
                                ]}
                            >
                                {slot.time} {slot.time.split(':')[0] >= '12' ? 'pm' : 'am'}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    slotButton: {
        flexBasis: '30%',
        flexGrow: 1,
        height: 50,
        borderRadius: 15,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.3,
        backgroundColor: '#F3F4F6',
    },
    slotText: {
        fontSize: 14,
    },
    disabledText: {
        color: '#9CA3AF',
    },
});
