from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import OTP

# Login API View (Email + Password → Sends OTP)
@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        if not email or not password:
            return JsonResponse({'success': False, 'message': 'Email and password are required'}, status=400)

        try:
            user = User.objects.get(email=email)
            user_auth = authenticate(username=user.username, password=password)
            if user_auth:
                otp_obj, _ = OTP.objects.get_or_create(user=user)
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

    return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=405)


# OTP Verification API View
@csrf_exempt
def verify_otp_view(request):
    if request.method == 'POST':
        otp = request.POST.get('otp')
        user_id = request.session.get('user_id')

        if not otp:
            return JsonResponse({'success': False, 'message': 'OTP is required'}, status=400)

        if not user_id:
            return JsonResponse({'success': False, 'message': 'Session expired. Please login again.'}, status=403)

        try:
            user = User.objects.get(id=user_id)
            otp_obj = OTP.objects.get(user=user)

            if otp_obj.code == otp:
                login(request, user)
                otp_obj.delete()
                return JsonResponse({'success': True, 'message': 'Login successful'})
            else:
                return JsonResponse({'success': False, 'message': 'Invalid OTP'}, status=401)
        except (User.DoesNotExist, OTP.DoesNotExist):
            return JsonResponse({'success': False, 'message': 'OTP validation failed'}, status=400)

    return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=405)


# Home View (Optional)
def home_view(request):
    return HttpResponse("Welcome to the Insider Threat Dashboard Backend!")
