from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model

from .models import Department, Resource, ResourceAccess
from .serializers import DepartmentSerializer, ResourceSerializer, UserSerializer
from files.utils import highest_access_level_for_user_and_resource, log_action

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_departments(request):
    """
    List all departments.
    """
    departments = Department.objects.all()
    serializer = DepartmentSerializer(departments, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def department_resources(request):
    user = request.user

    if user.is_staff or user.is_superuser:
        # Admins see all resources
        resources = Resource.objects.all().order_by('is_folder', 'name')
    else:
        if not user.department:
            return Response({'detail': 'No department assigned'}, status=status.HTTP_400_BAD_REQUEST)
        resources = Resource.objects.filter(department=user.department).order_by('is_folder', 'name')

    # Filter by access level for this user
    allowed_resources = [r for r in resources if highest_access_level_for_user_and_resource(user, r)]

    log_action(user, 'list_department_resources', ip=request.META.get('REMOTE_ADDR'))

    serializer = ResourceSerializer(allowed_resources, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_users(request):
    """
    List all users.
    System admins see all users.
    Normal users can only see their own info or users in their department (optional).
    """
    user = request.user

    if user.is_staff or user.is_superuser:
        users = User.objects.all()
    else:
        if not user.department:
            return Response({'detail': 'No department assigned'}, status=status.HTTP_400_BAD_REQUEST)
        # Optionally restrict normal users to see only users in their department:
        users = User.objects.filter(department=user.department)

    serializer = UserSerializer(users, many=True)
    log_action(user, 'list_users', ip=request.META.get('REMOTE_ADDR'))
    return Response(serializer.data)


# You can add more views as needed for user creation, updating, etc.

