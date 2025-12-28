// Type definitions for the application

export interface User {
  id: number;
  username: string;
}

export interface Message {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  isOwnMessage: boolean;
}

export interface SocketMessage {
  type: MessageType;
  [key: string]: any;
}

export type MessageType =
  | 'register'
  | 'register_response'
  | 'login'
  | 'login_response'
  | 'send_message'
  | 'new_message'
  | 'get_history'
  | 'history_response'
  | 'error';

export interface RegisterRequest {
  type: 'register';
  username: string;
  password: string;
}

export interface RegisterResponse {
  type: 'register_response';
  status: 'success' | 'error';
  message: string;
}

export interface LoginRequest {
  type: 'login';
  username: string;
  password: string;
}

export interface LoginResponse {
  type: 'login_response';
  status: 'success' | 'error';
  user_id?: number;
  username?: string;
  message?: string;
}

export interface SendMessageRequest {
  type: 'send_message';
  sender: string;
  message: string;
}

export interface NewMessageBroadcast {
  type: 'new_message';
  sender: string;
  message: string;
  timestamp: string;
}

export interface GetHistoryRequest {
  type: 'get_history';
  limit: number;
}

export interface HistoryResponse {
  type: 'history_response';
  messages: Array<{
    sender: string;
    sender_username?: string;
    message: string;
    message_text?: string;
    timestamp: string;
  }>;
}

export interface ErrorResponse {
  type: 'error';
  message: string;
}

// Navigation types
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Chat: {
    username: string;
    userId: number;
  };
};