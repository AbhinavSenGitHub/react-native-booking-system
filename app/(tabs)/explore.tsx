import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, useColorScheme, Platform, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TimeSlotPicker } from '@/components/booking/TimeSlotPicker';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAppointments, updateAppointmentStatus, postReview, rescheduleAppointment } from '@/store/slices/appointmentSlice';
import { AppointmentCard } from '@/components/booking/AppointmentCard';
import { Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

export default function AppointmentsScreen() {
  useAuthRedirect();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { myAppointments, doctorAppointments, loading } = useAppSelector(state => state.appointments);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const [activeTab, setActiveTab] = React.useState<string>(
    user?.role === 'Doctor' ? 'Upcoming' : 'Upcoming'
  );

  // For Doctors, let's use a cleaner 3-tab system as requested: ["Upcoming", "My Bookings", "Past"]
  // If user is DR: 
  // - Upcoming: doctorAppointments (Status: booked/accepted)
  // - My Bookings: myAppointments (Status: booked/accepted)
  // - Past: Combined doctorAppointments + myAppointments (Status: completed/rejected)

  const doctorTabs = ['Upcoming', 'My Bookings', 'Past'];
  const patientTabs = ['Upcoming', 'Past'];
  const tabs = user?.role === 'Doctor' ? doctorTabs : patientTabs;

  // Set default tab if needed
  useEffect(() => {
    if (user?.role === 'Doctor' && !doctorTabs.includes(activeTab)) {
      setActiveTab('Upcoming');
    }
  }, [user?.role]);

  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Reschedule Modal State
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedApt, setSelectedApt] = useState<any>(null);
  const [rescheduleDate, setRescheduleDate] = useState(new Date());
  const [rescheduleTimeSlot, setRescheduleTimeSlot] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchAppointments(user.role));
    }
  }, [dispatch, user]);

  const getFilteredAppointments = () => {
    if (user?.role === 'Doctor') {
      if (activeTab === 'Upcoming') {
        return doctorAppointments
          .filter(apt => ['booked', 'accepted'].includes(apt.status.toLowerCase()))
          .map(apt => ({ ...apt, displayName: apt.patient?.name || 'Patient', canCancel: false, type: 'request' }));
      }
      if (activeTab === 'My Bookings') {
        return myAppointments
          .filter(apt => ['booked', 'accepted'].includes(apt.status.toLowerCase()))
          .map(apt => ({ ...apt, displayName: apt.doctor?.name || 'Doctor', canCancel: true, type: 'my' }));
      }
      if (activeTab === 'Past') {
        // Only show patient entries in Past as requested "just show those entry which are of that patient"
        return doctorAppointments
          .filter(apt => ['completed', 'rejected'].includes(apt.status.toLowerCase()))
          .map(apt => ({ ...apt, displayName: apt.patient?.name || 'Patient', canCancel: false, type: 'request' }));
      }
    } else {
      // Patient view
      if (activeTab === 'Upcoming') {
        return myAppointments
          .filter(apt => ['booked', 'accepted'].includes(apt.status.toLowerCase()))
          .map(apt => ({ ...apt, displayName: apt.doctor?.name || 'Doctor', canCancel: true, type: 'my' }));
      }
      if (activeTab === 'Past') {
        return myAppointments
          .filter(apt => ['completed', 'rejected'].includes(apt.status.toLowerCase()))
          .map(apt => ({ ...apt, displayName: apt.doctor?.name || 'Doctor', canCancel: false, type: 'my' }));
      }
    }
    return [];
  };

  const filteredAppointments = getFilteredAppointments();

  const sortedAppointments = [...filteredAppointments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleUpdateStatus = async (id: string, status: string) => {
    const result = await dispatch(updateAppointmentStatus({ id, status }));
    if (updateAppointmentStatus.fulfilled.match(result)) {
      if (user) dispatch(fetchAppointments(user.role));
    }
  };

  const handleShowReview = (id: string) => {
    setSelectedAppointmentId(id);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedAppointmentId) return;
    if (!reviewComment.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    const result = await dispatch(postReview({
      appointmentId: selectedAppointmentId,
      rating: reviewRating,
      comment: reviewComment
    }));

    if (postReview.fulfilled.match(result)) {
      Alert.alert('Success', 'Review posted successfully');
      setShowReviewModal(false);
      setReviewComment('');
      setReviewRating(5);
      if (user) dispatch(fetchAppointments(user.role));
    } else {
      Alert.alert('Error', result.payload as string || 'Failed to post review');
    }
  };

  const handleShowReschedule = (apt: any) => {
    setSelectedApt(apt);
    setRescheduleDate(new Date(apt.date));
    setRescheduleTimeSlot(apt.timeSlot);
    setShowRescheduleModal(true);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setRescheduleDate(selectedDate);
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!selectedApt || !rescheduleTimeSlot) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }

    const result = await dispatch(rescheduleAppointment({
      id: selectedApt.id,
      date: rescheduleDate.toISOString(),
      timeSlot: rescheduleTimeSlot
    }));

    if (rescheduleAppointment.fulfilled.match(result)) {
      Alert.alert('Success', 'Appointment rescheduled successfully');
      setShowRescheduleModal(false);
      if (user) dispatch(fetchAppointments(user.role));
    } else {
      Alert.alert('Error', result.payload as string || 'Failed to reschedule');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#FFFFFF' }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, { color: isDark ? '#F9FAFB' : '#111827' }]}>Schedule</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{filteredAppointments.length}</Text>
          </View>
        </View>

        {/* Unified Tab Bar */}
        <View style={[styles.tabBar, isDark && styles.tabBarDark]}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && [styles.activeTab, isDark && styles.activeTabDark]
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab ? styles.activeTabText : { color: isDark ? '#9CA3AF' : '#6B7280' }
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Appointments List */}
      {loading && filteredAppointments.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <FlatList
          data={sortedAppointments}
          keyExtractor={(item) => item._id}
          onRefresh={() => user && dispatch(fetchAppointments(user.role))}
          refreshing={loading}
          renderItem={({ item }: { item: any }) => (
            <View style={styles.cardContainer}>
              <AppointmentCard
                appointment={{
                  ...item,
                  id: item._id,
                  status: item.status.toLowerCase() as any,
                  doctorName: item.type === 'my' ? item.displayName : undefined,
                  patientName: item.type === 'request' ? item.displayName : undefined,
                  serviceName: item.service?.name || 'Service',
                  serviceImageUrl: item.service?.imageUrl
                }}
                onCancel={item.canCancel && item.status.toLowerCase() === 'booked' ? () => handleUpdateStatus(item._id, 'Rejected') : undefined}
                onReview={user?.role === 'Patient' && item.status.toLowerCase() === 'completed' ? handleShowReview : undefined}
                onReschedule={user?.role === 'Patient' && item.status.toLowerCase() === 'booked' ? handleShowReschedule : undefined}
              />
              {user?.role === 'Doctor' && activeTab === 'Upcoming' && item.status.toLowerCase() === 'booked' && (
                <View style={styles.doctorActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#F0FDF4' }]}
                    onPress={() => handleUpdateStatus(item._id, 'Accepted')}
                  >
                    <Text style={[styles.actionText, { color: '#10B981' }]}>Accept Request</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#FEF2F2' }]}
                    onPress={() => handleUpdateStatus(item._id, 'Rejected')}
                  >
                    <Text style={[styles.actionText, { color: '#EF4444' }]}>Decline</Text>
                  </TouchableOpacity>
                </View>
              )}
              {user?.role === 'Doctor' && activeTab === 'Upcoming' && item.status.toLowerCase() === 'accepted' && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#F5F3FF', marginBottom: 15, marginHorizontal: 20 }]}
                  onPress={() => handleUpdateStatus(item._id, 'Completed')}
                >
                  <Text style={[styles.actionText, { color: '#6366F1' }]}>Mark Consultation as Completed</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="calendar-outline" size={60} color="#6366F1" />
              </View>
              <Text style={[styles.emptyTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>No Schedule Yet</Text>
              <Text style={styles.emptyText}>
                {user?.role === 'Doctor' && activeTab === 'Upcoming'
                  ? 'Your patients will appear here once they book an appointment'
                  : 'Start your health journey by booking your first visit'}
              </Text>
            </View>
          }
        />
      )}

      {/* Review Modal */}
      <Modal
        visible={showReviewModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReviewModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>Rate your Experience</Text>
            <Text style={styles.modalSubtitle}>How was your consultation?</Text>

            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setReviewRating(star)}>
                  <Ionicons
                    name={(star <= reviewRating ? "star" : "star-outline") as any}
                    size={40}
                    color="#F59E0B"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={[styles.reviewInput, {
                backgroundColor: isDark ? '#111827' : '#F3F4F6',
                color: isDark ? '#F9FAFB' : '#111827'
              }]}
              placeholder="Write your review here..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              value={reviewComment}
              onChangeText={setReviewComment}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#F3F4F6' }]}
                onPress={() => setShowReviewModal(false)}
              >
                <Text style={[styles.modalBtnText, { color: '#6B7280' }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#6366F1' }]}
                onPress={handleSubmitReview}
              >
                <Text style={[styles.modalBtnText, { color: '#FFFFFF' }]}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        visible={showRescheduleModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRescheduleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF', maxHeight: '80%' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>Reschedule Appointment</Text>
            <Text style={styles.modalSubtitle}>Change your appointment timing</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.sectionTitleModal, { color: isDark ? '#F9FAFB' : '#111827' }]}>Choose New Date</Text>
              <TouchableOpacity
                style={[styles.datePickerBtn, { backgroundColor: isDark ? '#111827' : '#F3F4F6' }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#6366F1" />
                <Text style={[styles.datePickerText, { color: isDark ? '#F9FAFB' : '#111827' }]}>
                  {rescheduleDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={rescheduleDate}
                  mode="date"
                  display="default"
                  minimumDate={new Date()}
                  onChange={onDateChange}
                />
              )}

              <Text style={[styles.sectionTitleModal, { color: isDark ? '#F9FAFB' : '#111827', marginTop: 20 }]}>Available Slots</Text>
              <TimeSlotPicker
                selectedSlot={rescheduleTimeSlot}
                onSelectSlot={setRescheduleTimeSlot}
                timeSlots={[
                  { id: '1', time: '09:00', available: true },
                  { id: '2', time: '10:00', available: true },
                  { id: '3', time: '11:00', available: true },
                  { id: '4', time: '14:00', available: true },
                  { id: '5', time: '15:00', available: true },
                  { id: '6', time: '16:00', available: true },
                ]}
              />

              <View style={[styles.modalActions, { marginTop: 30 }]}>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#F3F4F6' }]}
                  onPress={() => setShowRescheduleModal(false)}
                >
                  <Text style={[styles.modalBtnText, { color: '#6B7280' }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#6366F1' }]}
                  onPress={handleRescheduleSubmit}
                >
                  <Text style={[styles.modalBtnText, { color: '#FFFFFF' }]}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 10
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: '800' },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#6366F1',
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 15,
    padding: 4,
    marginBottom: 10,
  },
  tabBarDark: {
    backgroundColor: '#1F2937',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  activeTabDark: {
    backgroundColor: '#374151',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
  },
  activeTabText: {
    color: '#6366F1',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    marginBottom: 8
  },
  doctorActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700'
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    paddingHorizontal: 40
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 10
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#6B7280',
    lineHeight: 22
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    padding: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  reviewInput: {
    borderRadius: 16,
    padding: 16,
    height: 120,
    textAlignVertical: 'top',
    fontSize: 14,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  sectionTitleModal: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 15,
  },
  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
  },
  datePickerText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
