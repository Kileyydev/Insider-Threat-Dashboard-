from rest_framework import serializers
from .models import Department, Resource
from users.models import User

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name']

class ResourceSerializer(serializers.ModelSerializer):
    department = serializers.StringRelatedField()
    access_level = serializers.SerializerMethodField()

    class Meta:
        model = Resource
        fields = ['id', 'name', 'path', 'is_folder', 'department', 'access_level', 'permissions', 'permission_string']
        
        

    def get_access_level(self, obj):
        request = self.context.get('request', None)
        if request is None:
            # Defensive fallback if context['request'] is missing
            return 'none'
        

        user = request.user
        access = obj.resourceaccess_set.filter(user=user).order_by('-access_level').first()
        return access.access_level if access else 'none'
    
    def validate_permissions(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("Permissions must be a dictionary.")
        return value

def validate_permission_string(self, value):
        if not isinstance(value, str):
            raise serializers.ValidationError("permission_string must be a string.")
        return value

class UserSerializer(serializers.ModelSerializer):
    department = serializers.CharField(source='department.name', default=None, read_only=True)
    # Add other fields like role if you have those in your user model

    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'department', 'is_staff', 'is_superuser']
