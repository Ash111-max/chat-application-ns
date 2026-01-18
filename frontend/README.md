# Frontend - React Native Chat App

## Setup Instructions

1. Install deps: `npm install`
2. Copy `.env.example` to `.env` and set SERVER_HOST/PORT/USE_HTTPS (ngrok or local IP)
3. Start: `npx expo start --tunnel`
4. Scan QR with Expo Go on phone (same WiFi as backend or use ngrok)

## Project Structure

```
frontend/
├── src/
│   ├── screens/           # Screens: Login, Register, Chat
│   ├── services/         # SocketService.ts for Socket.IO
│   ├── config/           # constants.ts for env
│   ├── types/            # TS types
│   └── theme/            # Colors/spacing
├── App.tsx               # Entry point with navigation
├── app.config.ts         # Expo config with env
├── package.json
├── .env.example
└── tsconfig.json
```


## Features
- Registration/login with validation
- Real-time messaging via Socket.IO
- Message history from DB
- WhatsApp-style UI with bubbles/timestamps
- Auto-reconnect
- Persistent login

## Development
- `npm start`: Dev server
- `npx expo start --tunnel -c`: With tunnel/cache clear
- Test on phone: Expo Go app
- Local: Use backend IP in .env
- Tunnel: Use ngrok backend URL in .env

## Troubleshooting
- Connection error: Check .env, backend running, same WiFi/ngrok
- App crashes: `npx expo start -c`
- Messages not appearing: Check SocketService logs
