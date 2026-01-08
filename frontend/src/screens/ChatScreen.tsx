// src/screens/ChatScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SocketService from '../services/SocketService';
import { MessageBubble } from '../components/MessageBubble';
import { MessageInput } from '../components/MessageInput';
import { ChatHeader } from '../components/ChatHeader';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { MESSAGE_TYPES, STORAGE_KEYS } from '../config/constants';
import type { RootStackParamList, Message, NewMessageBroadcast, HistoryResponse } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

export const ChatScreen: React.FC<Props> = ({ route, navigation }) => {
  const { username, userId } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    setupMessageListeners();
    loadMessageHistory();

    return () => {
      SocketService.off(MESSAGE_TYPES.NEW_MESSAGE as any);
      SocketService.off(MESSAGE_TYPES.HISTORY_RESPONSE as any);
    };
  }, []);

  const setupMessageListeners = () => {
    SocketService.on(MESSAGE_TYPES.NEW_MESSAGE as any, (data: NewMessageBroadcast) => {
      const newMessage: Message = {
        id: Date.now().toString() + Math.random(),
        sender: data.sender,
        message: data.message,
        timestamp: data.timestamp || new Date().toISOString(),
        isOwnMessage: data.sender === username,
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    SocketService.on(MESSAGE_TYPES.HISTORY_RESPONSE as any, (data: HistoryResponse) => {
      if (data.messages && Array.isArray(data.messages)) {
        const formattedMessages: Message[] = data.messages.map((msg, index) => ({
          id: index.toString(),
          sender: msg.sender || msg.sender_username || 'Unknown',
          message: msg.message || msg.message_text || '',
          timestamp: msg.timestamp,
          isOwnMessage: (msg.sender || msg.sender_username) === username,
        }));

        setMessages(formattedMessages);
        setLoading(false);

        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }, 100);
      } else {
        setLoading(false);
      }
    });
  };

  const loadMessageHistory = () => {
    SocketService.getHistory(1000);

    setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 5000);
  };

  const handleSendMessage = (messageText: string) => {
    if (!messageText.trim()) return;

    const success = SocketService.sendMessage(username, messageText);

    if (!success) {
      Alert.alert('Error', 'Could not send message. Please check connection.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            SocketService.disconnect();
            await AsyncStorage.multiRemove([STORAGE_KEYS.USERNAME, STORAGE_KEYS.USER_ID]);
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble
      message={item.message}
      sender={item.sender}
      timestamp={item.timestamp}
      isOwnMessage={item.isOwnMessage}
    />
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>💬</Text>
      <Text style={styles.emptyText}>No messages yet</Text>
      <Text style={styles.emptySubtext}>Start the conversation!</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <ChatHeader onLogout={handleLogout} />

      <View style={styles.chatContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          ListEmptyComponent={renderEmptyComponent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <MessageInput onSend={handleSendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messageList: {
    paddingVertical: spacing.sm,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 18,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
  },
});