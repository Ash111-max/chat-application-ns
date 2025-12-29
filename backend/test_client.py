import socket
import json

client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect(("127.0.0.1", 5555))

request = {
    "type": "login",
    "username": "testuser1",
    "password": "password123"
}

client.send(json.dumps(request).encode())
response = client.recv(4096).decode()
print(response)

client.close()
