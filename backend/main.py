from flask import request

from app import app
from flask_socketio import SocketIO

socketio = SocketIO(app)


@socketio.on("connect")
def socket_connect(auth=None):
    print("connected:", auth, request.sid)


@socketio.on("disconnect")
def socket_disconnect():
    print("disconnected:", request.sid)


if __name__ == "__main__":
    socketio.run(app)
