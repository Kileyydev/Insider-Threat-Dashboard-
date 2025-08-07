from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    home_view,
    login_view,
    verify_otp_view,
    EmployeeDetailsViewSet,
    GroupViewSet,
    add_employee,
)

router = DefaultRouter()
router.register(r'employees', EmployeeDetailsViewSet, basename='employee')
router.register(r'groups', GroupViewSet, basename='group')

urlpatterns = [
    path('', home_view, name='home'),
    path('login/', login_view, name='login'),
    path('verify-otp/', verify_otp_view, name='verify-otp'),
    path('', include(router.urls)),
    
    # Optional: add employee using a function-based view
    path('employees/add/', add_employee, name='add-employee'),
]

