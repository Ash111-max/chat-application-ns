# Backend - Python Socket Server

## Setup Instructions

### 1. Create Virtual Environment

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On Mac/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your database credentials
```

### 4. Set Up Database

```bash
# Run database setup script
python database.py
```

### 5. Run Server

```bash
python server.py
```

Server will start on `0.0.0.0:5555`

## Project Structure

```
backend/
├── server.py              # Main socket server
├── database.py            # Database connection & queries
├── auth.py               # Authentication logic
├── config.py             # Configuration settings
├── requirements.txt      # Python dependencies
├── .env                  # Environment variables (not in git)
├── .env.example         # Example environment file
├── models/              # Database models
│   ├── user.py
│   └── message.py
├── handlers/            # Request handlers
│   ├── message_handler.py
│   └── connection_handler.py
└── utils/               # Utility functions
    └── logger.py
```

## Implementation Checklist

### Core Server (server.py)
- [ ] Create TCP socket server
- [ ] Bind to 0.0.0.0:5555
- [ ] Accept multiple client connections
- [ ] Use threading for concurrent clients
- [ ] Implement message routing

### Database (database.py)
- [ ] PostgreSQL connection with psycopg2
- [ ] Connection pooling
- [ ] User CRUD operations
- [ ] Message CRUD operations
- [ ] Transaction handling

### Authentication (auth.py)
- [ ] Password hashing (using hashlib or bcrypt)
- [ ] User registration
- [ ] User login validation
- [ ] Session management

### Message Handler (handlers/message_handler.py)
- [ ] Parse incoming JSON messages
- [ ] Route messages to appropriate handlers
- [ ] Broadcast messages to all clients
- [ ] Store messages in database
- [ ] Retrieve message history

## Message Protocol

All messages are JSON format, ending with `\n`

### Client → Server

**Register:**
```json
{
  "type": "register",
  "username": "john_doe",
  "password": "securepass123"
}
```

**Login:**
```json
{
  "type": "login",
  "username": "john_doe",
  "password": "securepass123"
}
```

**Send Message:**
```json
{
  "type": "send_message",
  "sender": "john_doe",
  "message": "Hello everyone!"
}
```

**Get History:**
```json
{
  "type": "get_history",
  "limit": 50
}
```

### Server → Client

**Register Response:**
```json
{
  "type": "register_response",
  "status": "success",
  "message": "User registered successfully"
}
```

**Login Response:**
```json
{
  "type": "login_response",
  "status": "success",
  "user_id": 1,
  "username": "john_doe"
}
```

**New Message (Broadcast):**
```json
{
  "type": "new_message",
  "sender": "john_doe",
  "message": "Hello everyone!",
  "timestamp": "2026-01-15T10:30:00"
}
```

**History Response:**
```json
{
  "type": "history_response",
  "messages": [
    {
      "sender": "john_doe",
      "message": "Hello!",
      "timestamp": "2026-01-15T10:30:00"
    }
  ]
}
```

**Error Response:**
```json
{
  "type": "error",
  "message": "Error description"
}
```

## Database Schema

### users table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### messages table
```sql
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id),
    sender_username VARCHAR(50) NOT NULL,
    message_text TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Testing

### Test with netcat (for debugging)

```bash
# Connect to server
nc localhost 5555

# Send test message
{"type": "register", "username": "test", "password": "test123"}
```

### Test with Python client

```python
import socket
import json

client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect(('localhost', 5555))

# Send login
message = {"type": "login", "username": "test", "password": "test123"}
client.send((json.dumps(message) + '\n').encode())

# Receive response
response = client.recv(4096).decode()
print(response)
```

## Important Notes

1. **Message Format:** All messages MUST end with `\n` (newline)
2. **Thread Safety:** Use locks when accessing shared resources
3. **Error Handling:** Always wrap socket operations in try-catch
4. **Logging:** Log all important events for debugging
5. **Security:** Hash passwords, never store plain text

## Find Your IP Address

Frontend needs your computer's IP address:

**Windows:**
```bash
ipconfig
```

**Mac/Linux:**
```bash
ifconfig
# or
hostname -I
```

Share this IP with frontend developer!

## Troubleshooting

**Port already in use:**
```python
# Add to server socket creation
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
```

**Database connection fails:**
- Check PostgreSQL is running
- Verify credentials in .env
- Check firewall settings

**Clients can't connect:**
- Verify firewall allows port 5555
- Both devices on same WiFi
- Use 0.0.0.0 as host, not localhost