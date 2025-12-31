// src/screens/LoginScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SocketService from '../services/SocketService';
import { colors } from '../theme/colors';
import { spacing, fontSize, borderRadius } from '../theme/spacing';
import { MESSAGE_TYPES, STORAGE_KEYS, VALIDATION } from '../config/constants';
import type { RootStackParamList, LoginResponse } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    checkLoginStatus();

    return () => {
      SocketService.off(MESSAGE_TYPES.LOGIN_RESPONSE as any);
    };
  }, []);

  const checkLoginStatus = async () => {
    try {
      const savedUsername = await AsyncStorage.getItem(STORAGE_KEYS.USERNAME);
      if (savedUsername) {
        setUsername(savedUsername);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  const validateInputs = (): boolean => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter your username');
      return false;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return false;
    }

    if (username.length < VALIDATION.username.minLength) {
      Alert.alert('Error', `Username must be at least ${VALIDATION.username.minLength} characters`);
      return false;
    }

    return true;
  };

  const connectToServer = async (): Promise<boolean> => {
    setConnecting(true);
    try {
      console.log('🔌 Attempting to connect to server...');
      await SocketService.connect();
      console.log('✅ Connected successfully!');
      return true;
    } catch (error) {
      console.error('❌ Connection failed:', error);
      Alert.alert(
        'Connection Error',
        'Could not connect to server. Please check:\n\n' +
          '• Backend server is running\n' +
          '• IP address is correct in constants.ts\n' +
          '• Both devices on same WiFi (or using tunnel)',
        [{ text: 'OK' }]
      );
      return false;
    } finally {
      setConnecting(false);
    }
  };

  const handleLogin = async () => {
    console.log('📝 Login button pressed');
    
    if (!validateInputs()) {
      return;
    }

    setLoading(true);

    try {
      // Connect if not already connected
      if (!SocketService.isConnected()) {
        console.log('🔄 Not connected, connecting now...');
        const connected = await connectToServer();
        if (!connected) {
          setLoading(false);
          return;
        }
      }

      // Set up listener for login response
      SocketService.on(MESSAGE_TYPES.LOGIN_RESPONSE as any, async (response: LoginResponse) => {
        console.log('📨 Login response received:', response);
        setLoading(false);

        if (response.status === 'success') {
          console.log('✅ Login successful!');
          await AsyncStorage.setItem(STORAGE_KEYS.USERNAME, username.trim());
          if (response.user_id) {
            await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, response.user_id.toString());
          }

          navigation.replace('Chat', {
            username: username.trim(),
            userId: response.user_id || 0,
          });
        } else {
          console.log('❌ Login failed:', response.message);
          Alert.alert('Login Failed', response.message || 'Invalid credentials');
        }
      });

      // Send login request
      console.log('📤 Sending login request...');
      const sent = SocketService.login(username.trim(), password);
      if (!sent) {
        setLoading(false);
        Alert.alert('Error', 'Failed to send login request');
      }
    } catch (error) {
      setLoading(false);
      console.error('❌ Login error:', error);
      Alert.alert('Error', 'An error occurred during login');
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>💬</Text>
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue chatting</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={colors.placeholder}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading && !connecting}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Password"
                placeholderTextColor={colors.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading && !connecting}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Text style={styles.eyeEmoji}>{showPassword ? '👁️' : '🙈'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, (loading || connecting) && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading || connecting}
              activeOpacity={0.8}
            >
              {loading || connecting ? (
                <ActivityIndicator color={colors.textWhite} />
              ) : (
                <Text style={styles.buttonText}>
                  {connecting ? 'Connecting...' : 'Login'}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.linkContainer}>
              <Text style={styles.linkLabel}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                disabled={loading || connecting}
              >
                <Text style={styles.linkText}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Make sure the backend server is running
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  logoEmoji: {
    fontSize: 50,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  passwordInput: {
    paddingRight: spacing.xl,
  },
  eyeIcon: {
    position: 'absolute',
    right: spacing.md,
    padding: spacing.xs,
  },
  eyeEmoji: {
    fontSize: 20,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    minHeight: 50,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.textWhite,
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  linkLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  linkText: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    textAlign: 'center',
  },
});