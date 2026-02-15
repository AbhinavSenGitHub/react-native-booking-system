import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { login } from '@/store/slices/authSlice';
import { useAppDispatch } from '@/store/hooks';
import { router } from 'expo-router';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        setLoading(true);
        try {
            const resultAction = await dispatch(login({ email, password }));
            if (login.fulfilled.match(resultAction)) {
                router.replace('/(tabs)' as any);
            } else {
                Alert.alert('Login Failed', (resultAction.payload as string) || 'Invalid credentials');
            }
        } catch (error: any) {
            Alert.alert('Login Failed', 'Something went wrong');
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
            >
                {/* Header Section with Medical Accent */}
                <View style={styles.headerContainer}>
                    <View style={styles.iconWrapper}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="medical" size={40} color="#0066CC" />
                        </View>
                    </View>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to access your healthcare portal</Text>
                </View>

                {/* Form Section */}
                <View style={styles.formContainer}>
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
                                placeholder="Enter your password"
                                placeholderTextColor="#A0A0A0"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Text>
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>or</Text>
                        <View style={styles.divider} />
                    </View>

                    {/* Sign Up Link */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/register' as any)}>
                            <Text style={styles.link}>Create Account</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Security Badge */}
                <View style={styles.securityBadge}>
                    <Ionicons name="shield-checkmark" size={18} color="#0066CC" style={styles.securityIcon} />
                    <Text style={styles.securityText}>Your data is secure and encrypted</Text>
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
        paddingTop: 60,
        paddingBottom: 40,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconWrapper: {
        marginBottom: 24,
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
        marginBottom: 20,
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
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
        marginTop: -8,
    },
    forgotPasswordText: {
        color: '#0066CC',
        fontSize: 14,
        fontWeight: '600',
    },
    button: {
        backgroundColor: '#0066CC',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
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
        marginTop: 32,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#F0F9FF',
        borderRadius: 12,
        alignSelf: 'center',
    },
    securityIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    securityText: {
        color: '#0066CC',
        fontSize: 13,
        fontWeight: '600',
    },
});