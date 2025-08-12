from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Alert(models.Model):
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    description = models.TextField()
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES, default='medium')
    cleared = models.BooleanField(default=False)  # Add this!

    def __str__(self):
        return f"{self.timestamp}: {self.user.email} - {self.action} ({self.severity})"
