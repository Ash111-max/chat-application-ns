# backend/test_db.py
from auth import register_user, login_user
from message_handler import save_message, get_message_history

# Test registration
print(register_user("testuser1", "password123"))

# Test login
print(login_user("testuser1", "password123"))

# Test message save
save_message(1, "testuser1", "Hello Neon DB!")

# Test message fetch
messages = get_message_history()
print(messages)

