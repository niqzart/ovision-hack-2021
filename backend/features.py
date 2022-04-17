import numpy as np
import dlib
import cv2
import os
# from bz2 import decompress
from urllib.request import urlretrieve
from imutils import face_utils
from collections import OrderedDict
# from os.path import dirname, join


# def download():
#     # if type == 5:
#     #     model_url = f"http://dlib.net/files/shape_predictor_5_face_landmarks.dat.bz2"
#     #     model_name = "shape_predictor_5_face_landmarks.dat"
#     # else:
#     model_url = f"https://github.com/davisking/dlib-models/raw/master/shape_predictor_68_face_landmarks_GTX.dat.bz2"
#     model_name = "shape_predictor_68_face_landmarks_GTX.dat"
#
#     if not os.path.exists(model_name):
#         urlretrieve(model_url, model_name + ".bz2")
#         with open(model_name, "wb") as new_file, open(model_name + ".bz2", "rb") as file:
#             data = decompress(file.read())
#             new_file.write(data)
#         os.remove(model_name + ".bz2")
#     return model_name


class Features():
    def __init__(self):

        # For dlib’s 68-point facial landmark detector:
        self.FACIAL_LANDMARKS_68_IDXS = OrderedDict([
            ("mouth", (48, 68)),
            ("inner_mouth", (60, 68)),
            ("right_eyebrow", (17, 22)),
            ("left_eyebrow", (22, 27)),
            ("right_eye", (36, 42)),
            ("left_eye", (42, 48)),
            ("nose", (27, 36)),
            ("jaw", (0, 17))
        ])


        faceProto = "models/opencv_face_detector.pbtxt"
        faceModel = "models/opencv_face_detector_uint8.pb"

        ageProto = "models/age_deploy.prototxt"
        ageModel = "models/age_net.caffemodel"

        genderProto = "models/gender_deploy.prototxt"
        genderModel = "models/gender_net.caffemodel"

        self.MODEL_MEAN_VALUES = (78.4263377603, 87.7689143744, 114.895847746)
        self.ageList = ['(0-2)', '(4-6)', '(8-12)', '(15-20)', '(25-32)', '(38-43)', '(48-53)', '(60-100)']
        self.genderList = ['Male', 'Female']

        # Load network
        self.ageNet = cv2.dnn.readNet(ageModel, ageProto)
        self.genderNet = cv2.dnn.readNet(genderModel, genderProto)
        self.faceNet = cv2.dnn.readNet(faceModel, faceProto)
        # self.dlib_facelandmark = dlib.shape_predictor("shape_predictor_68_face_landmarks_GTX.dat")

        self.padding = 20
        # self.padding = 0
        # name = download()
        # print(name)
        self.landmarks = dlib.shape_predictor('shape_predictor_68_face_landmarks_GTX.dat')



    def getFaceBox(self, net, frame, conf_threshold=0.7):
        frameOpencvDnn = frame.copy()
        frameHeight = frameOpencvDnn.shape[0]
        frameWidth = frameOpencvDnn.shape[1]
        blob = cv2.dnn.blobFromImage(frameOpencvDnn, 1.0, (300, 300), [104, 117, 123], True, False)

        net.setInput(blob)
        detections = net.forward()
        bboxes = []
        for i in range(detections.shape[2]):
            confidence = detections[0, 0, i, 2]
            if confidence > conf_threshold:
                x1 = int(detections[0, 0, i, 3] * frameWidth)
                y1 = int(detections[0, 0, i, 4] * frameHeight)
                x2 = int(detections[0, 0, i, 5] * frameWidth)
                y2 = int(detections[0, 0, i, 6] * frameHeight)
                bboxes.append([x1, y1, x2, y2])
                # cv2.rectangle(frameOpencvDnn, (x1, y1), (x2, y2), (0, 255, 0), int(round(frameHeight / 150)), 8)
        return frameOpencvDnn, bboxes

    def show_raw_detection(self, image, rect, gray, i):
        # gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # determine the facial landmarks for the face region, then
        # convert the facial landmark (x, y)-coordinates to a NumPy
        # array
        shape = self.landmarks(gray, rect)
        shape = face_utils.shape_to_np(shape)
        # print('shape:', shape)

        # convert dlib's rectangle to a OpenCV-style bounding box
        # [i.e., (x, y, w, h)], then draw the face bounding box
        (x, y, w, h) = face_utils.rect_to_bb(rect)

        cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)

        # show the face number
        cv2.putText(image, "Face #{}".format(i + 1), (x - 10, y - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        # loop over the (x, y)-coordinates for the facial landmarks
        # and draw them on the image
        for (x, y) in shape:
            # cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)
            # cv2.circle(image, (x - w, y - h), 1, (0, 0, 255), -1)
            cv2.circle(image, (x, y), 1, (0, 0, 255), -1)
        return shape


    def visualize_facial_landmarks(self, img, landmarks, shape):
        # create two copies of the input image -- one for the
        # overlay and one for the final output image
        # overlay = image.copy()
        output = img.copy()

        # if the colors list is None, initialize it with a unique
        # color for each facial landmark region
        # if colors is None:
        colors = [(19, 199, 109), (79, 76, 240), (230, 159, 23),
            (168, 100, 168), (158, 163, 32),
            (163, 38, 32), (180, 42, 220), (0, 0, 255)]
        #
        # # loop over the facial landmark regions individually
        for (i, name) in enumerate(self.FACIAL_LANDMARKS_68_IDXS.keys()):
        #     # grab the (x, y)-coordinates associated with the
        #     # face landmark
            (j, k) = self.FACIAL_LANDMARKS_68_IDXS[name]
            pts = shape[j:k]

            # check if are supposed to draw the jawline
            jaw = []
            if name == "jaw":
                # since the jawline is a non-enclosed facial region,
                # just draw lines between the (x, y)-coordinates
                for l in range(1, len(pts)):
                    ptA = tuple(pts[l - 1])
                    ptB = tuple(pts[l])
                    cv2.line(img, ptA, ptB, colors[i], 2)
                    # print('ptA, ptB, colors[i], 2', ptA, ptB, colors[i], 2)
                    jaw.append([ptA, ptB])

            # otherwise, compute the convex hull of the facial
            # landmark coordinates points and display it
            # else:
            hull = cv2.convexHull(pts)
            cv2.drawContours(img, [hull], -1, colors[i], -1)
            # print('img, [hull], -1, colors[i], -1', img, [hull], -1, colors[i], -1)
            face_regions = {'faceRegion':[hull], 'faceRegionColor':colors[i], 'jawLine':jaw}

        # apply the transparent overlay
        cv2.addWeighted(img, 0.70, output, 1 - 0.7, 0, output)

        # return the output image
        return face_regions