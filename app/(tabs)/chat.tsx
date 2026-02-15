import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, useColorScheme, FlatList, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '@/api/client';
import { useAppSelector } from '@/store/hooks';

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp?: string;
}

export default function ChatScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const { user } = useAppSelector(state => state.auth);

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingHistory, setFetchingHistory] = useState(true);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        fetchChatHistory();
    }, []);

    const fetchChatHistory = async () => {
        try {
            const { data } = await apiClient.get('/chat');
            setMessages(data.messages || []);
        } catch (error) {
            console.error('Failed to fetch chat history', error);
        } finally {
            setFetchingHistory(false);
        }
    };

    const handleSendMessage = async () => {
        if (!inputText.trim() || loading) return;

        const userMessage = inputText.trim();
        setInputText('');

        // Optimistically add user message
        const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);
        setLoading(true);

        try {
            const { data } = await apiClient.post('/chat/send', { message: userMessage });
            setMessages(data.messages);
        } catch (error) {
            console.error('Failed to send message', error);
            // Optionally remove optimistic message or show error
        } finally {
            setLoading(false);
        }
    };

    const clearChat = async () => {
        try {
            await apiClient.delete('/chat/clear');
            setMessages([]);
        } catch (error) {
            console.error('Failed to clear chat', error);
        }
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isUser = item.role === 'user';
        if (item.role === 'system') return null;

        return (
            <View style={[
                styles.messageContainer,
                isUser ? styles.userMessageContainer : styles.assistantMessageContainer
            ]}>
                {!isUser && (
                    <Image
                        source={{ uri: 'https://avatar.iran.liara.run/public/job/doctor/8' }}
                        style={styles.aiAvatar}
                    />
                )}
                <View style={[
                    styles.messageBubble,
                    isUser ? styles.userBubble : styles.assistantBubble,
                    { backgroundColor: isUser ? '#6366F1' : (isDark ? '#1F2937' : '#F3F4F6') }
                ]}>
                    <Text style={[
                        styles.messageText,
                        { color: isUser ? '#FFFFFF' : (isDark ? '#F9FAFB' : '#111827') }
                    ]}>
                        {item.content}
                    </Text>
                </View>
            </View>
        );
    };

    if (fetchingHistory) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: isDark ? '#111827' : '#FFFFFF' }]}>
                <ActivityIndicator size="large" color="#6366F1" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: isDark ? '#111827' : '#FFFFFF' }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <View style={styles.header}>
                <View style={styles.headerInfo}>
                    <Image
                        source={require('@/assets/images/doctor-ai.png')}
                        style={styles.headerAvatar}
                    />
                    <View>
                        <Text style={[styles.headerTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>AI Health Assistant</Text>
                        <View style={styles.onlineStatus}>
                            <View style={styles.onlineDot} />
                            <Text style={styles.onlineText}>Always Online</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity onPress={clearChat}>
                    <Ionicons name="trash-outline" size={24} color="#EF4444" />
                </TouchableOpacity>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderMessage}
                contentContainerStyle={styles.listContent}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="chatbubbles-outline" size={80} color="#6366F1" />
                        <Text style={[styles.emptyTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>How can I help you?</Text>
                        <Text style={styles.emptySubtitle}>Ask anything about your health or how to use the app.</Text>
                    </View>
                }
            />

            {loading && (
                <View style={styles.typingContainer}>
                    <Text style={styles.typingText}>AI is typing...</Text>
                </View>
            )}

            <View style={[styles.inputContainer, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
                <TextInput
                    style={[styles.input, { color: isDark ? '#F9FAFB' : '#111827' }]}
                    placeholder="Type your message..."
                    placeholderTextColor="#9CA3AF"
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                />
                <TouchableOpacity
                    style={[styles.sendButton, { opacity: inputText.trim() ? 1 : 0.5 }]}
                    onPress={handleSendMessage}
                    disabled={!inputText.trim() || loading}
                >
                    <Ionicons name="send" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    headerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerAvatar: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#F3F4F6',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
    },
    onlineStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    onlineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
    },
    onlineText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: 15,
        paddingTop: 20,
        paddingBottom: 20,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        maxWidth: '85%',
    },
    userMessageContainer: {
        alignSelf: 'flex-end',
    },
    assistantMessageContainer: {
        alignSelf: 'flex-start',
        gap: 8,
    },
    aiAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignSelf: 'flex-end',
    },
    messageBubble: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
    },
    userBubble: {
        borderBottomRightRadius: 4,
    },
    assistantBubble: {
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        gap: 10,
    },
    input: {
        flex: 1,
        minHeight: 45,
        maxHeight: 100,
        borderRadius: 22.5,
        paddingHorizontal: 18,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: 'rgba(0,0,0,0.03)',
    },
    sendButton: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#6366F1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    typingContainer: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    typingText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontStyle: 'italic',
    },
    emptyContainer: {
        paddingTop: 80,
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '800',
        marginTop: 20,
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
    },
});
