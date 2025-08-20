from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.models import Group
from django.core.mail import send_mail
from django.http import FileResponse, Http404, JsonResponse
from django.utils.crypto import get_random_string
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from rest_framework import status, permissions, generics, viewsets, serializers
from datetime import timedelta
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from django.utils import timezone
from django.middleware.csrf import get_token
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Resource, AccessControl
from .serializers import UserSerializer, ResourceSerializer, AccessControlSerializer
from .models import User, OTP, Resource, AuditLog, Department, Role
from rest_framework.serializers import ModelSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q
from .permissions import RoleEnforcer
from .models import ResourceAccess
from django.db import transaction

import os
import logging

logger = logging.getLogger(__name__)

ACCESS_PRIORITY = {"read": 1, "write": 2, "delete": 3, "none": 4,  "upload": 5,"download": 6,"full_control": 7}

User = get_user_model()

# ----------------------------------
# USER MANAGEMENT
# ----------------------------------
@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def list_users(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                group_name = request.data.get('group')
                if group_name:
                    group, _ = Group.objects.get_or_create(name=group_name)
                    user.groups.add(group)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                logger.error(f"Error creating user: {e}", exc_info=True)
                return Response({'detail': 'Server error while creating user'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({'detail': 'Validation error', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)



# Helper: generate JWT tokens for user
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {'refresh': str(refresh), 'access': str(refresh.access_token)}

def log_action(actor, action, resource=None, ip=None, metadata=None):
    AuditLog.objects.create(actor=actor, action=action, resource=resource, ip_address=ip, metadata=metadata or {})

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def user_detail(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response({'detail': 'Validation error', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ----------------------------------
# OTP LOGIN
# ----------------------------------

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@csrf_exempt
def login_send_otp(request):
    email = request.data.get('email')
    if not email:
        return Response({'detail': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    otp_code = get_random_string(length=6, allowed_chars='0123456789')

    # Create OTP record with expiry (e.g., 5 minutes from now)
    otp_instance = OTP.objects.create(
        user=user,
        code=otp_code,
        expires_at=timezone.now() + timedelta(minutes=5)
    )

    try:
        send_mail(
            'Your OTP Code',
            f'Your OTP code is: {otp_code}',
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        return Response({'detail': 'OTP sent successfully'})
    except Exception as e:
        logger.error(f"OTP email send failed: {e}", exc_info=True)
        # Optional: delete OTP record if email send failed
        otp_instance.delete()
        return Response({'detail': 'Failed to send OTP'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])  # Allow unauthenticated access here
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login_verify_otp(request):
    email = request.data.get('email')
    otp_code = request.data.get('otp')

    if not email or not otp_code:
        return Response({'detail': 'Email and OTP are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # Find a valid OTP record for this user with matching code and not expired
    otp_instance = OTP.objects.filter(user=user, code=otp_code, expires_at__gte=timezone.now()).first()

    if not otp_instance:
        return Response({'detail': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)

    # OTP is valid, so delete it (or you can mark it used in your model)
    otp_instance.delete()

    # You may want to set a flag on user or issue a token here, for now:
    return Response({'detail': 'OTP verified successfully'}, status=status.HTTP_200_OK)

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def verify_otp_and_token(request):
    try:
        email = request.data.get('email')
        code = request.data.get('otp')

        if not email or not code:
            return Response({'detail': 'Email and OTP are required'}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, email=email)

        otp = OTP.objects.filter(user=user, code=code).latest('created_at')

        if not otp.is_valid():
            return Response({'detail': 'OTP expired or invalid'}, status=status.HTTP_400_BAD_REQUEST)

        tokens = get_tokens_for_user(user)

        log_action(user, 'otp_verified', ip=request.META.get('REMOTE_ADDR'))

        return Response({'tokens': tokens, 'user': UserSerializer(user).data})

    except OTP.DoesNotExist:
        return Response({'detail': 'OTP not found'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Error in verify_otp_and_token: {e}", exc_info=True)
        return Response({'detail': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# ----------------------------------
# RESOURCE ACCESS
# ----------------------------------
def highest_access_level_for_user_and_resource(user, resource):
    levels = []

    try:
        if user.department and resource.department and user.department == resource.department:
            levels += list(AccessControl.objects.filter(
                resource=resource, group__in=user.groups.all()
            ).values_list('access_level', flat=True))

        levels += list(AccessControl.objects.filter(
            resource=resource, group__in=user.groups.all(), department__isnull=True
        ).values_list('access_level', flat=True))

    except Exception as e:
        logger.error(f"Error checking access levels: {e}", exc_info=True)

    return max(levels, key=lambda l: ACCESS_PRIORITY.get(l, 0), default=None)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def serve_resource(request, resource_id):
    try:
        resource = Resource.objects.get(pk=resource_id)
    except Resource.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    access_level = highest_access_level_for_user_and_resource(request.user, resource)
    if not access_level:
        return Response({'detail': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

    file_path = os.path.join(settings.MEDIA_ROOT, resource.path)
    if not os.path.exists(file_path):
        return Response({'detail': 'File not found'}, status=status.HTTP_404_NOT_FOUND)

    return FileResponse(open(file_path, 'rb'))


# ----------------------------------
# RESOURCES MANAGEMENT
# ----------------------------------
@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def list_resources(request):
    if request.method == 'GET':
        resources = Resource.objects.all()
        serializer = ResourceSerializer(resources, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ResourceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'detail': 'Validation error', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def resource_detail(request, pk):
    try:
        resource = Resource.objects.get(pk=pk)
    except Resource.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ResourceSerializer(resource)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ResourceSerializer(resource, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response({'detail': 'Validation error', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        resource.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def csrf_token_view(request):
    return JsonResponse({'csrfToken': get_token(request)})


@ensure_csrf_cookie
def get_csrf(request):
    return JsonResponse({'detail': 'CSRF cookie set'})


class GroupSerializer(ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']

class GroupListAPIView(generics.ListAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def department_resources(request):
    data = {
        "department": "IT",
        "resources": [
            {"id": 1, "name": "Resource A", "type": "Document"},
            {"id": 2, "name": "Resource B", "type": "Tool"},
        ]
    }
    return Response(data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def upload_resource(request):
    if 'file' in request.FILES:
        uploaded_file = request.FILES['file']
        # TODO: Save the uploaded file properly
        return Response(
            {"message": f"File '{uploaded_file.name}' uploaded successfully"},
            status=status.HTTP_201_CREATED
        )
    return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def assign_resource_access(request):
    user_id = request.data.get("user_id")
    resource_id = request.data.get("resource_id")

    if not user_id or not resource_id:
        return Response({"error": "user_id and resource_id are required"}, status=status.HTTP_400_BAD_REQUEST)

    # TODO: Implement access assignment logic
    return Response({"message": f"Resource {resource_id} assigned to user {user_id}"}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def download_resource(request, pk):
    resource = get_object_or_404(Resource, pk=pk)

    perm = RoleEnforcer()
    # has_object_permission returns True/False
    if not perm.has_object_permission(request, None, resource):
        return Response({'detail': 'Access denied'}, status=403)

    file_path = os.path.join(settings.MEDIA_ROOT, resource.path)
    if not os.path.exists(file_path):
        return Response({'detail': 'File not found'}, status=404)

    # Log download
    log_action(request.user, 'download_resource', resource=resource, ip=request.META.get('REMOTE_ADDR'))
    return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=resource.name)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def audit_logs(request):
    logs = AuditLog.objects.all().order_by('-timestamp')  # fetch real logs, newest first
    serializer = AuditLogSerializer(logs, many=True)
    return Response({"audit_logs": serializer.data})

class AuditLogSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='actor.email')  # adjust if your AuditLog has an actor FK to User

    class Meta:
        model = AuditLog
        fields = ['user', 'action', 'timestamp']  # or your real model fields

@api_view(['PUT', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def list_groups(request):
    groups = Group.objects.all()
    serializer = GroupSerializer(groups, many=True)
    return Response(serializer.data)

class ResourceViewSet(viewsets.ModelViewSet):

    """
    Full CRUD for Resource with RBAC enforced by RoleEnforcer.
    """
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticated, RoleEnforcer]



    @transaction.atomic
    def perform_create(self, serializer):
        user = self.request.user

        # Ensure department is set (as previous guidance)
        dept = getattr(user, 'department', None)
        if dept is None:
            from .models import Department
            dept, _ = Department.objects.get_or_create(name='IT')

        resource = serializer.save(created_by=user, department=dept)

        # Create role-based ResourceAccess defaults if desired (optional):
        # e.g., ensure managers get write, employees get read - implement as you wish

        # Always give owner full_control via ResourceAccess (user-specific)
        ResourceAccess.objects.create(
            resource=resource,
            role=None,   # null role to indicate user-specific? If your model requires role non-null, skip role and set user on AccessControl below
            # If your ResourceAccess requires role non-null, instead create AccessControl for the user:
        )

        # Create AccessControl (user-specific) giving owner full control
        from .models import AccessControl
        AccessControl.objects.create(user=user, resource=resource, permission='full_control')

        log_action(user, 'create_resource', resource=resource, ip=self.request.META.get('REMOTE_ADDR'))
        return resource


    def retrieve(self, request, *args, **kwargs):
        # object-level permission will be checked by RoleEnforcer.has_object_permission
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        # Log the access (view)
        log_action(request.user, 'view_resource', resource=instance, ip=request.META.get('REMOTE_ADDR'))
        # Optionally record a download if file served separately
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # will call permission checks
        log_action(request.user, 'delete_resource', resource=instance, ip=request.META.get('REMOTE_ADDR'))
        return super().destroy(request, *args, **kwargs)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_resource(request, pk):
    try:
        resource = Resource.objects.get(pk=pk)
    except Resource.DoesNotExist:
        return Response({'error': 'Resource not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        resource.delete()
        log_action(request.user, 'delete_resource', resource=resource, ip=request.META.get('REMOTE_ADDR'))
        return Response(status=status.HTTP_204_NO_CONTENT)

    return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_resource(request, pk):
    try:
        resource = Resource.objects.get(pk=pk)
    except Resource.DoesNotExist:
        return Response({'error': 'Resource not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ResourceSerializer(resource, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        log_action(request.user, 'update_resource', resource=resource, ip=request.META.get('REMOTE_ADDR'))
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'PATCH'])
def update_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data)
    elif request.method == 'PATCH':
        serializer = UserSerializer(user, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

# users/views.py
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_resource_access(request):
    """
    Payload:
    {
      "resource_id": 1,
      "role_id": 2,        # optional (role-level)
      "user_id": 3,        # optional (user-level)
      "permission": "read" # or full_control/write/delete/none
    }
    """
    user = request.user
    data = request.data
    resource_id = data.get('resource_id')
    role_id = data.get('role_id')
    user_id = data.get('user_id')
    permission = data.get('permission')

    if not resource_id or not permission:
        return Response({"error": "resource_id and permission required"}, status=400)

    resource = get_object_or_404(Resource, pk=resource_id)

    # Only allow owner or manager or superuser to assign access
    perm_checker = RoleEnforcer()
    if not (user.is_superuser or resource.created_by_id == user.id or getattr(user.role,'level',0) >= 3):
        return Response({"detail":"Not allowed"}, status=403)

    if role_id:
        role = get_object_or_404(Role, pk=role_id)
        ra, created = ResourceAccess.objects.update_or_create(resource=resource, role=role,
                                                            defaults={'access_level': permission})
        action = 'created' if created else 'updated'
        log_action(user, f'assign_role_access_{action}', resource=resource, metadata={'role': role.name, 'perm': permission})
        return Response({"detail": f"Role access {action}"}, status=200)

    if user_id:
        tuser = get_object_or_404(User, pk=user_id)
        ac, created = AccessControl.objects.update_or_create(user=tuser, resource=resource, defaults={'permission': permission})
        action = 'created' if created else 'updated'
        log_action(user, f'assign_user_access_{action}', resource=resource, metadata={'user': tuser.email, 'perm': permission})
        return Response({"detail": f"User access {action}"}, status=200)

    return Response({"detail":"role_id or user_id required"}, status=400)
