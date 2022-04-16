from flask import request
from flask_socketio import SocketIO

from app import app
from emitter import send_metadata

socketio = SocketIO(app, cors_allowed_origins="*")


@socketio.on("connect")
def socket_connect(auth=None):
    # send_metadata usage example
    send_metadata(request.sid, {"hey": "world"})
    print("connected:", auth, request.sid)


@socketio.on("disconnect")
def socket_disconnect():
    print("disconnected:", request.sid)


if __name__ == "__main__":
    socketio.run(app)
