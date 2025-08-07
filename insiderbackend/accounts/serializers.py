from rest_framework import serializers
from django.contrib.auth.models import User
from .models import EmployeeDetails, Group

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class EmployeeDetailsSerializer(serializers.ModelSerializer):
    employee = UserSerializer()

    class Meta:
        model = EmployeeDetails
        fields = '__all__'

    def create(self, validated_data):
        user_data = validated_data.pop('employee')
        user = UserSerializer().create(user_data)
        employee = EmployeeDetails.objects.create(employee=user, **validated_data)
        return employee

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'
