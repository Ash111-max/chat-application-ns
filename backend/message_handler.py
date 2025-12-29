from database import get_db_connection

def save_message(sender_id: int, sender_username: str, message: str):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO messages (sender_id, sender_username, message_text)
        VALUES (%s, %s, %s);
        """,
        (sender_id, sender_username, message)
    )

    conn.commit()
    cursor.close()
    conn.close()


def get_message_history(limit=50):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT sender_username, message_text, timestamp
        FROM messages
        ORDER BY timestamp DESC
        LIMIT %s;
        """,
        (limit,)
    )

    messages = cursor.fetchall()

    cursor.close()
    conn.close()

    return [
        {
            "sender": row[0],
            "message": row[1],
            "timestamp": row[2].isoformat()
        }
        for row in messages
    ]
