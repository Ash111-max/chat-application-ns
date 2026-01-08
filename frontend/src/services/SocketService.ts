// frontend/src/services/SocketService.ts
import io, { Socket } from 'socket.io-client';
import { getServerUrl, MESSAGE_TYPES } from '../config/constants';
import type { SocketMessage, MessageType } from '../types';

type EventCallback = (data: any) => void;

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<MessageType, EventCallback> = new Map();
  private connected: boolean = false;

  /**
   * Connect to the Socket.io server
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const serverUrl = getServerUrl();
        console.log(`🔌 Connecting to ${serverUrl}...`);

        // Disconnect existing connection if any
        if (this.socket) {
          this.socket.disconnect();
          this.socket = null;
        }

        // Create new socket connection with mobile-optimized settings
        this.socket = io(serverUrl, {
          // CRITICAL: Try polling first (more reliable for mobile)
          transports: ['polling', 'websocket'],
          
          // Reconnection settings
          reconnection: true,
          reconnectionDelay: 2000,
          reconnectionAttempts: 5,
          
          // Timeout settings (longer for mobile/tunnel)
          timeout: 20000,
          
          // Force new connection
          forceNew: true,
          
          // Path for Socket.io (must match server)
          path: '/socket.io/',
          
          // Additional options for stability
          autoConnect: true,
          upgrade: true,
          rememberUpgrade: true,
        });

        // Connection successful
        this.socket.on('connect', () => {
          console.log('✅ Connected to server!');
          console.log('Socket ID:', this.socket?.id);
          console.log('Transport:', this.socket?.io.engine.transport.name);
          this.connected = true;
          
          // Set up all event listeners
          this.setupListeners();
          
          resolve();
        });

        // Connection error
        this.socket.on('connect_error', (error) => {
          console.error('❌ Connection error:', error.message);
          console.error('Full error:', error);
          this.connected = false;
          reject(error);
        });

        // Disconnection
        this.socket.on('disconnect', (reason) => {
          console.log('🔌 Disconnected:', reason);
          this.connected = false;
        });

        // Reconnection
        this.socket.on('reconnect', (attemptNumber) => {
          console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
          this.connected = true;
          this.setupListeners();
        });

        // Reconnection attempts
        this.socket.io.on('reconnect_attempt', (attemptNumber) => {
          console.log(`🔄 Reconnection attempt #${attemptNumber}`);
        });

        // Reconnection error
        this.socket.io.on('reconnect_error', (error) => {
          console.error('❌ Reconnection error:', error.message);
        });

        // Reconnection failed
        this.socket.io.on('reconnect_failed', () => {
          console.error('❌ Reconnection failed after all attempts');
        });

      } catch (error) {
        console.error('❌ Connection setup error:', error);
        reject(error);
      }
    });
  }

  /**
   * Set up all event listeners
   */
  private setupListeners(): void {
    if (!this.socket) return;

    console.log('🔧 Setting up event listeners...');

    // Register response
    this.socket.on('register_response', (data) => {
      console.log('📨 Received: register_response', data);
      this.handleMessage({ ...data, type: 'register_response' });
    });

    // Login response
    this.socket.on('login_response', (data) => {
      console.log('📨 Received: login_response', data);
      this.handleMessage({ ...data, type: 'login_response' });
    });

    // New message
    this.socket.on('new_message', (data) => {
      console.log('📨 Received: new_message', data);
      this.handleMessage({ ...data, type: 'new_message' });
    });

    // Message history
    this.socket.on('history_response', (data) => {
      console.log('📨 Received: history_response', data);
      this.handleMessage({ ...data, type: 'history_response' });
    });

    // Error
    this.socket.on('error', (data) => {
      console.log('📨 Received: error', data);
      this.handleMessage({ ...data, type: 'error' });
    });

    console.log('✅ Event listeners set up successfully');
  }

  /**
   * Route message to appropriate listener
   */
  private handleMessage(message: SocketMessage): void {
    const { type } = message;
    const callback = this.listeners.get(type as MessageType);
    
    if (callback) {
      console.log(`🎯 Routing message to listener: ${type}`);
      callback(message);
    } else {
      console.warn(`⚠️ No listener registered for message type: ${type}`);
    }
  }

  /**
   * Send event to server
   */
  private emit(eventName: string, data: any): boolean {
    if (!this.connected || !this.socket) {
      console.error('❌ Not connected to server');
      return false;
    }

    try {
      console.log('📤 Sending:', eventName, data);
      this.socket.emit(eventName, data);
      return true;
    } catch (error) {
      console.error('❌ Error sending message:', error);
      return false;
    }
  }

  /**
   * Register event listener
   */
  on(eventType: MessageType, callback: EventCallback): void {
    console.log(`📝 Registering listener for: ${eventType}`);
    this.listeners.set(eventType, callback);
  }

  /**
   * Remove event listener
   */
  off(eventType: MessageType): void {
    console.log(`🗑️ Removing listener for: ${eventType}`);
    this.listeners.delete(eventType);
  }

  /**
   * Remove all listeners
   */
  removeAllListeners(): void {
    console.log('🗑️ Removing all listeners');
    this.listeners.clear();
  }

  /**
   * Disconnect from server
   */
  disconnect(): void {
    if (this.socket) {
      console.log('🔌 Disconnecting from server...');
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.listeners.clear();
      console.log('✅ Disconnected successfully');
    }
  }

  /**
   * Check connection status
   */
  isConnected(): boolean {
    return this.connected && this.socket !== null;
  }

  // ============ Message-specific methods ============

  /**
   * Register new user
   */
  register(username: string, password: string): boolean {
    console.log('📝 Registering user:', username);
    return this.emit('register', {
      username,
      password,
    });
  }

  /**
   * Login user
   */
  login(username: string, password: string): boolean {
    console.log('🔐 Logging in user:', username);
    return this.emit('login', {
      username,
      password,
    });
  }

  /**
   * Send chat message
   */
  sendMessage(sender: string, message: string): boolean {
    console.log('💬 Sending message from:', sender);
    return this.emit('send_message', {
      sender,
      message,
    });
  }

  /**
   * Request message history
   */
  getHistory(limit: number = 1000): boolean {
    console.log('📜 Requesting message history, limit:', limit);
    return this.emit('get_history', {
      limit,
    });
  }
}

// Export singleton instance
export default new SocketService();