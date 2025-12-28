# Chat Application - Frontend (React Native)

## 📱 Overview

A WhatsApp-inspired real-time chat application built with React Native and Expo, featuring TCP socket communication with the Python backend.

## 🚀 Prerequisites

- Node.js 16+ installed
- npm or yarn
- Expo CLI
- Android Studio (for Android) or Xcode (for iOS/Mac only)
- Mobile device with Expo Go app OR emulator

## 📦 Installation

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

## ⚙️ Configuration

### Update Server IP Address

**IMPORTANT:** Before running the app, update the backend server IP address:

Edit `src/config/constants.ts`:

```typescript
export const SERVER_CONFIG = {
  host: 'YOUR_BACKEND_IP_HERE',  // Replace with actual IP
  port: 5555,
};
```

**How to find your backend IP:**

**Windows:**
```bash
ipconfig
# Look for IPv4 Address
```

**Mac/Linux:**
```bash
ifconfig
# or
hostname -I
# Look for inet address
```

**CRITICAL:** Both your computer (backend) and phone/emulator (frontend) must be on the **same WiFi network**!

## 🏃 Running the App

### Start Development Server

```bash
npm start
```

This will:
- Start the Metro bundler
- Display a QR code
- Show options for running on device or emulator

### Run on Physical Device (Recommended)

1. Install **Expo Go** app:
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. Scan the QR code from terminal

3. App will open in Expo Go

### Run on Android Emulator

```bash
# Make sure Android Studio emulator is running
npm run android
# Or press 'a' after running npm start
```

### Run on iOS Simulator (Mac Only)

```bash
# Make sure Xcode is installed
npm run ios
# Or press 'i' after running npm start
```

## 📂 Project Structure

```
frontend/
├── src/
│   ├── screens/              # Main app screens
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   └── ChatScreen.tsx
│   ├── components/           # Reusable UI components
│   │   ├── MessageBubble.tsx
│   │   ├── MessageInput.tsx
│   │   └── ChatHeader.tsx
│   ├── services/            # Business logic
│   │   └── SocketService.ts  # TCP socket communication
│   ├── config/              # Configuration files
│   │   └── constants.ts
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   └── dateFormatter.ts
│   └── theme/               # Design system
│       ├── colors.ts
│       └── spacing.ts
├── App.tsx                  # Main entry point
├── package.json
└── tsconfig.json
```

## ✨ Features Implemented

### Authentication
- ✅ User registration with validation
- ✅ User login
- ✅ Password visibility toggle
- ✅ Persistent login (AsyncStorage)
- ✅ Secure logout

### Messaging
- ✅ Real-time message sending/receiving
- ✅ WhatsApp-style message bubbles
- ✅ Message timestamps
- ✅ Read receipts (checkmarks)
- ✅ Message history loading
- ✅ Auto-scroll to latest message

### UI/UX
- ✅ WhatsApp-inspired design
- ✅ Smooth animations
- ✅ Loading states
- ✅ Error handling
- ✅ Keyboard-aware inputs
- ✅ Empty state handling

### Connection Management
- ✅ Auto-connect on login
- ✅ Auto-reconnect on disconnect
- ✅ Connection status indicators
- ✅ Error alerts

## 🎨 Design System

### Color Scheme (WhatsApp-inspired)
- **Primary**: `#075E54` (Dark Teal)
- **Accent**: `#25D366` (Bright Green)
- **Sent Message**: `#DCF8C6` (Light Green)
- **Received Message**: `#FFFFFF` (White)
- **Background**: `#ECE5DD` (Beige)

### Typography
- **Title**: 32px, Bold
- **Body**: 16px, Regular
- **Caption**: 12px, Regular

## 🔧 Development Commands

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS (Mac only)
npm run ios

# Run on Web (experimental)
npm run web

# Clear cache and restart
npx expo start -c

# Type checking
npm run tsc

# Lint code (if configured)
npm run lint
```

## 🧪 Testing

### Testing Checklist

#### UI Testing (Without Backend)
- [ ] App launches without errors
- [ ] Navigation works (Login ↔ Register)
- [ ] Input validation works
- [ ] Loading states appear correctly
- [ ] Keyboard doesn't overlap inputs

#### Integration Testing (With Backend)
- [ ] Can connect to server
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can send messages
- [ ] Messages appear in real-time
- [ ] Message history loads
- [ ] Multiple users can chat
- [ ] Logout works properly

### Test Scenarios

1. **Registration Flow**
   ```
   1. Open app
   2. Tap "Register"
   3. Enter username, password, confirm password
   4. Tap "Create Account"
   5. Should show success alert
   6. Navigate to Login screen
   ```

2. **Login Flow**
   ```
   1. Enter username and password
   2. Tap "Login"
   3. Should connect to server
   4. Should navigate to Chat screen
   5. Should load message history
   ```

3. **Messaging Flow**
   ```
   1. Login on two devices
   2. Send message from Device A
   3. Message should appear on Device B
   4. Reply from Device B
   5. Message should appear on Device A
   ```

## 🐛 Troubleshooting

### Cannot Connect to Server

**Problem**: "Connection Error" alert appears

**Solutions**:
1. Verify backend server is running
2. Check IP address in `src/config/constants.ts`
3. Ensure both devices on same WiFi
4. Check firewall settings
5. Try disabling VPN

```bash
# Test connectivity
ping YOUR_BACKEND_IP
```

### Messages Not Appearing

**Problem**: Sent messages don't show up

**Solutions**:
1. Check socket connection status
2. Verify message format matches backend protocol
3. Check backend logs for errors
4. Restart both frontend and backend

### App Crashes on Startup

**Problem**: App immediately crashes

**Solutions**:
```bash
# Clear cache
npx expo start -c

# Reinstall dependencies
rm -rf node_modules
npm install

# Check for errors
npx expo-doctor
```

### Keyboard Overlaps Input

**Problem**: Keyboard covers message input

**Solution**: Already handled with `KeyboardAvoidingView`. If issue persists:
1. Restart app
2. Check device settings
3. Update Expo SDK

### Expo Go App Issues

**Problem**: QR code won't scan

**Solutions**:
1. Ensure both computer and phone on same WiFi
2. Try manually entering URL shown in terminal
3. Restart Expo Go app
4. Update Expo Go to latest version

## 📱 Building for Production

### Android APK

```bash
# Build APK
eas build --platform android --profile preview

# Or local build
npm run build:android
```

### iOS App (Mac only, requires Apple Developer account)

```bash
# Build for iOS
eas build --platform ios --profile preview
```

## 🔒 Security Notes

- Passwords are sent to backend (backend should hash them)
- No sensitive data stored locally except username
- TCP communication is unencrypted (for educational purposes)
- In production, use TLS/SSL

## 📚 Dependencies

### Core
- `react-native`: Mobile framework
- `expo`: Development platform
- `@react-navigation/native`: Navigation
- `@react-navigation/native-stack`: Stack navigator

### Networking
- `react-native-tcp-socket`: TCP socket communication

### Storage
- `@react-native-async-storage/async-storage`: Local storage

### UI
- `@expo/vector-icons`: Icon library
- `date-fns`: Date formatting

## 🤝 Integration with Backend

### Message Protocol

All messages use JSON format with `\n` delimiter:

**Client → Server:**
```json
{"type": "login", "username": "john", "password": "pass123"}
```

**Server → Client:**
```json
{"type": "login_response", "status": "success", "user_id": 1}
```

Full protocol documentation in backend README.

## 📝 Code Style

- TypeScript for type safety
- Functional components with hooks
- Component-based architecture
- Consistent naming conventions
- ESLint (if configured)

## 🎯 Future Enhancements

- [ ] File/image sharing
- [ ] Voice messages
- [ ] Push notifications
- [ ] User profiles
- [ ] Group chats
- [ ] Message reactions
- [ ] Dark mode
- [ ] End-to-end encryption

## 📄 License

Educational project for university coursework.

## 👨‍💻 Developer

[Your Name] - Frontend Developer

For issues or questions, create an issue on GitHub or contact the development team.

---

**Happy Coding! 🚀**