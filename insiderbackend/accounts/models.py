from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import random
from rules_and_detection.rules_and_policies.department_roles import EmployeesRoles, departments

DEPARTMENT_CHOICES = [(key, value) for key, value in departments.items()]
ROLE_CHOICES = [(role, role.replace('_', ' ').title()) 
                for dept in EmployeesRoles.values() for role in dept['roles']]

class EmployeeProfile(models.Model):
    employee= models.ForeignKey(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    def __str__(self):
        return self.employee.username
class EmployeeDetails(models.Model):
    name= models.CharField(max_length=100, blank=True, null=True)
    department = models.CharField(max_length=100, choices=DEPARTMENT_CHOICES, default='not_assigned')
    role = models.CharField(max_length=100, choices=ROLE_CHOICES, default='not_assigned')
    created_at = models.DateTimeField(auto_now_add=True)
    password_hash = models.CharField(max_length=128, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    policy_id = models.CharField(max_length=100, blank=True, null=True)
    group_id = models.ForeignKey('accounts.Group', on_delete=models.CASCADE, blank=True, null=True, related_name='group_members')
    last_login = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    employee = models.OneToOneField(User, on_delete=models.CASCADE, related_name='details')
   

    def __str__(self):
        return self.name if self.name else self.employee.username

class Group(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    employees = models.ManyToManyField('accounts.EmployeeDetails', related_name='groups', blank=True)

    def __str__(self):
        return self.name

def generate_otp():
    return str(random.randint(100000, 999999))
class OTP(models.Model):
    employee = models.OneToOneField(User, on_delete=models.CASCADE)    
    code = models.CharField(max_length=6, default=generate_otp)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"OTP for {self.employee.username}"

class ActivityLog(models.Model):
    action_type = models.CharField(max_length=255)
    accessed_at = models.DateTimeField(default=timezone.now)
    resource = models.CharField(max_length=255, blank=True, null=True)
    activity_id = models.CharField(max_length=255, unique=True)
    device_info = models.CharField(max_length=255, blank=True, null=True)
    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activity_logs')
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)


    def __str__(self):
        return f"{self.employee.username} - {self.action_type} - {self.accessed_at.strftime('%Y-%m-%d %H:%M:%S')}"