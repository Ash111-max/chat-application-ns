# Real-Time Chat Application

A real-time chat application with a Python socket server backend and React Native mobile frontend. Supports user registration, login, real-time messaging, and message history persistence.

## 👥 Team Members
- **Frontend Developer**: Astle - React Native Mobile App
- **Backend Developer**: Aaron Pinto - Python Socket Server

## 🏗️ Project Structure

'''
chat-application/
├── backend/          # Python socket server with PostgreSQL
│   ├── server_socketio.py
│   ├── database.py
│   ├── auth.py
│   ├── config.py
│   ├── message_handler.py
│   ├── requirements.txt
│   ├── .env.example
│   └── schema.sql
└── frontend/         # React Native mobile app
    ├── src/
    │   ├── screens/
    │   ├── services/
    │   ├── config/
    │   ├── types/
    │   └── theme/
    ├── App.tsx
    ├── app.config.ts
    ├── package.json
    ├── .env.example
    └── tsconfig.json
'''

## 🚀 Technologies Used

### Backend
- Python 3.8+ with Socket.IO
- PostgreSQL (Neon DB)
- psycopg2 for database connectivity
- bcrypt for password hashing

### Frontend
- React Native (Expo SDK)
- socket.io-client for real-time communication
- React Navigation for screens
- AsyncStorage for local persistence

## ✨ Features
- User registration and authentication
- Real-time messaging with broadcast
- Message history loading from DB
- Persistent sessions
- Connection auto-reconnect
- WhatsApp-inspired UI
- Validation and error handling

## 📋 Setup Instructions

### Backend
1. Navigate to `backend/`
2. Create virtual env: `python -m venv venv` (activate: `venv\Scripts\activate` on Windows or `source venv/bin/activate` on Mac/Linux)
3. Install deps: `pip install -r requirements.txt`
4. Copy `.env.example` to `.env` and fill in DB credentials (Neon/PostgreSQL)
5. Run schema: Use schema.sql in your DB tool
6. Start server: `python server_socketio.py`

### Frontend
1. Navigate to `frontend/`
2. Install deps: `npm install`
3. Copy `.env.example` to `.env` and set SERVER_HOST/PORT/USE_HTTPS (use ngrok for mobile testing)
4. Start: `npx expo start --tunnel`
5. Scan QR with Expo Go app on phone

## 🔌 Communication Protocol

Messages are JSON over Socket.IO.

- Client to Server: e.g., `{"username": "user", "password": "pass"}` for login/register
- Server to Client: e.g., `{"status": "success", "user_id": 1}` for responses

## 🧪 Testing
- Local: Run backend, connect frontend via local IP
- Tunnel: Use ngrok for backend, update frontend .env
- Multi-device: Test real-time messaging with 2 or more phones

## 🐛 Troubleshooting
- Connection fails: Check IP/port, same WiFi, firewall
- DB errors: Verify .env credentials
- Messages not saving: Check PostgreSQL connection

## 📝 Notes
- For production, add TLS/SSL
- Use ngrok for mobile testing over internet
```
