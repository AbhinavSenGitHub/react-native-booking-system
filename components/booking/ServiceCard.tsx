import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { Service } from '@/data/mockData';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

interface ServiceCardProps {
    service: Service;
    onPress: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onPress }) => {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.md]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Image source={{ uri: service.imageUrl }} style={styles.image} />
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                        {service.name}
                    </Text>
                    <View style={[styles.categoryBadge, { backgroundColor: colors.primary + '20' }]}>
                        <Text style={[styles.category, { color: colors.primary }]}>
                            {service.category}
                        </Text>
                    </View>
                </View>
                <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
                    {service.description}
                </Text>
                <View style={styles.footer}>
                    <View style={styles.infoItem}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Duration</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>{service.duration} min</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Price</Text>
                        <Text style={[styles.infoValue, { color: colors.primary }]}>${service.price}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.md,
        borderWidth: 1,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 180,
        backgroundColor: '#E5E7EB',
    },
    content: {
        padding: Spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        flex: 1,
        marginRight: Spacing.sm,
    },
    categoryBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: BorderRadius.sm,
    },
    category: {
        fontSize: 12,
        fontWeight: '600',
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: Spacing.md,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoItem: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
    },
});
