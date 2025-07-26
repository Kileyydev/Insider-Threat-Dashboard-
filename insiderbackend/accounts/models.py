from django.db import models
from django.contrib.auth.models import User
import random

def generate_otp():
    return str(random.randint(100000, 999999))

class OTP(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6, default=generate_otp)
    created_at = models.DateTimeField(auto_now_add=True)  # ✅ Fix here

    def __str__(self):
        return f"OTP for {self.user.username}"
