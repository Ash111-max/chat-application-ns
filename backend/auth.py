# # backend/auth.py
# import hashlib
# import psycopg2
# from database import get_db_connection


# def hash_password(password: str) -> str:
#     return hashlib.sha256(password.encode()).hexdigest()

# def register_user(username: str, password: str):
#     conn = get_db_connection()
#     cursor = conn.cursor()

#     password_hash = hash_password(password)

#     try:
#         cursor.execute(
#             """
#             INSERT INTO users (username, password_hash)
#             VALUES (%s, %s)
#             RETURNING id;
#             """,
#             (username, password_hash)
#         )
#         user_id = cursor.fetchone()[0]
#         conn.commit()

#         return {
#             "status": "success",
#             "user_id": user_id,
#             "message": "User registered successfully"
#         }

#     except psycopg2.errors.UniqueViolation:
#         conn.rollback()
#         return {
#             "status": "error",
#             "message": "Username already exists"
#         }

#     except Exception as e:
#         conn.rollback()
#         return {
#             "status": "error",
#             "message": str(e)
#         }

#     finally:
#         cursor.close()
#         conn.close()


# def login_user(username: str, password: str):
#     conn = get_db_connection()
#     cursor = conn.cursor()

#     password_hash = hash_password(password)

#     try:
#         cursor.execute(
#             """
#             SELECT id, username
#             FROM users
#             WHERE username = %s AND password_hash = %s;
#             """,
#             (username, password_hash)
#         )

#         user = cursor.fetchone()

#         if user:
#             return {
#                 "status": "success",
#                 "user_id": user[0],
#                 "username": user[1]
#             }
#         else:
#             return {
#                 "status": "error",
#                 "message": "Invalid username or password"
#             }

#     except Exception as e:
#         return {
#             "status": "error",
#             "message": str(e)
#         }

#     finally:
#         cursor.close()
#         conn.close()

# backend/auth.py
import bcrypt
import psycopg2
from database import get_db_connection


def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=12)).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))


def register_user(username: str, password: str):
    conn = get_db_connection()
    cursor = conn.cursor()

    password_hash = hash_password(password)

    try:
        cursor.execute(
            """
            INSERT INTO users (username, password_hash)
            VALUES (%s, %s)
            RETURNING id;
            """,
            (username, password_hash)
        )
        user_id = cursor.fetchone()[0]
        conn.commit()

        return {
            "status": "success",
            "user_id": user_id,
            "message": "User registered successfully"
        }

    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        return {
            "status": "error",
            "message": "Username already exists"
        }

    except Exception as e:
        conn.rollback()
        return {
            "status": "error",
            "message": str(e)
        }

    finally:
        cursor.close()
        conn.close()


def login_user(username: str, password: str):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            SELECT id, username, password_hash
            FROM users
            WHERE username = %s;
            """,
            (username,)
        )

        user = cursor.fetchone()

        if user and verify_password(password, user[2]):
            return {
                "status": "success",
                "user_id": user[0],
                "username": user[1]
            }
        else:
            return {
                "status": "error",
                "message": "Invalid username or password"
            }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

    finally:
        cursor.close()
        conn.close()