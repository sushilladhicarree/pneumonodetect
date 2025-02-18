from rest_framework import serializers
from app.models import Customer, Report
from django.contrib.auth.models import User

class CustomerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model=Customer
        fields=('id','name', 'age', 'email', 'contact_number', 'xray_image')

class ReportSerializer(serializers.HyperlinkedModelSerializer):
    customer = CustomerSerializer()  # Using the nested serializer here


    class Meta:
        model=Report
        fields=('customer', 'result', 'report_date')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']  # Specify the fields to return