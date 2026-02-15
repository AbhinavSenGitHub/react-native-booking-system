import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Modal, FlatList } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { register } from '@/store/slices/authSlice';
import { useAppDispatch } from '@/store/hooks';
import { router } from 'expo-router';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'Patient' | 'Doctor'>('Patient');
    const [specialization, setSpecialization] = useState('');
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [isSpecModalVisible, setIsSpecModalVisible] = useState(false);

    const CATEGORIES = ['Heart', 'Dental', 'General', 'Skin', 'Child'];

    const handleRegister = async () => {
        if (!name || !email || !password || (role === 'Doctor' && !specialization)) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        setLoading(true);
        try {
            const resultAction = await dispatch(register({ name, email, password, role, specialization }));
            if (register.fulfilled.match(resultAction)) {
                router.replace('/(tabs)' as any);
            } else {
                Alert.alert('Registration Failed', (resultAction.payload as string) || 'Something went wrong');
            }
        } catch (error: any) {
            Alert.alert('Registration Failed', 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header Section with Medical Accent */}
                <View style={styles.headerContainer}>
                    <View style={styles.iconWrapper}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="medical" size={40} color="#0066CC" />
                        </View>
                    </View>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join our healthcare community</Text>
                </View>

                {/* Form Section */}
                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <View style={styles.inputWrapper}>
                            <View style={styles.inputIcon}>
                                <Ionicons name="person-outline" size={20} color="#6B7280" />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="John Doe"
                                placeholderTextColor="#A0A0A0"
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <View style={styles.inputWrapper}>
                            <View style={styles.inputIcon}>
                                <Ionicons name="mail-outline" size={20} color="#6B7280" />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="yourname@example.com"
                                placeholderTextColor="#A0A0A0"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputWrapper}>
                            <View style={styles.inputIcon}>
                                <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Create a strong password"
                                placeholderTextColor="#A0A0A0"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>I am a...</Text>
                        <View style={styles.roleContainer}>
                            <TouchableOpacity
                                style={[styles.roleButton, role === 'Patient' && styles.roleButtonActive]}
                                onPress={() => setRole('Patient')}
                                activeOpacity={0.7}
                            >
                                <MaterialCommunityIcons
                                    name="account-outline"
                                    size={24}
                                    color={role === 'Patient' ? '#FFFFFF' : '#6B7280'}
                                    style={styles.roleIcon}
                                />
                                <Text style={[styles.roleButtonText, role === 'Patient' && styles.roleButtonTextActive]}>
                                    Patient
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.roleButton, role === 'Doctor' && styles.roleButtonActive]}
                                onPress={() => setRole('Doctor')}
                                activeOpacity={0.7}
                            >
                                <MaterialCommunityIcons
                                    name="doctor"
                                    size={24}
                                    color={role === 'Doctor' ? '#FFFFFF' : '#6B7280'}
                                    style={styles.roleIcon}
                                />
                                <Text style={[styles.roleButtonText, role === 'Doctor' && styles.roleButtonTextActive]}>
                                    Doctor
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {role === 'Doctor' && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Specialization</Text>
                            <TouchableOpacity
                                style={styles.inputWrapper}
                                onPress={() => setIsSpecModalVisible(true)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.inputIcon}>💼</Text>
                                <View style={styles.dropdownContent}>
                                    <Text style={[
                                        styles.dropdownText,
                                        !specialization && { color: '#A0A0A0' }
                                    ]}>
                                        {specialization || 'Select Specialization'}
                                    </Text>
                                    <Text style={styles.dropdownArrow}>▼</Text>
                                </View>
                            </TouchableOpacity>

                            {/* Specialization Selection Modal */}
                            <Modal
                                visible={isSpecModalVisible}
                                transparent={true}
                                animationType="fade"
                                onRequestClose={() => setIsSpecModalVisible(false)}
                            >
                                <TouchableOpacity
                                    style={styles.modalOverlay}
                                    activeOpacity={1}
                                    onPress={() => setIsSpecModalVisible(false)}
                                >
                                    <View style={styles.modalContent}>
                                        <View style={styles.modalHeader}>
                                            <Text style={styles.modalTitle}>Specialization</Text>
                                            <TouchableOpacity onPress={() => setIsSpecModalVisible(false)}>
                                                <Text style={styles.closeText}>Close</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <FlatList
                                            data={CATEGORIES}
                                            keyExtractor={(item) => item}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity
                                                    style={[
                                                        styles.specItem,
                                                        specialization === item && styles.specItemActive
                                                    ]}
                                                    onPress={() => {
                                                        setSpecialization(item);
                                                        setIsSpecModalVisible(false);
                                                    }}
                                                >
                                                    <Text style={[
                                                        styles.specItemText,
                                                        specialization === item && styles.specItemTextActive
                                                    ]}>
                                                        {item}
                                                    </Text>
                                                    {specialization === item && (
                                                        <Text style={styles.checkIcon}>✓</Text>
                                                    )}
                                                </TouchableOpacity>
                                            )}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </Modal>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </Text>
                    </TouchableOpacity>

                    {/* Terms & Privacy */}
                    <Text style={styles.termsText}>
                        By signing up, you agree to our{' '}
                        <Text style={styles.termsLink}>Terms of Service</Text>
                        {' '}and{' '}
                        <Text style={styles.termsLink}>Privacy Policy</Text>
                    </Text>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>or</Text>
                        <View style={styles.divider} />
                    </View>

                    {/* Sign In Link */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/login' as any)}>
                            <Text style={styles.link}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Security Badge */}
                <View style={styles.securityBadge}>
                    <Text style={styles.securityIcon}>✓</Text>
                    <Text style={styles.securityText}>HIPAA Compliant & Secure</Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 50,
        paddingBottom: 40,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    iconWrapper: {
        marginBottom: 20,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0066CC',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    iconText: {
        fontSize: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1A2B3C',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
    },
    formContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 3,
    },
    inputGroup: {
        marginBottom: 18,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
        letterSpacing: 0.3,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        paddingHorizontal: 16,
    },
    inputIcon: {
        fontSize: 18,
        marginRight: 12,
    },
    input: {
        flex: 1,
        padding: 16,
        fontSize: 16,
        color: '#1F2937',
    },
    roleContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    roleButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
    },
    roleButtonActive: {
        backgroundColor: '#0066CC',
        borderColor: '#0066CC',
        shadowColor: '#0066CC',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    roleIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    roleButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
    roleButtonTextActive: {
        color: '#FFFFFF',
    },
    button: {
        backgroundColor: '#0066CC',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#0066CC',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    termsText: {
        textAlign: 'center',
        color: '#6B7280',
        fontSize: 12,
        marginTop: 16,
        lineHeight: 18,
    },
    termsLink: {
        color: '#0066CC',
        fontWeight: '600',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#9CA3AF',
        fontSize: 14,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: '#6B7280',
        fontSize: 15,
    },
    link: {
        color: '#0066CC',
        fontSize: 15,
        fontWeight: '700',
    },
    securityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 28,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#F0F9FF',
        borderRadius: 12,
        alignSelf: 'center',
    },
    securityIcon: {
        fontSize: 16,
        marginRight: 8,
        color: '#0066CC',
        fontWeight: 'bold',
    },
    securityText: {
        color: '#0066CC',
        fontSize: 13,
        fontWeight: '600',
    },
    dropdownContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
    },
    dropdownText: {
        fontSize: 16,
        color: '#1F2937',
    },
    dropdownArrow: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        maxHeight: '60%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    closeText: {
        color: '#0066CC',
        fontWeight: '600',
    },
    specItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F9FAFB',
    },
    specItemActive: {
        backgroundColor: '#F0F9FF',
    },
    specItemText: {
        fontSize: 16,
        color: '#374151',
    },
    specItemTextActive: {
        color: '#0066CC',
        fontWeight: '700',
    },
    checkIcon: {
        color: '#0066CC',
        fontSize: 18,
        fontWeight: 'bold',
    },
});