from django.db import models
from django.contrib.auth.models import User
import random

def generate_otp():
    return str(random.randint(100000, 999999))

class OTP(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.code:
            self.code = generate_otp()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - OTP: {self.code}"
