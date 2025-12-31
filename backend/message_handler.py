# backend/message_handler.py

from database import get_db_connection

def save_message(sender_id: int, sender_username: str, message: str):
    """Save message to database"""
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO messages (sender_id, sender_username, message_text)
            VALUES (%s, %s, %s);
            """,
            (sender_id, sender_username, message)
        )
        conn.commit()
        print(f"💾 Message saved from {sender_username}")
    except Exception as e:
        print(f"❌ Error saving message: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()


def get_message_history(limit=50):
    """Get recent message history"""
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            SELECT sender_username, message_text, timestamp
            FROM messages
            ORDER BY timestamp ASC
            LIMIT %s;
            """,
            (limit,)
        )

        messages = cursor.fetchall()
        
        result = [
            {
                "sender": row[0],
                "message": row[1],
                "timestamp": row[2].isoformat()
            }
            for row in messages
        ]
        
        print(f"📜 Retrieved {len(result)} messages from history")
        return result
        
    except Exception as e:
        print(f"❌ Error retrieving message history: {e}")
        return []
    finally:
        cursor.close()
        conn.close()