import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useColorScheme,
  TextInput,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Image,
  ScrollView
} from 'react-native';
import { router } from 'expo-router';
import { ServiceCard } from '@/components/booking/ServiceCard';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { fetchServices, fetchDoctors } from '@/store/slices/serviceSlice';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

const CATEGORIES = [
  { id: '1', title: 'Heart', icon: 'heart-pulse', color: '#FFF5F5', iconColor: '#FF6B6B' },
  { id: '2', title: 'Dental', icon: 'tooth', color: '#F0F7FF', iconColor: '#3B82F6' },
  { id: '3', title: 'General', icon: 'account', color: '#F5F3FF', iconColor: '#8B5CF6' },
  { id: '4', title: 'Skin', icon: 'flask', color: '#FFF7ED', iconColor: '#F97316' },
  { id: '5', title: 'Child', icon: 'baby-face-outline', color: '#ECFDF5', iconColor: '#10B981' },
];

export default function ServicesScreen() {
  useAuthRedirect();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { services, doctors, loading } = useAppSelector(state => state.services);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [bannerExpanded, setBannerExpanded] = useState(false);

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(fetchDoctors());
  }, [dispatch]);

  // If a category is selected, we filter DOCTORS. If no category, we can show "Popular Doctors" (all doctors sorted by rating)
  const displayData = doctors.filter(
    (doc) =>
      (doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.specialization && doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()))) &&
      (!selectedCategory || (doc.specialization && doc.specialization.includes(selectedCategory)))
  ).sort((a, b) => (b.rating || 5) - (a.rating || 5));

  const handleServicePress = (doctorId: string) => {
    // In our system, we use service-details which takes a "service id". 
    // But now we want to book a DOCTOR. 
    // Let's find a service that matches the category or just use a generic consultation service.
    const matchingService = services.find(s => s.category === selectedCategory) || services[0];
    router.push({
      pathname: '/service-details',
      params: { id: matchingService?._id, doctorId: doctorId }
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#FFFFFF' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <FlatList
        data={displayData}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.headerTop}>
                <View style={styles.greetingSection}>
                  <Text style={[styles.greeting, { color: '#6366F1' }]}>
                    Hi, {user?.name?.split(' ')[0] || 'Talan'}
                  </Text>
                  <Text style={[styles.mainTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
                    Let's Find Your Doctor
                  </Text>
                </View>
                <TouchableOpacity style={styles.notificationButton}>
                  <Ionicons name="notifications" size={24} color="#6366F1" />
                  <View style={styles.notificationBadge} />
                </TouchableOpacity>
              </View>

              {/* Search Bar */}
              <View style={[styles.searchContainer, { backgroundColor: '#F3F4F6' }]}>
                <Ionicons name="search-outline" size={20} color="#9CA3AF" />
                <TextInput
                  style={[styles.searchInput, { color: '#111827' }]}
                  placeholder="Search"
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            {/* Categories Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>Categories</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
              >
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={styles.categoryCardWrapper}
                    onPress={() => setSelectedCategory(selectedCategory === cat.title ? null : cat.title)}
                  >
                    <View style={[
                      styles.categoryIconBox,
                      {
                        backgroundColor: cat.color,
                        borderColor: selectedCategory === cat.title ? '#6366F1' : 'transparent',
                        borderWidth: 2
                      }
                    ]}>
                      <MaterialCommunityIcons name={cat.icon as any} size={28} color={cat.iconColor} />
                    </View>
                    <Text style={[styles.categoryLabel, { color: selectedCategory === cat.title ? '#6366F1' : '#6B7280' }]}>
                      {cat.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Health Banner */}
            <View style={styles.bannerContainer}>
              <View style={[styles.bannerCard, bannerExpanded && { height: 'auto', paddingBottom: 20 }]}>
                <View style={styles.bannerContent}>
                  <Text style={styles.bannerTitle}>How to Save your life from COVID-19</Text>

                  {bannerExpanded && (
                    <View style={styles.bannerMethods}>
                      <Text style={styles.methodText}>• Wear a mask in public places</Text>
                      <Text style={styles.methodText}>• Maintain social distancing (6ft)</Text>
                      <Text style={styles.methodText}>• Wash hands frequently</Text>
                      <Text style={styles.methodText}>• Get vaccinated & stay boosted</Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.readMoreBtn}
                    onPress={() => setBannerExpanded(!bannerExpanded)}
                  >
                    <Text style={styles.readMoreText}>{bannerExpanded ? 'Read less' : 'Read more'}</Text>
                  </TouchableOpacity>
                </View>
                {!bannerExpanded && (
                  <Image
                    source={require('../../assets/images/doctor_logo.png')}
                    style={styles.bannerImage}
                  />
                )}
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>Popular Doctors</Text>
              <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <ServiceCard
            service={{
              id: item._id,
              name: item.name,
              category: item.specialization || 'General',
              imageUrl: item.imageUrl || `https://avatar.iran.liara.run/public/job/doctor/${Math.floor(Math.random() * 50)}`,
              description: `${item.experience || 5} years of experience`,
              price: 50,
              duration: '30',
              rating: item.rating,
              reviewCount: item.reviewCount
            } as any}
            onPress={() => item._id && handleServicePress(item._id)}
          />
        )}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color="#6366F1" style={{ marginTop: 40 }} />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={64} color="#9CA3AF" />
              <Text style={[styles.emptyText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                No doctors found
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}

// Helper function for greeting
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 32,
  },
  notificationButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 54,
    borderRadius: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 15,
  },
  categoriesContainer: {
    paddingRight: 20,
  },
  categoryCardWrapper: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  categoryIconBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
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
  categoryLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  bannerContainer: {
    marginVertical: 25,
  },
  bannerCard: {
    backgroundColor: '#6366F1',
    borderRadius: 28,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  bannerMethods: {
    marginTop: 0,
    marginBottom: 12,
  },
  methodText: {
    color: '#E0E7FF',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  bannerContent: {
    flex: 1,
    marginRight: 10,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
    marginBottom: 15,
  },
  readMoreBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  bannerImage: {
    width: 90,
    height: 90,
    // tintColor: '#FFFFFF',
    opacity: 0.9,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllText: {
    color: '#6366F1',
    fontWeight: '700',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 15,
    fontWeight: '500',
  },
});