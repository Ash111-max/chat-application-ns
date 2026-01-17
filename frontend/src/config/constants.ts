// src/config/constants.ts

import Constants from 'expo-constants';

// ============================================
// SERVER CONFIGURATION (from .env)
// ============================================

// Fallback defaults (only used if .env is missing)
const fallbackConfig = {
  host: 'localhost',
  port: 5555,
  useHttps: false,
};

// Get values from .env via app.json extra
const env = Constants.expoConfig?.extra || {};

export const SERVER_CONFIG = {
  host: (env.SERVER_HOST as string) || fallbackConfig.host,
  port: Number(env.SERVER_PORT as string) || fallbackConfig.port,
  useHttps: (env.SERVER_USE_HTTPS as string) === 'true' || fallbackConfig.useHttps,
};

// Helper to build full URL
export const getServerUrl = (): string => {
  const protocol = SERVER_CONFIG.useHttps ? 'https' : 'http';
  return `${protocol}://${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`;
};

// Debug log (very helpful during development)
console.log('🔧 Server URL:', getServerUrl());

// ============================================
// APP CONFIGURATION
// ============================================
export const APP_CONFIG = {
  appName: 'ChatApp',
  maxMessageLength: 5000,
  messageHistoryLimit: 1000,
  typingIndicatorTimeout: 3000,
};

// ============================================
// MESSAGE TYPES
// ============================================
export const MESSAGE_TYPES = {
  REGISTER: 'register',
  REGISTER_RESPONSE: 'register_response',
  LOGIN: 'login',
  LOGIN_RESPONSE: 'login_response',
  SEND_MESSAGE: 'send_message',
  NEW_MESSAGE: 'new_message',
  GET_HISTORY: 'get_history',
  HISTORY_RESPONSE: 'history_response',
  ERROR: 'error',
} as const;

// ============================================
// STORAGE KEYS
// ============================================
export const STORAGE_KEYS = {
  USERNAME: '@chat_username',
  USER_ID: '@chat_user_id',
  AUTH_TOKEN: '@chat_auth_token',
};

// ============================================
// VALIDATION RULES
// ============================================
export const VALIDATION = {
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
  },
  password: {
    minLength: 6,
    maxLength: 50,
  },
  message: {
    maxLength: 5000,
  },
};