import React, { useState, useEffect } from 'react';
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
    ActivityIndicator,
    StatusBar,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { bookAppointment, fetchAppointments } from '@/store/slices/appointmentSlice';
import { fetchDoctors, fetchServices } from '@/store/slices/serviceSlice';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/booking/Button';
import { TimeSlotPicker } from '@/components/booking/TimeSlotPicker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ServiceDetailsScreen() {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const isDark = colorScheme === 'dark';
    const { id, doctorId } = useLocalSearchParams<{ id: string, doctorId?: string }>();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const { services, doctors, loading: servicesLoading } = useAppSelector(state => state.services);

    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [booking, setBooking] = useState(false);
    const [reviews, setReviews] = useState<any[]>([]);
    const [expanded, setExpanded] = useState(false);

    const service = services.find((s: any) => s._id === id);
    console.log("service:--", service)
    useEffect(() => {
        if (services.length === 0) dispatch(fetchServices());
        dispatch(fetchDoctors());
    }, [dispatch]);

    useEffect(() => {
        if (doctors.length > 0) {
            const doc = doctorId ? doctors.find(d => d._id === doctorId) : doctors[0];
            setSelectedDoctor(doc);
        }
    }, [doctors, doctorId]);

    useEffect(() => {
        if (selectedDoctor) {
            import('@/api/client').then(client => {
                client.default.get(`/reviews/doctor/${selectedDoctor._id}`)
                    .then(res => setReviews(res.data))
                    .catch(e => console.error('Failed to fetch reviews', e));
            });
        }
    }, [selectedDoctor]);

    const getAvailableTimeSlots = () => {
        if (!selectedDoctor) return [];

        const dateStr = selectedDate.toISOString().split('T')[0];
        const doctorSlots = selectedDoctor.availableSlots?.find((s: any) => s.date === dateStr);

        if (doctorSlots) {
            return doctorSlots.slots.map((s: string, index: number) => ({ id: `ds-${index}`, time: s, available: true }));
        }

        // Default slots if none defined for doctor
        return [
            { id: '1', time: '09:00', available: true },
            { id: '2', time: '10:00', available: true },
            { id: '3', time: '11:00', available: true },
            { id: '4', time: '14:00', available: true },
            { id: '5', time: '15:00', available: true },
            { id: '6', time: '16:00', available: true },
        ];
    };

    const availableTimeSlots = getAvailableTimeSlots();

    const handleDateChange = (event: any, date?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (date) {
            setSelectedDate(date);
            setSelectedTimeSlot(null);
        }
    };

    const handleBookAppointment = async () => {
        if (!selectedTimeSlot || !selectedDoctor || !service) {
            Alert.alert('Selection Required', 'Please select a doctor and a time slot');
            return;
        }

        setBooking(true);
        try {
            const resultAction = await dispatch(bookAppointment({
                doctorId: selectedDoctor._id,
                serviceId: service._id,
                date: selectedDate.toISOString(),
                timeSlot: selectedTimeSlot,
            }));

            if (bookAppointment.fulfilled.match(resultAction)) {
                if (user) dispatch(fetchAppointments(user.role));
                Alert.alert(
                    'Success!',
                    'Your appointment has been booked successfully',
                    [{ text: 'View Appointments', onPress: () => router.push('/(tabs)/explore' as any) }]
                );
            } else {
                Alert.alert('Booking Failed', (resultAction.payload as string) || 'Please try again');
            }
        } catch (error) {
            Alert.alert('Booking Failed', 'Please try again later');
        } finally {
            setBooking(false);
        }
    };

    if (servicesLoading && !service) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
    if (!service) return <View style={styles.container}><Text>Service not found</Text></View>;

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F8FAFC' }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Custom Header with Doctor Profile */}
                <View style={styles.header}>
                    <View style={[styles.headerControls, { backgroundColor: isDark ? '#1F2937' : 'transparent', borderRadius: 20 }]}>
                        <TouchableOpacity onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}>
                            <Ionicons name="chevron-back" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
                        </TouchableOpacity>
                        <Text style={[styles.headerTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>Doctor Details</Text>
                        <TouchableOpacity onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}>
                            <Ionicons name="close" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.profileSection}>
                        <Image
                            source={require('../assets/images/profile_doc.png')}
                            style={styles.profileImage}
                        />
                        <View style={styles.profileInfo}>
                            <Text style={[styles.doctorName, { color: isDark ? '#F9FAFB' : '#111827' }]}>
                                {selectedDoctor?.name || 'Alli Madsen'}
                            </Text>
                            <Text style={styles.doctorSpecialization}>
                                {selectedDoctor?.specialization || service.category} - Hospital
                            </Text>
                            <View style={styles.ratingRow}>
                                <View style={styles.ratingBadge}>
                                    <Ionicons name="star" size={14} color="#F59E0B" />
                                    <Text style={styles.locationText}>
                                        {selectedDoctor?.rating?.toFixed(1) || '4.5'} ({selectedDoctor?.reviewCount || 0} reviews)
                                    </Text>
                                </View>
                                <View style={styles.locationBadge}>
                                    <Ionicons name="location" size={14} color="#6366F1" />
                                    <Text style={styles.locationText}>800m away</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.mainContent}>
                    <Text style={[styles.sectionTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>About Doctor</Text>
                    <Text style={[styles.aboutText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                        {expanded
                            ? "You will get a complete health solution package. Our team of professionals ensures top-notch care and personalized treatment plans for every patient. We use the latest medical technology and evidence-based practices to provide the best possible outcomes for our patients. Our facility is equipped with state-of-the-art diagnostic and treatment tools."
                            : "You will get a complete health solution package. Our team of professionals ensures top-notch care and personalized treatment plans for every patient..."
                        }
                        <Text style={styles.readMore} onPress={() => setExpanded(!expanded)}>
                            {expanded ? ' Read Less' : ' Read More'}
                        </Text>
                    </Text>

                    <View style={styles.dateSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>Choose Date</Text>
                            <Text style={styles.monthText}>
                                {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </Text>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroller}>
                            {[...Array(14)].map((_, i) => {
                                const d = new Date();
                                d.setDate(d.getDate() + i);
                                const isSelected = d.toDateString() === selectedDate.toDateString();
                                return (
                                    <TouchableOpacity
                                        key={i}
                                        style={[
                                            styles.dateCard,
                                            { backgroundColor: isDark ? '#1F2937' : '#FFFFFF', borderColor: isDark ? '#374151' : '#F3F4F6' },
                                            isSelected && styles.dateCardActive
                                        ]}
                                        onPress={() => setSelectedDate(d)}
                                    >
                                        <Text style={[styles.dayName, isSelected && styles.textWhite]}>
                                            {d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
                                        </Text>
                                        <Text style={[styles.dayNum, { color: isDark ? '#F9FAFB' : '#111827' }, isSelected && styles.textWhite]}>
                                            {d.getDate()}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>

                    <View style={styles.timeSection}>
                        <Text style={[styles.sectionTitle, { color: isDark ? '#F9FAFB' : '#111827' }, { marginBottom: 15 }]}>
                            Choose Time
                        </Text>
                        <TimeSlotPicker
                            timeSlots={availableTimeSlots}
                            selectedSlot={selectedTimeSlot}
                            onSelectSlot={setSelectedTimeSlot}
                        />
                    </View>

                    {/* Reviews Section */}
                    <View style={styles.reviewsSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>Reviews</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAllText}>See all</Text>
                            </TouchableOpacity>
                        </View>
                        {reviews.length > 0 ? reviews.map((item, idx) => (
                            <View key={idx} style={[styles.reviewCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
                                <View style={styles.reviewHeader}>
                                    <View style={styles.reviewUser}>
                                        <Image
                                            source={{ uri: `https://avatar.iran.liara.run/public/${idx + 20}` }}
                                            style={[styles.reviewAvatar, { backgroundColor: isDark ? '#111827' : '#F3F4F6' }]}
                                        />
                                        <View>
                                            <Text style={[styles.reviewName, { color: isDark ? '#F9FAFB' : '#111827' }]}>
                                                {item.patient?.name || 'Anonymous'}
                                            </Text>
                                            <Text style={styles.reviewDate}>
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={[styles.reviewRating, { backgroundColor: isDark ? '#111827' : '#FFF7ED' }]}>
                                        <Ionicons name="star" size={12} color="#F59E0B" />
                                        <Text style={styles.reviewRatingText}>{item.rating}.0</Text>
                                    </View>
                                </View>
                                <Text style={[styles.reviewComment, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>{item.comment}</Text>
                            </View>
                        )) : (
                            <View style={styles.emptyReviews}>
                                <Text style={[styles.reviewComment, { textAlign: 'center' }]}>No reviews yet for this doctor.</Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Sticky Bottom Bar */}
            <View style={[styles.footer, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF', borderTopColor: isDark ? '#374151' : '#F3F4F6' }]}>
                <TouchableOpacity
                    style={[
                        styles.bookBtn,
                        (!selectedTimeSlot || booking) && [styles.bookBtnDisabled, { backgroundColor: isDark ? '#374151' : '#E5E7EB' }]
                    ]}
                    onPress={handleBookAppointment}
                    disabled={!selectedTimeSlot || booking}
                >
                    <Text style={[styles.bookBtnText, (!selectedTimeSlot || booking) && isDark && { color: '#9CA3AF' }]}>
                        {booking ? 'Booking...' : 'Book Now'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: 100 },
    header: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 25,
    },
    headerControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 20,
        backgroundColor: '#E5E7EB',
    },
    profileInfo: {
        marginLeft: 20,
        flex: 1,
    },
    doctorName: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 4,
    },
    doctorSpecialization: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
        marginBottom: 8,
    },
    ratingRow: {
        flexDirection: 'row',
        gap: 12,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '700',
    },
    locationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    mainContent: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 10,
    },
    aboutText: {
        fontSize: 15,
        color: '#6B7280',
        lineHeight: 22,
        marginBottom: 25,
    },
    readMore: {
        color: '#6366F1',
        fontWeight: '700',
    },
    dateSection: {
        marginBottom: 25,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    monthText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '600',
    },
    dateScroller: {
        flexDirection: 'row',
    },
    dateCard: {
        width: 55,
        height: 75,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    dateCardActive: {
        backgroundColor: '#6366F1',
        borderColor: '#6366F1',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    dayName: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
        marginBottom: 6,
    },
    dayNum: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
    },
    textWhite: {
        color: '#FFFFFF',
    },
    timeSection: {
        marginBottom: 30,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    chatBtn: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    chatText: {
        fontSize: 10,
        color: '#6366F1',
        fontWeight: '700',
        marginTop: 2,
    },
    bookBtn: {
        flex: 1,
        height: 60,
        borderRadius: 20,
        backgroundColor: '#6366F1',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    bookBtnDisabled: {
        backgroundColor: '#E5E7EB',
        shadowOpacity: 0,
    },
    bookBtnText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '800',
    },
    reviewsSection: {
        marginTop: 10,
        marginBottom: 30,
    },
    seeAllText: {
        color: '#6366F1',
        fontWeight: '700',
        fontSize: 14,
    },
    reviewCard: {
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    reviewUser: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    reviewAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
    },
    reviewName: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 2,
    },
    reviewDate: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    reviewRating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FFF7ED',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    reviewRatingText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#F59E0B',
    },
    reviewComment: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    emptyReviews: {
        padding: 24,
        alignItems: 'center',
    },
});
