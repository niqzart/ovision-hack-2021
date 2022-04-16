import cv2
from features import Features

fm = Features()

face_cascade=cv2.CascadeClassifier("models3/haarcascades.xml")
ds_factor=0.6

# def get_features(bboxes, frame, frameFace):
#
#     for bbox in bboxes:
#         # print(bbox)
#         face = frame[max(0,bbox[1]-fm.padding):min(bbox[3]+fm.padding,frame.shape[0]-1),max(0,bbox[0]-fm.padding):min(bbox[2]+fm.padding, frame.shape[1]-1)]
#
#         blob = cv2.dnn.blobFromImage(face, 1.0, (227, 227), fm.MODEL_MEAN_VALUES, swapRB=False)
#         fm.genderNet.setInput(blob)
#         genderPreds = fm.genderNet.forward()
#         gender = fm.genderList[genderPreds[0].argmax()]
#         # print("Gender Output : {}".format(genderPreds))
#         print("Gender : {}, conf = {:.3f}".format(gender, genderPreds[0].max()))
#
#         fm.ageNet.setInput(blob)
#         agePreds = fm.ageNet.forward()
#         age = fm.ageList[agePreds[0].argmax()]
#         print("Age Output : {}".format(agePreds))
#         print("Age : {}, conf = {:.3f}".format(age, agePreds[0].max()))
#
#         label = "{},{}".format(gender, age)
#         cv2.putText(frameFace, label, (bbox[0], bbox[1]-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2, cv2.LINE_AA)
#         # cv2.imshow("Age Gender Demo", frameFace)


class Camera(object):
    def __init__(self):
        self.video = cv2.VideoCapture(0)
    
    def __del__(self):
        self.video.release()
    
    def get_frame(self, ):
        success, image = self.video.read()
        frameFace, bboxes = fm.getFaceBox(fm.faceNet, image)
        json_features = self.get_features(bboxes, image, frameFace)

        image=cv2.resize(image,None,fx=ds_factor,fy=ds_factor,interpolation=cv2.INTER_AREA)
        gray=cv2.cvtColor(image,cv2.COLOR_BGR2GRAY)
        face_rects=face_cascade.detectMultiScale(gray,1.3,5)
        for (x,y,w,h) in face_rects:
            cv2.rectangle(image,(x,y),(x+w,y+h),(0,255,0),2)
            break
        ret, jpeg = cv2.imencode('.jpg', image)
        return jpeg.tobytes(), json_features

    def get_features(self, bboxes, frame, frameFace):

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
            return {'age':age, 'age_confidence':agePreds[0].max(), 'gender':gender, 'gender_confidence':genderPreds[0].max()}


