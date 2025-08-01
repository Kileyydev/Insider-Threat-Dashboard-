from django.db import models
from django.contrib.auth.models import User
import random

class EmployeeProfile(models.Model):
    employee= models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    def __str__(self):
        return self.employee.username
class EmployeeDetails(models.Model):
    name= models.CharField(max_length=100, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    role = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    password_hash = models.CharField(max_length=128, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    policy_id = models.CharField(max_length=100, blank=True, null=True)
    group = models.CharField(max_length=100, blank=True, null=True)
    employee = models.OneToOneField(User, on_delete=models.CASCADE, related_name='details')
    def __str__(self):
        return self.name if self.name else self.employee.username

def generate_otp():
    return str(random.randint(100000, 999999))

class OTP(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6, default=generate_otp)
    created_at = models.DateTimeField(auto_now_add=True)  # ✅ Fix here

    def __str__(self):
        return f"OTP for {self.user.username}"
