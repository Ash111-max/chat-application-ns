import socket
import threading
import json

from auth import register_user, login_user
from message_handler import save_message, get_message_history
from config import SERVER_HOST, SERVER_PORT

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server.bind((SERVER_HOST, SERVER_PORT))
server.listen()

print(f"Server running on {SERVER_HOST}:{SERVER_PORT}")

clients = []

def broadcast(message, sender_socket):
    for client in clients:
        if client != sender_socket:
            try:
                client.send(json.dumps(message).encode())
            except:
                clients.remove(client)


def handle_client(client_socket, address):
    print(f"New connection from {address}")
    clients.append(client_socket)

    while True:
        try:
            data = client_socket.recv(4096).decode()
            if not data:
                break

            request = json.loads(data)
            response = {}

            msg_type = request.get("type")

            if msg_type == "register":
                response = register_user(
                    request["username"],
                    request["password"]
                )

            elif msg_type == "login":
                result = login_user(
                    request["username"],
                    request["password"]
                )

                if result["status"] == "success":
                    history = get_message_history()

                    response = {
                        "type": "login_response",
                        "status": "success",
                        "user_id": result["user_id"],
                        "username": result["username"],
                        "messages": history
                    }
                else:
                    response = {
                        "type": "login_response",
                        "status": "error",
                        "message": result["message"]
                    }


            elif msg_type == "send_message":
                save_message(
                    request["sender_id"],
                    request["sender"],
                    request["message"]
                )

                message_data = {
                    "type": "new_message",
                    "sender": request["sender"],
                    "message": request["message"]
                }

                broadcast(message_data, client_socket)
                response = {"status": "success"}



            elif msg_type == "get_history":
                messages = get_message_history()
                response = {
                    "status": "success",
                    "messages": messages
                }

            else:
                response = {
                    "status": "error",
                    "message": "Unknown request type"
                }

            client_socket.send(json.dumps(response).encode())

        except Exception as e:
            print(f"Error: {e}")
            break

    print(f"Connection closed: {address}")
    if client_socket in clients:
        clients.remove(client_socket)
    client_socket.close()



try:
    while True:
        client_socket, address = server.accept()
        thread = threading.Thread(
            target=handle_client,
            args=(client_socket, address),
            daemon=True
        )
        thread.start()

except KeyboardInterrupt:
    print("\nServer shutting down...")

finally:
    for client in clients:
        try:
            client.close()
        except:
            pass

    server.close()
    print("Server closed cleanly")



