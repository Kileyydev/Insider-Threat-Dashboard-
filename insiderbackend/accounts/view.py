from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.core.mail import send_mail
from .models import OTP
from .forms import LoginForm, OTPForm

def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
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
                    return redirect('verify-otp')
                else:
                    form.add_error(None, 'Invalid credentials')
            except User.DoesNotExist:
                form.add_error('email', 'User not found')
    else:
        form = LoginForm()
    return render(request, 'accounts/login.html', {'form': form})

def verify_otp_view(request):
    user_id = request.session.get('user_id')
    if not user_id:
        return redirect('login')

    user = User.objects.get(id=user_id)

    if request.method == 'POST':
        form = OTPForm(request.POST)
        if form.is_valid():
            code = form.cleaned_data['otp']
            otp_obj = OTP.objects.get(user=user)
            if otp_obj.code == code:
                login(request, user)
                otp_obj.delete()
                return redirect('dashboard')  # Define this URL later
            else:
                form.add_error('otp', 'Invalid OTP')
    else:
        form = OTPForm()
    return render(request, 'accounts/verify_otp.html', {'form': form})
