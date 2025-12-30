// src/config/constants.ts

// ============================================
// CONFIGURATION MODE - CHOOSE ONE
// ============================================

// Set this to switch between modes easily
const USE_LOCAL = true; // true = Local IP, false = Tunnel

// ============================================
// LOCAL NETWORK CONFIGURATION
// ============================================
// When both devices are on SAME WiFi network
// 1. Run: ipconfig (Windows) or ifconfig (Mac/Linux)
// 2. Find your IPv4 Address (e.g., 192.168.1.105)
// 3. Replace below:
const LOCAL_CONFIG = {
  host: '192.168.x.x', // REPLACE WITH YOUR COMPUTER'S IP
  port: 5555,
  useHttps: false,
};

// ============================================
// TUNNEL CONFIGURATION
// ============================================
// When using: npx expo start --tunnel
// 1. Wait for tunnel to start (30-60 seconds)
// 2. Look for line: "Tunnel ready."
// 3. Copy ONLY the domain from the URL
// Example: exp://abc-123-xyz.tunnelapp.dev:443
// Use only: abc-123-xyz.tunnelapp.dev
const TUNNEL_CONFIG = {
  host: 'xnjyebo-anonymous-8081.exp.direct', // UPDATE THIS
  port: 5555,
  useHttps: true, // MUST be true for tunnel
};

// ============================================
// ACTIVE CONFIGURATION (Don't modify below)
// ============================================
export const SERVER_CONFIG = USE_LOCAL ? LOCAL_CONFIG : TUNNEL_CONFIG;

// Helper function to build full URL
export const getServerUrl = (): string => {
  const protocol = SERVER_CONFIG.useHttps ? 'https' : 'http';
  return `${protocol}://${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`;
};

// Log current configuration (helps with debugging)
console.log('🔧 Server Configuration:', {
  mode: USE_LOCAL ? 'LOCAL' : 'TUNNEL',
  url: getServerUrl(),
});

// ============================================
// APP CONFIGURATION
// ============================================
export const APP_CONFIG = {
  appName: 'ChatApp',
  maxMessageLength: 500,
  messageHistoryLimit: 50,
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
    maxLength: 500,
  },
};