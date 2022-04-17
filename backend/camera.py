import cv2
from features import Features
import time
import dlib
import matplotlib.pyplot as plt

fm = Features()

face_cascade=cv2.CascadeClassifier("models/haarcascades.xml")
ds_factor=0.7


class Camera(object):
    # def __init__(self):
    #     # self.video = cv2.VideoCapture(0)
    #     self.video = images
    #
    # def __del__(self):
    #     self.video.release()
    
    def get_frame(self, img):
        success, image = plt.imread(img)
        start = time.time()
        frameFace, bboxes = fm.getFaceBox(fm.faceNet, image)
        json_features = self.get_features(bboxes, image)

        image=cv2.resize(image,None,fx=ds_factor,fy=ds_factor,interpolation=cv2.INTER_AREA)
        gray=cv2.cvtColor(image,cv2.COLOR_BGR2GRAY)
        face_rects=face_cascade.detectMultiScale(gray,1.1,50)
        print('here!!')
        # detector = dlib.get_frontal_face_detector()
        # det = detector(gray, 1)
        # rects = detector(gray, 1) #[[(348, 134) (669, 455)]]
        # print('rectsss', rects)
        # for (x,y,w,h) in face_rects:
        faces = []
        for (i, rect) in enumerate(face_rects):
            frameFace, bboxes = fm.getFaceBox(fm.faceNet, image)
            json_features = self.get_features(bboxes, image)
            print('rect', rect)
            # print('det', det)
            # print('i', i)

            left = rect[0]
            top = rect[1]
            right = left+rect[2]
            bottom = top+rect[3]
            rect_landmarks = dlib.rectangle(left, top, right, bottom)

            shape = fm.show_raw_detection(image, rect_landmarks, gray, i)
            json_features.update({'landmarks':shape})
            face_regions = fm.visualize_facial_landmarks(image, rect_landmarks, shape)
            json_features.update(face_regions)
            # print('face_regions', face_regions)
            # fm.show_raw_detection(image, det[0], gray, i)
            x, y, w, h = rect
            faces.append(json_features)

            # cv2.rectangle(image,(x,y),(x+w,y+h),(0,255,0),2)
            break
        ret, jpeg = cv2.imencode('.jpg', image)
        end = time.time()
        total = end - start
        print('total time:', total)

        return jpeg.tobytes(), faces

    def get_features(self, bboxes, frame):

        for bbox in bboxes:
            face = frame[max(0,bbox[1]-fm.padding):min(bbox[3]+fm.padding,frame.shape[0]-1),max(0,bbox[0]-fm.padding):min(bbox[2]+fm.padding, frame.shape[1]-1)]

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
            return {'age':age, 'ageConfidence':agePreds[0].max(), 'gender':gender, 'genderConfidence':genderPreds[0].max()}


