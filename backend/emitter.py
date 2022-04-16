from flask_socketio import emit


def send_metadata(sid, data: dict):
    emit("metadata", data, room=sid)
