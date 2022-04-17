from flask import request
from flask_socketio import SocketIO

from app import app
from validator import with_validation

socketio = SocketIO(app, cors_allowed_origins="*", logger=True, engineio_logger=True)


@socketio.event
def connect(auth=None):
    print("connected:", auth, request.sid)


@socketio.event
@with_validation(socketio)
def stream_one(data):
    """ DEPRECATED """
    face_id: int = data.get("face_id", None)
    image: str = data.get("image", None)

    if face_id is None:
        raise ValueError("FaceID not specified")
    if image is None:
        raise ValueError("Image not specified")

    response = {}  # temp, replace  # noqa
    # do the machine learning here (pls)
    # preferably in a function in a separate file
    # create the response within that logic and return it to here

    # response message
    response["face_id"] = face_id
    socketio.emit("metadata", response)


@socketio.event
@with_validation(socketio)
def stream(image: str):
    if isinstance(image, str):
        raise ValueError("Invalid Image")

    response = []  # temp, replace  # noqa
    # do the machine learning here (pls)
    # preferably in a function in a separate file
    # create the response within that logic and return it to here

    socketio.emit("metadata", response)


@socketio.event
def disconnect():
    print("disconnected:", request.sid)


if __name__ == "__main__":
    socketio.run(app)
