import React from 'react';
import { View, Text, StyleSheet, FlatList, useColorScheme, Platform } from 'react-native';
import { useAppointments } from '@/context/AppointmentContext';
import { AppointmentCard } from '@/components/booking/AppointmentCard';
import { Colors, Spacing } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function AppointmentsScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const { appointments, cancelAppointment } = useAppointments();

  // Filter out cancelled appointments and sort by date
  const activeAppointments = appointments
    .filter((apt) => apt.status !== 'cancelled')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>My Appointments</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {activeAppointments.length} {activeAppointments.length === 1 ? 'appointment' : 'appointments'}
        </Text>
      </View>

      {/* Appointments List */}
      <FlatList
        data={activeAppointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AppointmentCard appointment={item} onCancel={cancelAppointment} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <IconSymbol name="calendar.badge.clock" size={80} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Appointments Yet</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Book your first appointment from the Services tab
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Platform.OS === 'ios' ? Spacing.xl : Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
    paddingHorizontal: Spacing.lg,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});
