import socket
import json
import threading

def listen(sock):
    while True:
        try:
            data = sock.recv(4096).decode()
            if data:
                print(data)
        except:
            break

client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect(("127.0.0.1", 5555))

threading.Thread(target=listen, args=(client,), daemon=True).start()

client.send(json.dumps({
    "type": "send_message",
    "sender_id": 1,
    "sender": "testuser1",
    "message": "Hello from client!"
}).encode())

input("Press Enter to exit...\n")
client.close()
