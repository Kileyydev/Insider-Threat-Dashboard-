from django.contrib import admin
from .models import EmployeeDetails, EmployeeProfile, Group, OTP, ActivityLog

# Register models so they show up in /admin
@admin.register(EmployeeDetails)
class EmployeeDetailsAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'department', 'role', 'created_at']
    search_fields = ['name', 'email', 'department', 'role']
    list_filter = ['department', 'role']

@admin.register(EmployeeProfile)
class EmployeeProfileAdmin(admin.ModelAdmin):
    list_display = ['employee', 'bio']

@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']

@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ['employee', 'code', 'created_at']

@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ['employee', 'action_type', 'accessed_at', 'resource']
    search_fields = ['employee__username', 'action_type', 'resource']
