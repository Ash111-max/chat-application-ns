# # import socket
# # import threading
# # import json

# # from auth import register_user, login_user
# # from message_handler import save_message, get_message_history
# # from config import SERVER_HOST, SERVER_PORT

# # server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# # server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
# # server.bind((SERVER_HOST, SERVER_PORT))
# # server.listen()

# # print(f"Server running on {SERVER_HOST}:{SERVER_PORT}")

# # clients = []

# # def broadcast(message, sender_socket):
# #     for client in clients:
# #         if client != sender_socket:
# #             try:
# #                 client.send(json.dumps(message).encode())
# #             except:
# #                 clients.remove(client)


# # def handle_client(client_socket, address):
# #     print(f"New connection from {address}")
# #     clients.append(client_socket)

# #     while True:
# #         try:
# #             data = client_socket.recv(4096).decode()
# #             if not data:
# #                 break

# #             request = json.loads(data)
# #             response = {}

# #             msg_type = request.get("type")

# #             if msg_type == "register":
# #                 response = register_user(
# #                     request["username"],
# #                     request["password"]
# #                 )

# #             elif msg_type == "login":
# #                 result = login_user(
# #                     request["username"],
# #                     request["password"]
# #                 )

# #                 if result["status"] == "success":
# #                     history = get_message_history()

# #                     response = {
# #                         "type": "login_response",
# #                         "status": "success",
# #                         "user_id": result["user_id"],
# #                         "username": result["username"],
# #                         "messages": history
# #                     }
# #                 else:
# #                     response = {
# #                         "type": "login_response",
# #                         "status": "error",
# #                         "message": result["message"]
# #                     }


# #             elif msg_type == "send_message":
# #                 save_message(
# #                     request["sender_id"],
# #                     request["sender"],
# #                     request["message"]
# #                 )

# #                 message_data = {
# #                     "type": "new_message",
# #                     "sender": request["sender"],
# #                     "message": request["message"]
# #                 }

# #                 broadcast(message_data, client_socket)
# #                 response = {"status": "success"}



# #             elif msg_type == "get_history":
# #                 messages = get_message_history()
# #                 response = {
# #                     "status": "success",
# #                     "messages": messages
# #                 }

# #             else:
# #                 response = {
# #                     "status": "error",
# #                     "message": "Unknown request type"
# #                 }

# #             client_socket.send(json.dumps(response).encode())

# #         except Exception as e:
# #             print(f"Error: {e}")
# #             break

# #     print(f"Connection closed: {address}")
# #     if client_socket in clients:
# #         clients.remove(client_socket)
# #     client_socket.close()



# # try:
# #     while True:
# #         client_socket, address = server.accept()
# #         thread = threading.Thread(
# #             target=handle_client,
# #             args=(client_socket, address),
# #             daemon=True
# #         )
# #         thread.start()

# # except KeyboardInterrupt:
# #     print("\nServer shutting down...")

# # finally:
# #     for client in clients:
# #         try:
# #             client.close()
# #         except:
# #             pass

# #     server.close()
# #     print("Server closed cleanly")



# import socket
# import threading
# import json

# from auth import register_user, login_user
# from message_handler import save_message, get_message_history
# from config import SERVER_HOST, SERVER_PORT

# server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
# server.bind((SERVER_HOST, SERVER_PORT))
# server.listen()

# print(f"Server running on {SERVER_HOST}:{SERVER_PORT}")

# clients = []
# clients_lock = threading.Lock()

# def broadcast(message, sender_socket):
#     """Broadcast message to all clients except sender"""
#     message_str = json.dumps(message) + '\n'  # ADD NEWLINE!
#     message_bytes = message_str.encode('utf-8')
    
#     with clients_lock:
#         for client in clients[:]:  # Create copy to avoid modification during iteration
#             if client != sender_socket:
#                 try:
#                     client.send(message_bytes)
#                 except Exception as e:
#                     print(f"Error broadcasting to client: {e}")
#                     try:
#                         clients.remove(client)
#                     except:
#                         pass


# def send_to_client(client_socket, message):
#     """Send message to specific client with newline delimiter"""
#     try:
#         message_str = json.dumps(message) + '\n'  # ADD NEWLINE!
#         client_socket.send(message_str.encode('utf-8'))
#         return True
#     except Exception as e:
#         print(f"Error sending to client: {e}")
#         return False


# def handle_client(client_socket, address):
#     print(f"New connection from {address}")
    
#     with clients_lock:
#         clients.append(client_socket)

#     buffer = ""  # Buffer for incomplete messages

#     try:
#         while True:
#             try:
#                 # Receive data
#                 data = client_socket.recv(4096)
#                 if not data:
#                     print(f"No data received, closing connection: {address}")
#                     break

#                 # Decode and add to buffer
#                 buffer += data.decode('utf-8')

#                 # Process complete messages (split by newline)
#                 while '\n' in buffer:
#                     line, buffer = buffer.split('\n', 1)
#                     line = line.strip()
                    
#                     if not line:
#                         continue

#                     try:
#                         request = json.loads(line)
#                         print(f"Received message type: {request.get('type')} from {address}")
                        
#                         response = {}
#                         msg_type = request.get("type")

#                         if msg_type == "register":
#                             response = register_user(
#                                 request["username"],
#                                 request["password"]
#                             )
#                             send_to_client(client_socket, response)

#                         elif msg_type == "login":
#                             result = login_user(
#                                 request["username"],
#                                 request["password"]
#                             )

#                             if result["status"] == "success":
#                                 history = get_message_history()

#                                 response = {
#                                     "type": "login_response",
#                                     "status": "success",
#                                     "user_id": result["user_id"],
#                                     "username": result["username"],
#                                     "messages": history
#                                 }
#                             else:
#                                 response = {
#                                     "type": "login_response",
#                                     "status": "error",
#                                     "message": result["message"]
#                                 }
                            
#                             send_to_client(client_socket, response)

#                         elif msg_type == "send_message":
#                             save_message(
#                                 request.get("sender_id", 0),  # Use .get() for safety
#                                 request["sender"],
#                                 request["message"]
#                             )

#                             message_data = {
#                                 "type": "new_message",
#                                 "sender": request["sender"],
#                                 "message": request["message"]
#                             }

#                             # Broadcast to others
#                             broadcast(message_data, client_socket)
                            
#                             # Send success response to sender
#                             send_to_client(client_socket, {"status": "success"})

#                         elif msg_type == "get_history":
#                             messages = get_message_history()
#                             response = {
#                                 "type": "history_response",
#                                 "status": "success",
#                                 "messages": messages
#                             }
#                             send_to_client(client_socket, response)

#                         else:
#                             response = {
#                                 "type": "error",
#                                 "status": "error",
#                                 "message": "Unknown request type"
#                             }
#                             send_to_client(client_socket, response)

#                     except json.JSONDecodeError as e:
#                         print(f"JSON decode error: {e}")
#                         error_response = {
#                             "type": "error",
#                             "status": "error",
#                             "message": "Invalid JSON format"
#                         }
#                         send_to_client(client_socket, error_response)

#             except UnicodeDecodeError as e:
#                 print(f"UTF-8 decode error: {e}")
#                 buffer = ""  # Clear buffer on decode error
#                 continue

#     except Exception as e:
#         print(f"Error handling client {address}: {e}")

#     finally:
#         print(f"Connection closed: {address}")
#         with clients_lock:
#             if client_socket in clients:
#                 clients.remove(client_socket)
        
#         try:
#             client_socket.close()
#         except:
#             pass


# # Main server loop
# try:
#     while True:
#         client_socket, address = server.accept()
#         thread = threading.Thread(
#             target=handle_client,
#             args=(client_socket, address),
#             daemon=True
#         )
#         thread.start()

# except KeyboardInterrupt:
#     print("\nServer shutting down...")

# finally:
#     with clients_lock:
#         for client in clients[:]:
#             try:
#                 client.close()
#             except:
#                 pass

#     server.close()
#     print("Server closed cleanly")

import socket
import threading
import json
from datetime import datetime, timezone

from auth import register_user, login_user
from message_handler import save_message, get_message_history
from config import SERVER_HOST, SERVER_PORT

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server.bind((SERVER_HOST, SERVER_PORT))
server.listen()

print(f"🚀 Server running on {SERVER_HOST}:{SERVER_PORT}")

clients = []
clients_lock = threading.Lock()


def send_message(client_socket, message_dict):
    """Send JSON message with newline delimiter"""
    try:
        message = json.dumps(message_dict) + '\n'
        client_socket.send(message.encode('utf-8'))
        return True
    except Exception as e:
        print(f"Error sending message: {e}")
        return False


def broadcast(message_dict, exclude_socket=None):
    """Broadcast message to all connected clients"""
    message = json.dumps(message_dict) + '\n'
    with clients_lock:
        for client in clients[:]:  # Use slice to avoid modification during iteration
            if client != exclude_socket:
                try:
                    client.send(message.encode('utf-8'))
                except Exception as e:
                    print(f"Error broadcasting to client: {e}")
                    if client in clients:
                        clients.remove(client)


def handle_client(client_socket, address):
    print(f"✅ New connection from {address}")
    
    with clients_lock:
        clients.append(client_socket)

    user_id = None
    username = None

    try:
        while True:
            data = client_socket.recv(4096).decode('utf-8')
            if not data:
                break

            # Handle multiple messages separated by newlines
            messages = data.strip().split('\n')
            
            for msg in messages:
                if not msg:
                    continue
                    
                try:
                    request = json.loads(msg)
                    print(f"📨 Received: {request.get('type')} from {address}")
                    
                    msg_type = request.get("type")

                    # REGISTER
                    if msg_type == "register":
                        result = register_user(
                            request["username"],
                            request["password"]
                        )
                        
                        response = {
                            "type": "register_response",
                            "status": result["status"],
                            "message": result["message"]
                        }
                        send_message(client_socket, response)

                    # LOGIN
                    elif msg_type == "login":
                        result = login_user(
                            request["username"],
                            request["password"]
                        )

                        if result["status"] == "success":
                            user_id = result["user_id"]
                            username = result["username"]
                            
                            response = {
                                "type": "login_response",
                                "status": "success",
                                "user_id": user_id,
                                "username": username
                            }
                        else:
                            response = {
                                "type": "login_response",
                                "status": "error",
                                "message": result.get("message", "Login failed")
                            }
                        
                        send_message(client_socket, response)

                    # GET MESSAGE HISTORY
                    elif msg_type == "get_history":
                        limit = request.get("limit", 50)
                        messages = get_message_history(limit)
                        
                        response = {
                            "type": "history_response",
                            "messages": messages
                        }
                        send_message(client_socket, response)

                    # SEND MESSAGE
                    elif msg_type == "send_message":
                        sender = request.get("sender")
                        message_text = request.get("message")
                        
                        # Save to database
                        save_message(user_id, sender, message_text)
                        
                        # Broadcast to all clients (including sender)
                        broadcast_data = {
                            "type": "new_message",
                            "sender": sender,
                            "message": message_text,
                            "timestamp": datetime.utcnow().isoformat()
                        }
                        
                        # Send to all clients
                        broadcast(broadcast_data)
                        # Also send to sender
                        send_message(client_socket, broadcast_data)

                    else:
                        response = {
                            "type": "error",
                            "message": "Unknown request type"
                        }
                        send_message(client_socket, response)

                except json.JSONDecodeError as e:
                    print(f"❌ JSON decode error: {e}")
                    error_response = {
                        "type": "error",
                        "message": "Invalid JSON format"
                    }
                    send_message(client_socket, error_response)
                    
                except Exception as e:
                    print(f"❌ Error handling message: {e}")
                    error_response = {
                        "type": "error",
                        "message": str(e)
                    }
                    send_message(client_socket, error_response)

    except Exception as e:
        print(f"❌ Connection error: {e}")
    
    finally:
        print(f"🔌 Connection closed: {address}")
        with clients_lock:
            if client_socket in clients:
                clients.remove(client_socket)
        try:
            client_socket.close()
        except:
            pass


# Main server loop
try:
    print("⏳ Waiting for connections...")
    while True:
        client_socket, address = server.accept()
        thread = threading.Thread(
            target=handle_client,
            args=(client_socket, address),
            daemon=True
        )
        thread.start()

except KeyboardInterrupt:
    print("\n⚠️  Server shutting down...")

finally:
    with clients_lock:
        for client in clients[:]:
            try:
                client.close()
            except:
                pass
    
    server.close()
    print("✅ Server closed cleanly")