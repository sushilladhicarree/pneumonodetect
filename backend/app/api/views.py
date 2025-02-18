from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from app.models import Customer, Report
from .serializers import CustomerSerializer, ReportSerializer
from rest_framework.decorators import action

#Authentication and Login/Logout
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt


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

class CustomerView(viewsets.ModelViewSet):
    # queryset=Customer.objects.all()
    serializer_class=CustomerSerializer
    permission_classes = [IsAuthenticated]

    @csrf_exempt
    def get_queryset(self):
    # Filter reports for customers belonging to the logged-in user
        customer=Customer.objects.filter(user=self.request.user)
        # customer = get_object_or_404(Customer, user=self.request.user)
        return customer

    @csrf_exempt
    def create(self, request, *args, **kwargs):
        # Use the serializer to validate and save the data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=self.request.user)
        
        # Print custom message to the terminal
        print("Posted successfully")

        print("FILES content:", request.FILES)


        # Fetch the uploaded image from the request
        f = request.FILES['xray_image']
        # customer_id = request.data.get('customer_id')
        # print("Customer ID received:", customer_id)
        # id=request.data.get('id')
        # print("Id received:", id)
        # customer = get_object_or_404(Customer, id=customer_id)

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
        res = get_className(value)  #result
        print("Result retrieved as", res)

        final_result={ "result": res}

        email=request.data.get("email")
        print(email)
        customer=get_object_or_404(Customer.objects.filter(email=email))

        report = Report.objects.create(
            customer=customer,
            result=res,
        )

        
        # # Return the response with the serialized data
        # headers = self.get_success_headers(serializer.data)
        # return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        return Response(final_result, status=status.HTTP_200_OK)
    
    
    # Custom action for searching by name
    @action(detail=False, methods=['get'])
    @csrf_exempt
    def search(self, request):
        # Get the 'name' query parameter from the request
        name = request.query_params.get('name', None)
        
        if name:
            # Perform case-insensitive search for matching names
            customers = Customer.objects.filter(user=request.user, name__icontains=name)
            if customers.exists():
                serializer = CustomerSerializer(customers, many=True)
                return Response(serializer.data)
            else:
                return Response({"detail": "No customers found with the given name."}, status=404)
        else:
            return Response({"detail": "Name query parameter is required."}, status=400)
    

# class ReportView(viewsets.ModelViewSet):
#     queryset=Report.objects.all()
#     serializer_class=ReportSerializer

class ReportView(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]  # Require login to access reports

    @csrf_exempt
    def get_queryset(self):
        # Fetch all customers linked to the logged-in user
        customers = Customer.objects.filter(user=self.request.user)
        # Retrieve all reports for these customers
        return Report.objects.filter(customer__in=customers)


#Authentication and Login/Logout
class LoginView(APIView):
    @csrf_exempt
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        # Use Django's built-in authenticate function
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)  # Log the user in
            return JsonResponse({"detail": "Login successful", "username": user.username})
        else:
            return JsonResponse({"detail": "Invalid credentials"}, status=401)
        

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]  # User must be logged in to log out

    @csrf_exempt
    def post(self, request):
        logout(request)  # Log the user out
        return JsonResponse({"detail": "Logout successful"})
    

class ScansCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Get all customers for the logged-in user
        customers = Customer.objects.filter(user=request.user)
        # Count reports for these customers
        total_scans = Report.objects.filter(customer__in=customers).count()

        return Response({"total_scans": total_scans}, status=200)



from .serializers import UserSerializer 

class CurrentUserDetailsView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure only logged-in users can access this API

    def get(self, request, *args, **kwargs):
        # Serialize the currently logged-in user
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=200)
