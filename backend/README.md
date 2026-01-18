# Backend - Python Socket.IO Server

## Setup Instructions

1. Create virtual env: `python -m venv venv` (activate: `venv\Scripts\activate` on Windows or `source venv/bin/activate` on Mac/Linux)
2. Install deps: `pip install -r requirements.txt`
3. Copy `.env.example` to `.env` and set DB credentials (Neon/PostgreSQL)
4. Run schema.sql in your DB
5. Start server: `python server_socketio.py`

Server listens on 0.0.0.0:5555 (or .env port).

## Project Structure

```

backend/
├── server_socketio.py     # Main Socket.IO server
├── database.py            # DB connection
├── auth.py                # User auth with bcrypt
├── config.py              # Env config
├── message_handler.py     # Message saving/history
├── requirements.txt       # Deps
├── .env.example           # Env template
└── schema.sql             # DB schema
```


## Features
- User registration/login with bcrypt hashing
- Real-time message broadcast
- Message persistence in PostgreSQL
- History retrieval
- Concurrent clients handling

## Protocol
- Events: `register`, `login`, `send_message`, `get_history`
- Responses: `register_response`, `login_response`, `new_message`, `history_response`

## Testing
- Use test_client.py for login/send
- Netcat: `nc localhost 5555` + JSON
- Multi-client: Open multiple terminals

## Troubleshooting
- DB fails: Check .env credentials
- Connections fail: Check port/firewall
- Use ngrok for mobile: `ngrok http 5555`

