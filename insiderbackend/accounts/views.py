from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import authentication_classes
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework import viewsets, permissions, status
from rest_framework.permissions import IsAdminUser

from .models import OTP, EmployeeDetails, Group
from .serializers import EmployeeDetailsSerializer, GroupSerializer

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

# Login API View (Email + Password → Sends OTP)
@csrf_exempt
@require_http_methods(["POST"])
def login_view(request):
    email = request.POST.get('email')
    password = request.POST.get('password')

    if not email or not password:
        return JsonResponse({'success': False, 'message': 'Email and password are required'}, status=400)

    try:
        user = User.objects.get(email=email)
        user_auth = authenticate(username=user.username, password=password)
        if user_auth:
            otp_obj, _ = OTP.objects.get_or_create(employee=user)
            otp_obj.save()

            send_mail(
                'Your OTP Code',
                f'Your OTP is {otp_obj.code}',
                'admin@insiderdash.com',
                [user.email],
                fail_silently=False,
            )

            request.session['user_id'] = user.id
            return JsonResponse({'success': True, 'message': 'OTP sent to your email'})
        else:
            return JsonResponse({'success': False, 'message': 'Invalid credentials'}, status=401)
    except User.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'User not found'}, status=404)


# OTP Verification API View
@csrf_exempt
@require_http_methods(["POST"])
def verify_otp_view(request):
    otp = request.POST.get('otp')
    user_id = request.session.get('user_id')

    if not otp:
        return JsonResponse({'success': False, 'message': 'OTP is required'}, status=400)

    if not user_id:
        return JsonResponse({'success': False, 'message': 'Session expired. Please login again.'}, status=403)

    try:
        user = User.objects.get(id=user_id)
        otp_obj = OTP.objects.get(employee=user)

        if otp_obj.code == otp:
            login(request, user)
            otp_obj.delete()
            return JsonResponse({'success': True, 'message': 'Login successful'})
        else:
            return JsonResponse({'success': False, 'message': 'Invalid OTP'}, status=401)
    except (User.DoesNotExist, OTP.DoesNotExist):
        return JsonResponse({'success': False, 'message': 'OTP validation failed'}, status=400)


# Home View (Optional)
def home_view(request):
    return HttpResponse("Welcome to the Insider Threat Dashboard Backend!")


# 👤✅ Authenticated User List API Endpoint (for frontend)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_list(request):
    users = User.objects.all()
    data = []
    for user in users:
        try:
            details = EmployeeDetails.objects.get(employee=user)
            group = details.group.name if details.group else None
            department = details.department
        except EmployeeDetails.DoesNotExist:
            group = None
            department = None

        data.append({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'group': group,
            'department': department,
        })
    return Response(data)


# 🔐 DRF ViewSets for EmployeeDetails and Groups
class EmployeeDetailsViewSet(viewsets.ModelViewSet):
    queryset = EmployeeDetails.objects.all()
    serializer_class = EmployeeDetailsSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminUser]  # ✅ Only admin can create

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.prefetch_related('employees').all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]

from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

@csrf_exempt
def user_list_view(request):
    if request.method == 'GET':
        users = User.objects.all().values('id', 'username', 'email', 'is_staff', 'is_superuser', 'last_login')
        return JsonResponse(list(users), safe=False)
    return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=405)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def add_employee(request):
    serializer = EmployeeDetailsSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    else:
        print(serializer.errors)  # <-- Add this to see errors in your server logs
        return Response(serializer.errors, status=400)

