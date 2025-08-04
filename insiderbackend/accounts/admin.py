from django.contrib import admin
from .models import EmployeeProfile, EmployeeDetails, OTP

verbose_name = 'Accounts Management'
verbose_name_plural = 'Accounts Management'

# Register your models here.
admin.site.register(EmployeeProfile)
admin.site.register(EmployeeDetails)
admin.site.register(OTP)
