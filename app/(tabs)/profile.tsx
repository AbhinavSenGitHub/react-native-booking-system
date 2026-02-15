import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useColorScheme, TextInput, Alert, Image, Modal, ActivityIndicator } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout, updateProfile } from '@/store/slices/authSlice';
import { fetchAppointments } from '@/store/slices/appointmentSlice';
import { Ionicons } from '@expo/vector-icons';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

export default function ProfileScreen() {
    useAuthRedirect();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const { myAppointments, doctorAppointments } = useAppSelector(state => state.appointments);

    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editName, setEditName] = useState(user?.name || '');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user?.role) {
            dispatch(fetchAppointments(user.role));
        }
    }, [dispatch, user?.role]);

    useEffect(() => {
        if (user?.name) {
            setEditName(user.name);
        }
    }, [user?.name]);

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: () => dispatch(logout()) }
        ]);
    };

    const handleSaveProfile = async () => {
        if (!editName.trim()) {
            Alert.alert('Error', 'Name cannot be empty');
            return;
        }
        setIsSaving(true);
        try {
            await dispatch(updateProfile({ name: editName })).unwrap();
            setIsEditModalVisible(false);
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error: any) {
            Alert.alert('Error', error || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    // Calculate stats based on real data
    const appointments = user?.role === 'Doctor' ? doctorAppointments : myAppointments;
    const totalCount = appointments.length;
    const completedCount = appointments.filter(a => a.status === 'Completed').length;
    const rating = user?.role === 'Doctor' ? (user as any).rating || 0 : null;

    const themeColors = {
        background: isDark ? '#111827' : '#F8FAFC',
        card: isDark ? '#1F2937' : '#FFFFFF',
        text: isDark ? '#F9FAFB' : '#111827',
        subtext: '#6B7280',
        border: isDark ? '#374151' : '#F3F4F6',
        inputBg: isDark ? '#374151' : '#F3F4F6',
        inputBorder: isDark ? '#4B5563' : '#E5E7EB',
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <View style={styles.avatarWrapper}>
                    <Image
                        source={{ uri: `https://avatar.iran.liara.run/public/${user?.role === 'Doctor' ? 'job/doctor' : '38'}` }}
                        style={styles.avatar}
                    />
                    <TouchableOpacity style={styles.editAvatarBtn}>
                        <Ionicons name="camera" size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.userNameContainer}
                    onPress={() => setIsEditModalVisible(true)}
                >
                    <Text style={[styles.userName, { color: themeColors.text }]}>{user?.name}</Text>
                    <Ionicons name="pencil-sharp" size={16} color="#6366F1" style={{ marginLeft: 8, marginTop: 4 }} />
                </TouchableOpacity>
                <Text style={styles.userEmail}>{user?.email}</Text>
            </View>

            {/* Stats Row - Only for Doctors */}
            {user?.role === 'Doctor' ? (
                <View style={styles.statsRow}>
                    <View style={[styles.statItem, { backgroundColor: themeColors.card }]}>
                        <Text style={[styles.statValue, { color: themeColors.text }]}>{totalCount}</Text>
                        <Text style={styles.statLabel}>Appointments</Text>
                    </View>
                    <View style={[styles.statItem, { backgroundColor: themeColors.card }]}>
                        <Text style={[styles.statValue, { color: themeColors.text }]}>{completedCount}</Text>
                        <Text style={styles.statLabel}>Completed</Text>
                    </View>
                    {rating !== null && (
                        <View style={[styles.statItem, { backgroundColor: themeColors.card }]}>
                            <Text style={[styles.statValue, { color: themeColors.text }]}>
                                {typeof rating === 'number' ? rating.toFixed(1) : rating}
                            </Text>
                            <Text style={styles.statLabel}>Rating</Text>
                        </View>
                    )}
                </View>
            ) : (
                /* Patient Welcome Section */
                <View style={[styles.welcomeBanner, { backgroundColor: '#6366F1' }]}>
                    <View style={styles.welcomeTextContent}>
                        <Text style={styles.welcomeTitle}>Your Health, Simplified</Text>
                        <Text style={styles.welcomeDesc}>Manage your appointments, chat with specialists, and track your wellness journey all in one place.</Text>
                    </View>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3845/3845868.png' }}
                        style={styles.welcomeImage}
                    />
                </View>
            )}

            <View style={styles.menuSection}>
                <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Settings</Text>
                <View style={[styles.menuCard, { backgroundColor: themeColors.card }]}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => setIsEditModalVisible(true)}
                    >
                        <View style={styles.menuLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: '#6366F115' }]}>
                                <Ionicons name="person-outline" size={20} color="#6366F1" />
                            </View>
                            <Text style={[styles.menuTitle, { color: themeColors.text }]}>Edit Profile</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            {/* Edit Profile Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isEditModalVisible}
                onRequestClose={() => setIsEditModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: themeColors.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: themeColors.text }]}>Edit Profile</Text>
                            <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                                <Ionicons name="close" size={24} color={themeColors.subtext} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Full Name</Text>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: themeColors.inputBg,
                                    color: themeColors.text,
                                    borderColor: themeColors.inputBorder
                                }]}
                                value={editName}
                                onChangeText={setEditName}
                                placeholder="Enter your name"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email Address (Read-only)</Text>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: isDark ? '#111827' : '#E5E7EB',
                                    color: '#9CA3AF',
                                    borderColor: themeColors.inputBorder
                                }]}
                                value={user?.email}
                                editable={false}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.saveBtn}
                            onPress={handleSaveProfile}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.saveBtnText}>Save Changes</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        alignItems: 'center',
        paddingTop: 60,
        marginBottom: 30,
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 40,
        backgroundColor: '#F3F4F6',
    },
    editAvatarBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: '#6366F1',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#F8FAFC',
    },
    userNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    userName: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    statItem: {
        width: '30%',
        paddingVertical: 15,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
    },
    welcomeBanner: {
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
        overflow: 'hidden',
    },
    welcomeTextContent: {
        flex: 1,
        gap: 8,
    },
    welcomeTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    welcomeDesc: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.85)',
        lineHeight: 20,
        fontWeight: '500',
    },
    welcomeImage: {
        width: 70,
        height: 70,
        tintColor: 'rgba(255,255,255,0.5)',
        marginLeft: 10,
    },
    menuSection: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 15,
    },
    menuCard: {
        borderRadius: 24,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 18,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 18,
        borderRadius: 20,
        backgroundColor: '#FEF2F2',
        marginBottom: 20,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#EF4444',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 8,
    },
    input: {
        height: 54,
        borderRadius: 16,
        paddingHorizontal: 16,
        fontSize: 16,
        borderWidth: 1,
    },
    saveBtn: {
        height: 54,
        backgroundColor: '#6366F1',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    saveBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
