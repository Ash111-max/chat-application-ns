# backend/server_socketio.py
import socketio
import asyncio
from aiohttp import web
from datetime import datetime

from auth import register_user, login_user
from message_handler import save_message, get_message_history
from config import SERVER_HOST, SERVER_PORT

# Create Socket.io server
sio = socketio.AsyncServer(
    async_mode='aiohttp',
    cors_allowed_origins='*',  # Allow all for development
    logger=True,
    engineio_logger=True,
    ping_timeout=60,
    ping_interval=25,
    max_http_buffer_size=1000000,
    allow_upgrades=True,
    transports=['polling', 'websocket']
)

# Create web application
app = web.Application()

# Attach Socket.io to app (Socket.io handles CORS internally)
sio.attach(app)

# Store connected clients: sid → {username, user_id}
connected_clients = {}


@sio.event
async def connect(sid, environ):
    print(f"✅ Client connected: {sid}")
    connected_clients[sid] = {
        'username': None,
        'user_id': None
    }


@sio.event
async def disconnect(sid):
    print(f"🔌 Client disconnected: {sid}")
    if sid in connected_clients:
        username = connected_clients[sid].get('username')
        if username:
            print(f"   User '{username}' logged out")
        del connected_clients[sid]


@sio.on('register')
async def register(sid, data):
    print(f"📨 Register request from {sid}: {data}")
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        await sio.emit('register_response', {
            'status': 'error',
            'message': 'Username and password required'
        }, room=sid)
        return

    result = register_user(username, password)

    await sio.emit('register_response', {
        'status': result['status'],
        'message': result.get('message', 'Success')
    }, room=sid)


@sio.on('login')
async def login(sid, data):
    print(f"📨 Login request from {sid}: {data}")
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        await sio.emit('login_response', {
            'status': 'error',
            'message': 'Username and password required'
        }, room=sid)
        return

    result = login_user(username, password)

    if result['status'] == 'success':
        # Store user session
        connected_clients[sid]['username'] = result['username']
        connected_clients[sid]['user_id'] = result['user_id']

        # Send success + auto-load history
        await sio.emit('login_response', {
            'status': 'success',
            'user_id': result['user_id'],
            'username': result['username']
        }, room=sid)

        # Send message history immediately
        history = get_message_history(1000)
        await sio.emit('history_response', {
            'messages': history
        }, room=sid)

        print(f"✅ User '{username}' logged in (SID: {sid})")
    else:
        await sio.emit('login_response', {
            'status': 'error',
            'message': result.get('message', 'Invalid credentials')
        }, room=sid)


@sio.on('get_history')
async def get_history(sid, data):
    limit = data.get('limit', 1000)
    history = get_message_history(limit)
    await sio.emit('history_response', {
        'messages': history
    }, room=sid)


@sio.on('send_message')
async def send_message(sid, data):
    sender = data.get('sender')
    message = data.get('message')

    if not sender or not message:
        await sio.emit('error', {
            'message': 'Sender and message required'
        }, room=sid)
        return

    user_info = connected_clients.get(sid)
    if not user_info or not user_info['user_id']:
        await sio.emit('error', {
            'message': 'You must be logged in to send messages'
        }, room=sid)
        return

    # Save to DB
    save_message(user_info['user_id'], sender, message)

    # Broadcast to ALL clients
    broadcast_payload = {
        'sender': sender,
        'message': message,
        'timestamp': datetime.now().isoformat()
    }

    await sio.emit('new_message', broadcast_payload)
    print(f"📢 Broadcasted message from '{sender}' to {len(connected_clients)} clients")


async def index(request):
    html = f"""
    <!DOCTYPE html>
    <html>
    <head><title>Chat Server Live</title></head>
    <body style="font-family: sans-serif; text-align: center; padding: 50px; background: #1a1a2e; color: #eee;">
        <h1>🚀 Chat Server Running!</h1>
        <p>Connected clients: {len(connected_clients)}</p>
        <p>Port: {SERVER_PORT}</p>
    </body>
    </html>
    """
    return web.Response(text=html, content_type='text/html')


app.router.add_get('/', index)

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 Chat Server Starting...")
    print(f"📡 Host: {SERVER_HOST}:{SERVER_PORT}")
    print(f"🌐 Access via ngrok HTTPS URL in mobile app")
    print("=" * 60)
    web.run_app(app, host=SERVER_HOST, port=SERVER_PORT)