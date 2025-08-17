from rest_framework import serializers
from .models import ResourceAccess
from users.models import Resource
from django.contrib.auth import get_user_model

User = get_user_model()

class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ('id', 'name', 'path', 'is_folder', 'department', 'created_by', 'created_at')
        read_only_fields = ('created_by', 'created_at')
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']

class ResourceAccessSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True
    )
    resource = ResourceSerializer(read_only=True)
    resource_id = serializers.PrimaryKeyRelatedField(
        queryset=Resource.objects.all(), source='resource', write_only=True
    )

    class Meta:
        model = ResourceAccess
        fields = ['id', 'user', 'user_id', 'resource', 'resource_id', 'access_level']
