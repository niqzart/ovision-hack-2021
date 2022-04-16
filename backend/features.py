import numpy as np
import cv2

from os.path import dirname, join


class Features():
    def __init__(self):
        faceProto = "models3/opencv_face_detector.pbtxt"
        faceModel = "models3/opencv_face_detector_uint8.pb"

        ageProto = "models3/age_deploy.prototxt"
        ageModel = "models3/age_net.caffemodel"

        genderProto = "models3/gender_deploy.prototxt"
        genderModel = "models3/gender_net.caffemodel"

        self.MODEL_MEAN_VALUES = (78.4263377603, 87.7689143744, 114.895847746)
        self.ageList = ['(0-2)', '(4-6)', '(8-12)', '(15-20)', '(25-32)', '(38-43)', '(48-53)', '(60-100)']
        self.genderList = ['Male', 'Female']

        # Load network
        self.ageNet = cv2.dnn.readNet(ageModel, ageProto)
        self.genderNet = cv2.dnn.readNet(genderModel, genderProto)
        self.faceNet = cv2.dnn.readNet(faceModel, faceProto)

        self.padding = 20


    # def get_frame(self):
    #     success, image = self.video.read()
    #     image = cv2.resize(image, None, fx=ds_factor, fy=ds_factor, interpolation=cv2.INTER_AREA)
    #     gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    #     face_rects = face_cascade.detectMultiScale(gray, 1.3, 5)
    #     for (x, y, w, h) in face_rects:
    #         cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)
    #         break
    #     ret, jpeg = cv2.imencode('.jpg', image)
    #     return jpeg.tobytes()

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



    # def predict_age(self, img):
    #     # """Predict the age of the faces showing in the image"""
    #     #
    #     # # create a new cam object
    #     # cap = cv2.VideoCapture(0)
    #     #
    #     # while True:
    #     #     _, img = cap.read()
    #     #     # Take a copy of the initial image and resize it
    #     frame = img.copy()
    #     if frame.shape[1] > frame_width:
    #         frame = image_resize(frame, width=frame_width)
    #     faces = get_faces(frame)
    #     for i, (start_x, start_y, end_x, end_y) in enumerate(faces):
    #         face_img = frame[start_y: end_y, start_x: end_x]
    #         # image --> Input image to preprocess before passing it through our dnn for classification.
    #         blob = cv2.dnn.blobFromImage(
    #             image=face_img, scalefactor=1.0, size=(227, 227),
    #             mean=MODEL_MEAN_VALUES, swapRB=False
    #         )
    #         # Predict Age
    #         age_net.setInput(blob)
    #         age_preds = age_net.forward()
    #         print("=" * 30, f"Face {i + 1} Prediction Probabilities", "=" * 30)
    #         for i in range(age_preds[0].shape[0]):
    #             print(f"{AGE_INTERVALS[i]}: {age_preds[0, i] * 100:.2f}%")
    #         i = age_preds[0].argmax()
    #         age = AGE_INTERVALS[i]
    #         age_confidence_score = age_preds[0][i]
    #         # Draw the box
    #         label = f"Age:{age} - {age_confidence_score * 100:.2f}%"
    #         print(label)
    #         # get the position where to put the text
    #         yPos = start_y - 15
    #         while yPos < 15:
    #             yPos += 15
    #         # write the text into the frame
    #         cv2.putText(frame, label, (start_x, yPos),
    #                     cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), thickness=2)
    #         # draw the rectangle around the face
    #         cv2.rectangle(frame, (start_x, start_y), (end_x, end_y), color=(255, 0, 0), thickness=2)
    #     # Display processed image
    #     cv2.imshow('Age Estimator', frame)
    #     #     if cv2.waitKey(1) == ord("q"):
    #     #         break
    #     #     # save the image if you want
    #     #     # cv2.imwrite("predicted_age.jpg", frame)
    #     # cv2.destroyAllWindows()
