// Application configuration constants

// Server Configuration
// IMPORTANT: Replace with your backend server's IP address
// Both devices must be on the same WiFi network
export const SERVER_CONFIG = {
  host: '192.168.1.5', // REPLACE WITH YOUR BACKEND IP
  port: 5555,
  reconnectDelay: 2000,
  maxReconnectAttempts: 5,
};

// App Configuration
export const APP_CONFIG = {
  appName: 'ChatApp',
  maxMessageLength: 500,
  messageHistoryLimit: 50,
  typingIndicatorTimeout: 3000,
};

// Message Types
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

// Storage Keys
export const STORAGE_KEYS = {
  USERNAME: '@chat_username',
  USER_ID: '@chat_user_id',
  AUTH_TOKEN: '@chat_auth_token',
};

// Validation Rules
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
    maxLength: 500,
  },
};