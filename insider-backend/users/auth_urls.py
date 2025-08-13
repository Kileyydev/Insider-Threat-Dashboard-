from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_send_otp, name='login_send_otp'),
    path('verify-otp/', views.verify_otp_and_token, name='verify_otp'),
    path('csrf/', views.csrf_token_view, name='csrf_token'),
    path('get-csrf/', views.get_csrf, name='get_csrf'),

]
