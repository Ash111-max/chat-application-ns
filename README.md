# Real-Time Chat Application

A real-time chat application built with Python socket server backend and React Native mobile frontend.

## 👥 Team Members
- **Frontend Developer**: Astle - React Native Mobile App
- **Backend Developer**: Aaron Pinto - Python Socket Server

## 🏗️ Project Structure

```
chat-application/
├── backend/          # Python socket server with PostgreSQL
│   ├── server.py
│   ├── database.py
│   ├── auth.py
│   └── ...
└── frontend/         # React Native mobile app
    ├── src/
    │   ├── screens/
    │   ├── services/
    │   ├── components/
    │   └── config/
    └── ...
```

## 🚀 Technologies Used

### Backend
- **Python 3.8+** - Socket Programming
- **PostgreSQL** (Neon DB) - Database
- **psycopg2** - PostgreSQL adapter
- **Threading** - Concurrent client handling

### Frontend
- **React Native** (Expo) - Mobile Framework
- **TCP Sockets** - Real-time communication
- **React Navigation** - Screen navigation
- **AsyncStorage** - Local data persistence

## ✨ Features

- ✅ User Registration & Authentication
- ✅ Real-time Messaging
- ✅ Message Persistence
- ✅ Multiple Concurrent Users
- ✅ Message History
- ✅ WhatsApp-like UI
- ✅ Auto-reconnection
- ✅ Online Status

## 📋 Setup Instructions

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your database credentials
python server.py
```

See `backend/README.md` for detailed instructions.

### Frontend Setup

```bash
cd frontend
npm install
npm start
# Scan QR code with Expo Go app
```

See `frontend/README.md` for detailed instructions.

## 🔌 Communication Protocol

All messages use **JSON format** with newline delimiter:

```json
{
  "type": "message_type",
  "...": "data"
}
```

Full protocol documentation in `backend/README.md`

## 🎯 Assignment Details

**Course**: Network Security and Internet Technologies  
**Assignment**: CIA Assignment - Socket Programming  
**Due Date**: January 19, 2026  
**Points**: 20

### Grading Criteria
- Python Socket & Database (5 pts)
- Mobile Application Functionality (5 pts)
- Code Quality & GitHub (5 pts)
- Demo Video & Presentation (5 pts)

## 📹 Demo Video

[Link will be added after recording]

## 🧪 Testing

### Test Locally
1. Start backend server
2. Run frontend on emulator/device
3. Register and login
4. Send messages
5. Test with multiple devices

### Integration Testing
- Both devices on same WiFi
- Backend server IP configured in frontend
- Test concurrent users
- Test message persistence

## 🤝 Collaboration

### Git Workflow
```bash
# Backend developer
git checkout -b backend-dev
# Make changes
git add .
git commit -m "Backend: Implement socket server"
git push origin backend-dev

# Frontend developer
git checkout -b frontend-dev
# Make changes
git add .
git commit -m "Frontend: Add chat screen"
git push origin frontend-dev
```

### Communication
- Daily standups
- Test integration regularly
- Document issues in GitHub Issues
- Use pull requests for code review

## 📝 Documentation

- Backend Implementation: `backend/README.md`
- Frontend Implementation: `frontend/README.md`
- API Protocol: See backend README
- Demo Script: `docs/DEMO_SCRIPT.md`

## 🐛 Troubleshooting

### Cannot Connect to Server
- Verify backend is running
- Check IP address and port
- Ensure same WiFi network
- Check firewall settings

### Messages Not Appearing
- Check socket connection
- Verify message format
- Check backend logs
- Test with netcat

## 📚 Resources

- [Python Socket Programming](https://docs.python.org/3/library/socket.html)
- [React Native Documentation](https://reactnative.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Neon DB](https://neon.tech/)

## 📄 License

This project is for educational purposes as part of university coursework.

## 🙏 Acknowledgments

Special thanks to our course instructor and peers for guidance and support.

---

**Made with ❤️ for Network Security Course**