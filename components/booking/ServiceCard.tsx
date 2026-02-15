import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface Service {
    id: string;
    name: string;
    description: string;
    duration: string;
    price: number;
    category: string;
    imageUrl: string;
    rating?: number;
    reviewCount?: number;
}

interface ServiceCardProps {
    service: Service;
    onPress: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onPress }) => {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const isDark = colorScheme === 'dark';

    const rating = service.rating ? service.rating.toFixed(1) : (4.5 + Math.random() * 0.5).toFixed(1);
    const reviewCount = service.reviewCount || Math.floor(Math.random() * 100);
    const distance = (0.5 + Math.random() * 5).toFixed(1);

    return (
        <TouchableOpacity
            style={[
                styles.container,
                { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' },
                Shadows.md
            ]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.content}>
                <View style={styles.header}>
                    <Image
                        // source={{
                        //     uri: (service.imageUrl && service.imageUrl.startsWith('http'))
                        //         ? service.imageUrl
                        //         : `https://avatar.iran.liara.run/public/job/doctor/${Math.floor(Math.random() * 20)}`
                        // }}

                        source={require('../../assets/images/profile_doc.png')}
                        style={styles.profileImage}
                        resizeMode="cover"
                    />

                    <View style={styles.infoContainer}>
                        <View style={[styles.categoryBadge, { backgroundColor: isDark ? '#312E81' : '#F5F3FF' }]}>
                            <Text style={[styles.categoryText, { color: isDark ? '#A5B4FC' : '#8B5CF6' }]}>{service.category}</Text>
                        </View>

                        <Text style={[styles.name, { color: isDark ? '#F9FAFB' : '#111827' }]} numberOfLines={1}>
                            {service.name}
                        </Text>

                        <Text style={[styles.specialization, { color: '#6B7280' }]} numberOfLines={1}>
                            {service.category} - Hospital
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.bookmarkButton}>
                        <View style={[styles.bookmarkIcon, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}>
                            <Ionicons name="bookmark-outline" size={20} color="#6366F1" />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <View style={styles.stat}>
                        <Ionicons name="star" size={16} color="#F59E0B" />
                        <Text style={styles.statText}>{rating} ({reviewCount} reviews)</Text>
                    </View>

                    <View style={styles.stat}>
                        <Ionicons name="location" size={16} color="#6366F1" />
                        <Text style={styles.statText}>{distance} km away</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        marginBottom: 20,
        overflow: 'hidden',
        elevation: 4,
    },
    content: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 12,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#E5E7EB',
    },
    infoContainer: {
        flex: 1,
    },
    bookmarkButton: {
        marginLeft: 'auto',
    },
    bookmarkIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#F5F3FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 4,
    },
    categoryText: {
        fontSize: 10,
        color: '#8B5CF6',
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    name: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 4,
    },
    specialization: {
        fontSize: 13,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '600',
    },
});