// import TcpSocket from 'react-native-tcp-socket';
// import { SERVER_CONFIG, MESSAGE_TYPES } from '../config/constants';
// import type { SocketMessage, MessageType } from '../types';

// type EventCallback = (data: any) => void;

// class SocketService {
//   private socket: any = null;
//   private listeners: Map<MessageType, EventCallback> = new Map();
//   private connected: boolean = false;
//   private reconnectAttempts: number = 0;
//   private reconnectTimer: any = null;
//   private isConnecting: boolean = false;

//   /**
//    * Connect to the socket server
//    */
//   async connect(): Promise<void> {
//     // Prevent multiple simultaneous connection attempts
//     if (this.isConnecting) {
//       console.log('⏳ Connection already in progress...');
//       return;
//     }

//     if (this.connected && this.socket) {
//       console.log('✅ Already connected');
//       return;
//     }

//     return new Promise((resolve, reject) => {
//       try {
//         this.isConnecting = true;
//         console.log(`🔌 Connecting to ${SERVER_CONFIG.host}:${SERVER_CONFIG.port}...`);

//         // Clean up any existing socket
//         if (this.socket) {
//           try {
//             this.socket.destroy();
//           } catch (e) {
//             console.log('Error destroying old socket:', e);
//           }
//           this.socket = null;
//         }

//         // Set connection timeout manually
//         const connectionTimeout = setTimeout(() => {
//           this.isConnecting = false;
//           if (!this.connected) {
//             const error = new Error('Connection timeout after 5 seconds');
//             console.error('❌ Connection timeout');
//             if (this.socket) {
//               try {
//                 this.socket.destroy();
//               } catch (e) {
//                 console.log('Error destroying socket on timeout:', e);
//               }
//               this.socket = null;
//             }
//             reject(error);
//           }
//         }, 5000);

//         // Create socket connection
//         this.socket = TcpSocket.createConnection(
//           {
//             port: SERVER_CONFIG.port,
//             host: SERVER_CONFIG.host,
//           },
//           () => {
//             clearTimeout(connectionTimeout);
//             this.isConnecting = false;
//             console.log('✅ Connected to server!');
//             this.connected = true;
//             this.reconnectAttempts = 0;
//             resolve();
//           }
//         );

//         // Handle incoming data
//         this.socket.on('data', (data: Buffer) => {
//           this.handleIncomingData(data);
//         });

//         // Handle errors
//         this.socket.on('error', (error: Error) => {
//           clearTimeout(connectionTimeout);
//           this.isConnecting = false;
//           console.error('❌ Socket error:', error);
//           this.connected = false;
//           reject(error);
//         });

//         // Handle connection close
//         this.socket.on('close', () => {
//           clearTimeout(connectionTimeout);
//           this.isConnecting = false;
//           console.log('🔌 Connection closed');
//           this.connected = false;
//           this.handleDisconnect();
//         });

//       } catch (error) {
//         this.isConnecting = false;
//         console.error('❌ Connection error:', error);
//         reject(error);
//       }
//     });
//   }

//   /**
//    * Handle incoming data from server
//    */
//   private handleIncomingData(data: Buffer): void {
//     try {
//       const messages = data
//         .toString()
//         .split('\n')
//         .filter(msg => msg.trim());

//       messages.forEach(msg => {
//         try {
//           const parsedMessage: SocketMessage = JSON.parse(msg);
//           console.log('📨 Received:', parsedMessage.type);
//           this.handleMessage(parsedMessage);
//         } catch (error) {
//           console.error('Error parsing message:', error);
//         }
//       });
//     } catch (error) {
//       console.error('Error handling incoming data:', error);
//     }
//   }

//   /**
//    * Route message to appropriate listener
//    */
//   private handleMessage(message: SocketMessage): void {
//     const { type } = message;
//     const callback = this.listeners.get(type as MessageType);
    
//     if (callback) {
//       callback(message);
//     } else {
//       console.warn(`No listener registered for message type: ${type}`);
//     }
//   }

//   /**
//    * Handle disconnection and attempt reconnection
//    */
//   private handleDisconnect(): void {
//     if (this.reconnectAttempts < SERVER_CONFIG.maxReconnectAttempts) {
//       this.reconnectAttempts++;
//       const delay = SERVER_CONFIG.reconnectDelay * this.reconnectAttempts;
      
//       console.log(`🔄 Reconnecting in ${delay}ms... (Attempt ${this.reconnectAttempts}/${SERVER_CONFIG.maxReconnectAttempts})`);
      
//       this.reconnectTimer = setTimeout(() => {
//         this.connect().catch(err => {
//           console.error('Reconnection failed:', err);
//         });
//       }, delay);
//     } else {
//       console.error('❌ Max reconnection attempts reached');
//     }
//   }

//   /**
//    * Send data to server
//    */
//   send(data: SocketMessage): boolean {
//     if (!this.connected || !this.socket) {
//       console.error('❌ Not connected to server');
//       return false;
//     }

//     try {
//       const message = JSON.stringify(data) + '\n';
//       console.log('📤 Sending:', data.type);
//       this.socket.write(message);
//       return true;
//     } catch (error) {
//       console.error('Error sending message:', error);
//       return false;
//     }
//   }

//   /**
//    * Register event listener
//    */
//   on(eventType: MessageType, callback: EventCallback): void {
//     this.listeners.set(eventType, callback);
//   }

//   /**
//    * Remove event listener
//    */
//   off(eventType: MessageType): void {
//     this.listeners.delete(eventType);
//   }

//   /**
//    * Remove all listeners
//    */
//   removeAllListeners(): void {
//     this.listeners.clear();
//   }

//   /**
//    * Disconnect from server
//    */
//   disconnect(): void {
//     if (this.reconnectTimer) {
//       clearTimeout(this.reconnectTimer);
//       this.reconnectTimer = null;
//     }

//     if (this.socket) {
//       this.socket.destroy();
//       this.socket = null;
//       this.connected = false;
//       this.listeners.clear();
//       console.log('🔌 Disconnected from server');
//     }
//   }

//   /**
//    * Check connection status
//    */
//   isConnected(): boolean {
//     return this.connected;
//   }

//   // ============ Message-specific methods ============

//   /**
//    * Register new user
//    */
//   register(username: string, password: string): boolean {
//     return this.send({
//       type: MESSAGE_TYPES.REGISTER,
//       username,
//       password,
//     });
//   }

//   /**
//    * Login user
//    */
//   login(username: string, password: string): boolean {
//     return this.send({
//       type: MESSAGE_TYPES.LOGIN,
//       username,
//       password,
//     });
//   }

//   /**
//    * Send chat message
//    */
//   sendMessage(sender: string, message: string): boolean {
//     return this.send({
//       type: MESSAGE_TYPES.SEND_MESSAGE,
//       sender,
//       message,
//     });
//   }

//   /**
//    * Request message history
//    */
//   getHistory(limit: number = 50): boolean {
//     return this.send({
//       type: MESSAGE_TYPES.GET_HISTORY,
//       limit,
//     });
//   }
// }

// // Export singleton instance
// export default new SocketService();

import TcpSocket from 'react-native-tcp-socket';
import { SERVER_CONFIG, MESSAGE_TYPES } from '../config/constants';
import type { SocketMessage, MessageType } from '../types';

type EventCallback = (data: any) => void;

class SocketService {
  private socket: any = null;
  private listeners: Map<MessageType, EventCallback> = new Map();
  private connected: boolean = false;
  private reconnectAttempts: number = 0;
  private reconnectTimer: any = null;
  private isConnecting: boolean = false;
  private buffer: string = '';

  /**
   * Connect to the socket server
   */
  async connect(): Promise<void> {
    // Prevent multiple simultaneous connection attempts
    if (this.isConnecting) {
      console.log('⏳ Connection already in progress...');
      return;
    }

    if (this.connected && this.socket) {
      console.log('✅ Already connected');
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        this.isConnecting = true;
        console.log(`🔌 Connecting to ${SERVER_CONFIG.host}:${SERVER_CONFIG.port}...`);

        // Clean up any existing socket
        if (this.socket) {
          try {
            this.socket.destroy();
          } catch (e) {
            console.log('Cleaning up old socket');
          }
          this.socket = null;
        }

        // Set connection timeout
        const connectionTimeout = setTimeout(() => {
          this.isConnecting = false;
          if (!this.connected) {
            console.error('❌ Connection timeout');
            const error = new Error('Connection timeout after 5 seconds');
            if (this.socket) {
              try {
                this.socket.destroy();
              } catch (e) {
                console.log('Error destroying socket');
              }
              this.socket = null;
            }
            reject(error);
          }
        }, 5000);

        // Create TCP socket connection - CORRECT METHOD
        this.socket = TcpSocket.createConnection(
          {
            port: SERVER_CONFIG.port,
            host: SERVER_CONFIG.host,
          },
          () => {
            clearTimeout(connectionTimeout);
            this.isConnecting = false;
            console.log('✅ Connected to server!');
            this.connected = true;
            this.reconnectAttempts = 0;
            this.buffer = ''; // Clear buffer on new connection
            resolve();
          }
        );

        // Handle incoming data
        this.socket.on('data', (data: Buffer) => {
          this.handleIncomingData(data);
        });

        // Handle errors
        this.socket.on('error', (error: Error) => {
          clearTimeout(connectionTimeout);
          this.isConnecting = false;
          console.error('❌ Socket error:', error);
          this.connected = false;
          reject(error);
        });

        // Handle connection close
        this.socket.on('close', () => {
          clearTimeout(connectionTimeout);
          this.isConnecting = false;
          console.log('🔌 Connection closed');
          this.connected = false;
          this.handleDisconnect();
        });

      } catch (error) {
        this.isConnecting = false;
        console.error('❌ Connection error:', error);
        reject(error);
      }
    });
  }

  /**
   * Handle incoming data from server
   */
  private handleIncomingData(data: Buffer): void {
    try {
      // Add incoming data to buffer
      this.buffer += data.toString('utf-8');

      // Split by newline to get complete messages
      const messages = this.buffer.split('\n');
      
      // Keep the last incomplete message in buffer
      this.buffer = messages.pop() || '';

      // Process each complete message
      messages.forEach(msg => {
        if (msg.trim()) {
          try {
            const parsedMessage: SocketMessage = JSON.parse(msg);
            console.log('📨 Received:', parsedMessage.type);
            this.handleMessage(parsedMessage);
          } catch (error) {
            console.error('Error parsing message:', msg, error);
          }
        }
      });
    } catch (error) {
      console.error('Error handling incoming data:', error);
    }
  }

  /**
   * Route message to appropriate listener
   */
  private handleMessage(message: SocketMessage): void {
    const { type } = message;
    const callback = this.listeners.get(type as MessageType);
    
    if (callback) {
      callback(message);
    } else {
      console.warn(`No listener registered for message type: ${type}`);
    }
  }

  /**
   * Handle disconnection and attempt reconnection
   */
  private handleDisconnect(): void {
    if (this.reconnectAttempts < SERVER_CONFIG.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = SERVER_CONFIG.reconnectDelay * this.reconnectAttempts;
      
      console.log(`🔄 Reconnecting in ${delay}ms... (Attempt ${this.reconnectAttempts}/${SERVER_CONFIG.maxReconnectAttempts})`);
      
      this.reconnectTimer = setTimeout(() => {
        this.connect().catch(err => {
          console.error('Reconnection failed:', err);
        });
      }, delay);
    } else {
      console.error('❌ Max reconnection attempts reached');
    }
  }

  /**
   * Send data to server
   */
  send(data: SocketMessage): boolean {
    if (!this.connected || !this.socket) {
      console.error('❌ Not connected to server');
      return false;
    }

    try {
      const message = JSON.stringify(data) + '\n';
      console.log('📤 Sending:', data.type);
      this.socket.write(message);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  /**
   * Register event listener
   */
  on(eventType: MessageType, callback: EventCallback): void {
    this.listeners.set(eventType, callback);
  }

  /**
   * Remove event listener
   */
  off(eventType: MessageType): void {
    this.listeners.delete(eventType);
  }

  /**
   * Remove all listeners
   */
  removeAllListeners(): void {
    this.listeners.clear();
  }

  /**
   * Disconnect from server
   */
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.socket) {
      this.socket.destroy();
      this.socket = null;
      this.connected = false;
      this.listeners.clear();
      this.buffer = '';
      console.log('🔌 Disconnected from server');
    }
  }

  /**
   * Check connection status
   */
  isConnected(): boolean {
    return this.connected;
  }

  // ============ Message-specific methods ============

  /**
   * Register new user
   */
  register(username: string, password: string): boolean {
    return this.send({
      type: MESSAGE_TYPES.REGISTER,
      username,
      password,
    });
  }

  /**
   * Login user
   */
  login(username: string, password: string): boolean {
    return this.send({
      type: MESSAGE_TYPES.LOGIN,
      username,
      password,
    });
  }

  /**
   * Send chat message
   */
  sendMessage(sender: string, message: string): boolean {
    return this.send({
      type: MESSAGE_TYPES.SEND_MESSAGE,
      sender,
      message,
    });
  }

  /**
   * Request message history
   */
  getHistory(limit: number = 50): boolean {
    return this.send({
      type: MESSAGE_TYPES.GET_HISTORY,
      limit,
    });
  }
}

// Export singleton instance
export default new SocketService();