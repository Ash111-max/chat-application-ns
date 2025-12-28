// import TcpSocket from 'react-native-tcp-socket';
// import { SERVER_CONFIG, MESSAGE_TYPES } from '../config/constants';
// import type { SocketMessage, MessageType } from '../types';

// type EventCallback = (data: any) => void;

// class SocketService {
//   private socket: any = null;
//   private listeners: Map<MessageType, EventCallback> = new Map();
//   private connected: boolean = false;
//   private reconnectAttempts: number = 0;
//   private reconnectTimer: NodeJS.Timeout | null = null;

//   /**
//    * Connect to the socket server
//    */
//   async connect(): Promise<void> {
//     return new Promise((resolve, reject) => {
//       try {
//         console.log(`🔌 Connecting to ${SERVER_CONFIG.host}:${SERVER_CONFIG.port}...`);

//         this.socket = TcpSocket.createConnection(
//           {
//             port: SERVER_CONFIG.port,
//             host: SERVER_CONFIG.host,
//             timeout: 5000,
//           },
//           () => {
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
//           console.error('❌ Socket error:', error);
//           this.connected = false;
//           reject(error);
//         });

//         // Handle connection close
//         this.socket.on('close', () => {
//           console.log('🔌 Connection closed');
//           this.connected = false;
//           this.handleDisconnect();
//         });

//       } catch (error) {
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
  private reconnectTimer: NodeJS.Timeout | null = null;

  /**
   * Connect to the socket server
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log(`🔌 Connecting to ${SERVER_CONFIG.host}:${SERVER_CONFIG.port}...`);

        // Set connection timeout manually
        const connectionTimeout = setTimeout(() => {
          if (!this.connected) {
            reject(new Error('Connection timeout'));
            if (this.socket) {
              this.socket.destroy();
            }
          }
        }, 5000);

        this.socket = TcpSocket.createConnection(
          {
            port: SERVER_CONFIG.port,
            host: SERVER_CONFIG.host,
          },
          () => {
            clearTimeout(connectionTimeout);
            console.log('✅ Connected to server!');
            this.connected = true;
            this.reconnectAttempts = 0;
            resolve();
          }
        );

        // Handle incoming data
        this.socket.on('data', (data: Buffer) => {
          this.handleIncomingData(data);
        });

        // Handle errors
        this.socket.on('error', (error: Error) => {
          console.error('❌ Socket error:', error);
          this.connected = false;
          reject(error);
        });

        // Handle connection close
        this.socket.on('close', () => {
          console.log('🔌 Connection closed');
          this.connected = false;
          this.handleDisconnect();
        });

      } catch (error) {
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
      const messages = data
        .toString()
        .split('\n')
        .filter(msg => msg.trim());

      messages.forEach(msg => {
        try {
          const parsedMessage: SocketMessage = JSON.parse(msg);
          console.log('📨 Received:', parsedMessage.type);
          this.handleMessage(parsedMessage);
        } catch (error) {
          console.error('Error parsing message:', error);
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