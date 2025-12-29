import socket
import json

client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect(("127.0.0.1", 5555))

client.send(json.dumps({
    "type": "login",
    "username": "testuser1",
    "password": "password123"
}).encode())

print(client.recv(8192).decode())
client.close()
