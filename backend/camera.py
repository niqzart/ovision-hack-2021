import base64

import cv2
import dlib
import numpy as np

from features import Features

fm = Features()

face_cascade = cv2.CascadeClassifier("models/haarcascades.xml")
ds_factor = 0.7


class Camera(object):

    def get_frame(self, image):

        frameFace, bboxes = fm.getFaceBox(fm.faceNet, image)
        json_features = self.get_features(bboxes, image)

        image = cv2.resize(image, None, fx=ds_factor, fy=ds_factor, interpolation=cv2.INTER_AREA)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        face_rects = face_cascade.detectMultiScale(gray, 1.1, 50)
        faces = []
        for (i, rect) in enumerate(face_rects):
            frameFace, bboxes = fm.getFaceBox(fm.faceNet, image)
            json_features = self.get_features(bboxes, image)

            left = rect[0]
            top = rect[1]
            right = left + rect[2]
            bottom = top + rect[3]
            rect_landmarks = dlib.rectangle(left, top, right, bottom)

            shape = fm.show_raw_detection(image, rect_landmarks, gray, i)
            json_features.update({'landmarks': shape})
            face_regions = fm.visualize_facial_landmarks(image, rect_landmarks, shape)
            json_features.update(face_regions)
            x, y, w, h = rect
            faces.append(json_features)
            break
        ret, jpeg = cv2.imencode('.jpg', image)

        return jpeg.tobytes(), faces

    def get_features(self, bboxes, frame):

        for bbox in bboxes:
            face = frame[max(0, bbox[1] - fm.padding):min(bbox[3] + fm.padding, frame.shape[0] - 1),
                   max(0, bbox[0] - fm.padding):min(bbox[2] + fm.padding, frame.shape[1] - 1)]

            blob = cv2.dnn.blobFromImage(face, 1.0, (227, 227), fm.MODEL_MEAN_VALUES, swapRB=False)
            fm.genderNet.setInput(blob)
            genderPreds = fm.genderNet.forward()
            gender = fm.genderList[genderPreds[0].argmax()]
            # print("Gender Output : {}".format(genderPreds))
            # print("Gender : {}, conf = {:.3f}".format(gender, genderPreds[0].max()))

            fm.ageNet.setInput(blob)
            agePreds = fm.ageNet.forward()
            age = fm.ageList[agePreds[0].argmax()]
            # print("Age Output : {}".format(agePreds))
            # print("Age : {}, conf = {:.3f}".format(age, agePreds[0].max()))

            # label = "{},{}".format(gender, age)
            # cv2.putText(frameFace, label, (bbox[0], bbox[1]-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2, cv2.LINE_AA)
            # cv2.imshow("Age Gender Demo", frameFace)
            return {'age': age, 'ageConfidence': agePreds[0].max(), 'gender': gender,
                    'genderConfidence': genderPreds[0].max()}

    def decode_image(self, image):
        nparr = np.frombuffer(base64.b64decode(image[22:].encode("utf-8")), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        print(img)
        return img
