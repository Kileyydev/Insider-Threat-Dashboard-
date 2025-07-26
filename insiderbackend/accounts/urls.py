from django.urls import path
from .views import home_view, login_view, verify_otp_view

urlpatterns = [
    path('', home_view, name='home'),  # this handles /
    path('login/', login_view, name='login'),
    path('verify-otp/', verify_otp_view, name='verify-otp'),
]
