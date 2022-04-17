from functools import wraps
from flask_socketio import SocketIO


def with_validation(socketio: SocketIO, error_event_name: str = "error"):
    def with_validation_wrapper(function):
        @wraps(function)
        def with_validation_inner(*args, **kwargs):
            try:
                return function(*args, **kwargs)
            except ValueError as e:
                socketio.emit(error_event_name, str(e))

        return with_validation_inner

    return with_validation_wrapper
