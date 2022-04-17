import json

from flask import Flask

from camera import Camera

app = Flask(__name__)

camera = Camera()


# @app.route('/')
# def index():
#     return render_template('index.html')


def gen(img):
    img = camera.decode_image(img)
    frame, json_features = camera.get_frame(img)
    print(json_features)
    json_features = json.loads(str(json_features))
    return json_features

#
# @app.route('/video_feed')
# def video_feed():
#     return Response(gen(Camera()),
#                     mimetype='multipart/x-mixed-replace; boundary=frame')
# 
# if __name__ == '__main__':
#     app.run(debug=True)
