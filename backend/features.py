import numpy as np
import cv2

from os.path import dirname, join


class Features():
    def __init__(self):
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

        self.padding = 20


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

