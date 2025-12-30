# server_socketio.py
import socketio
import asyncio
from aiohttp import web
from datetime import datetime

from auth import register_user, login_user
from message_handler import save_message, get_message_history
from config import SERVER_HOST, SERVER_PORT

# Create Socket.io server with comprehensive CORS settings
sio = socketio.AsyncServer(
    async_mode='aiohttp',
    cors_allowed_origins='*',  # Allow all origins for development
    logger=True,
    engineio_logger=True,
    ping_timeout=60,  # Longer timeout for mobile/tunnel
    ping_interval=25,
    max_http_buffer_size=1000000,
    allow_upgrades=True,
    transports=['polling', 'websocket']  # Support both transports
)

# Create web application
app = web.Application()

# Attach Socket.io to app (Socket.io handles CORS internally)
sio.attach(app)

# Store connected clients
connected_clients = {}


@sio.event
async def connect(sid, environ):
    """Handle client connection"""
    print(f"✅ Client connected: {sid}")
    print(f"   Origin: {environ.get('HTTP_ORIGIN', 'unknown')}")
    print(f"   User-Agent: {environ.get('HTTP_USER_AGENT', 'unknown')}")
    connected_clients[sid] = {
        'sid': sid,
        'username': None,
        'user_id': None
    }


@sio.event
async def disconnect(sid):
    """Handle client disconnection"""
    print(f"🔌 Client disconnected: {sid}")
    if sid in connected_clients:
        username = connected_clients[sid].get('username')
        if username:
            print(f"   User '{username}' disconnected")
        del connected_clients[sid]


@sio.event
async def register(sid, data):
    """Handle user registration"""
    print(f"📨 Register request from {sid}")
    print(f"   Data: {data}")
    
    try:
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            await sio.emit('register_response', {
                'type': 'register_response',
                'status': 'error',
                'message': 'Username and password are required'
            }, room=sid)
            return
        
        result = register_user(username, password)
        
        response = {
            'type': 'register_response',
            'status': result['status'],
            'message': result['message']
        }
        
        await sio.emit('register_response', response, room=sid)
        print(f"✅ Registration response sent to {sid}: {result['status']}")
        
    except Exception as e:
        print(f"❌ Error in register: {e}")
        import traceback
        traceback.print_exc()
        await sio.emit('register_response', {
            'type': 'register_response',
            'status': 'error',
            'message': str(e)
        }, room=sid)


@sio.event
async def login(sid, data):
    """Handle user login"""
    print(f"📨 Login request from {sid}")
    print(f"   Data: {data}")
    
    try:
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            await sio.emit('login_response', {
                'type': 'login_response',
                'status': 'error',
                'message': 'Username and password are required'
            }, room=sid)
            return
        
        result = login_user(username, password)
        
        if result['status'] == 'success':
            # Store user info
            connected_clients[sid]['username'] = result['username']
            connected_clients[sid]['user_id'] = result['user_id']
            
            response = {
                'type': 'login_response',
                'status': 'success',
                'user_id': result['user_id'],
                'username': result['username']
            }
            
            print(f"✅ User '{username}' logged in successfully")
        else:
            response = {
                'type': 'login_response',
                'status': 'error',
                'message': result.get('message', 'Login failed')
            }
            print(f"❌ Login failed for '{username}': {response['message']}")
        
        await sio.emit('login_response', response, room=sid)
        
    except Exception as e:
        print(f"❌ Error in login: {e}")
        import traceback
        traceback.print_exc()
        await sio.emit('login_response', {
            'type': 'login_response',
            'status': 'error',
            'message': str(e)
        }, room=sid)


@sio.event
async def get_history(sid, data):
    """Handle message history request"""
    print(f"📨 History request from {sid}")
    
    try:
        limit = data.get('limit', 50)
        messages = get_message_history(limit)
        
        response = {
            'type': 'history_response',
            'messages': messages
        }
        
        await sio.emit('history_response', response, room=sid)
        print(f"📜 Sent {len(messages)} messages to {sid}")
        
    except Exception as e:
        print(f"❌ Error in get_history: {e}")
        import traceback
        traceback.print_exc()
        await sio.emit('error', {
            'type': 'error',
            'message': str(e)
        }, room=sid)


@sio.event
async def send_message(sid, data):
    """Handle sending a message"""
    print(f"📨 Message from {sid}")
    
    try:
        sender = data.get('sender')
        message = data.get('message')
        user_id = connected_clients[sid].get('user_id')
        
        if not sender or not message:
            await sio.emit('error', {
                'type': 'error',
                'message': 'Sender and message are required'
            }, room=sid)
            return
        
        # Save to database
        save_message(user_id, sender, message)
        
        # Broadcast to all clients
        broadcast_data = {
            'type': 'new_message',
            'sender': sender,
            'message': message,
            'timestamp': datetime.now().isoformat()
        }
        
        # Send to all connected clients including sender
        await sio.emit('new_message', broadcast_data)
        print(f"💾 Message from '{sender}' broadcasted to {len(connected_clients)} clients")
        
    except Exception as e:
        print(f"❌ Error in send_message: {e}")
        import traceback
        traceback.print_exc()
        await sio.emit('error', {
            'type': 'error',
            'message': str(e)
        }, room=sid)


async def index(request):
    """Simple index page for testing"""
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Chat Server</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
            }
            .container {
                text-align: center;
                background: rgba(255,255,255,0.1);
                padding: 40px;
                border-radius: 20px;
                backdrop-filter: blur(10px);
            }
            h1 { font-size: 3em; margin: 0; }
            p { font-size: 1.2em; opacity: 0.9; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 Chat Server Running!</h1>
            <p>Socket.io server is active and ready</p>
            <p>Connected clients: """ + str(len(connected_clients)) + """</p>
        </div>
    </body>
    </html>
    """
    return web.Response(text=html, content_type='text/html')


# Add routes
app.router.add_get('/', index)


if __name__ == '__main__':
    print("=" * 60)
    print(f"🚀 Socket.io Server Starting...")
    print(f"📡 Listening on {SERVER_HOST}:{SERVER_PORT}")
    print(f"🌐 WebSocket URL: http://{SERVER_HOST}:{SERVER_PORT}")
    print(f"")
    print(f"📱 For mobile testing:")
    print(f"   1. Make sure firewall allows port {SERVER_PORT}")
    print(f"   2. Use your computer's IP (not localhost)")
    print(f"   3. Both devices must be on same WiFi")
    print(f"")
    print(f"🔧 For tunnel mode:")
    print(f"   1. Start expo with: npx expo start --tunnel")
    print(f"   2. Update frontend constants.ts with tunnel URL")
    print("=" * 60)
    
    web.run_app(app, host=SERVER_HOST, port=SERVER_PORT)