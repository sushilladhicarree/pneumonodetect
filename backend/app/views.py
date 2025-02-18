from django.conf import settings
from django.shortcuts import render
# Create your views here.
import os
import numpy as np
from PIL import Image
import cv2
from werkzeug.utils import secure_filename
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Flatten, Dense, Dropout
from tensorflow.keras.applications import VGG19

base_model = VGG19(include_top=False, input_shape=(128, 128, 3))
x = base_model.output
flat = Flatten()(x)
class_1 = Dense(4608, activation='relu')(flat)
drop_out = Dropout(0.2)(class_1)
class_2 = Dense(1152, activation='relu')(drop_out)
output = Dense(2, activation='softmax')(class_2)
model_03 = Model(inputs=base_model.input, outputs=output)
model_03.load_weights('Deep Learning Model/vgg_unfrozen.keras')

# def index(request):
#     context={}
#     return render(request, 'index.html', context)

# def upload(request):
#     if request.method == "POST":
#      data=request.POST
#      recipe_image=request.FILES['file']

def get_className(classNo):
    if classNo == 0:
        return "Normal"
    elif classNo == 1:
        return "Pneumonia"

def getResult(img):
    image = cv2.imread(img)
    image = Image.fromarray(image, 'RGB')
    image = image.resize((128, 128))
    image = np.array(image)
    input_img = np.expand_dims(image, axis=0)
    result = model_03.predict(input_img)
    result01 = np.argmax(result, axis=1)
    return result01

def upload(request):
    if request.method == 'POST':
        f = request.FILES['file']
        basepath = os.path.dirname(__file__)
        # file_path = os.path.join(basepath, 'uploads', secure_filename(f.name))
        # # f.save(file_path)
        # with open(file_path, 'wb+') as destination:
        #     for chunk in f.chunks():
        #         destination.write(chunk)
        file_path = os.path.join(settings.MEDIA_ROOT, f.name)

        # Save the file to the specified path
        with open(file_path, 'wb+') as destination:
            for chunk in f.chunks():
                destination.write(chunk)

        print("Image Uploaded successfully")
        value = getResult(file_path)
        print("value retrieved as", value)
        result = get_className(value)
        print("Result retrieved as", result)
        return render(request, 'index.html', {'result': result})
    return render(request, 'index.html')
