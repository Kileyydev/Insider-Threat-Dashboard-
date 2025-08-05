from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class AccessPolicy(models.Model):
    policy_id = models.CharField(max_length=255, unique=True)
    employee_id = models.ForeignKey(User, on_delete=models.CASCADE)
    resource_id = models.ForeignKey('resources.Resource', on_delete=models.CASCADE)
    resource_name = models.CharField(max_length=255)
    allowed_actions = models.CharField(max_length=50)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.employee_id.username} - {self.resource} - {self.allowed_actions}"

class Anomaly(models.Model):
    anomaly_id = models.CharField(max_length=255, unique=True)
    employee_id = models.ForeignKey(User, on_delete=models.CASCADE)
    resource_id = models.ForeignKey('resources.Resource', on_delete=models.CASCADE)
    detection_method = models.CharField(max_length=255)
    detected_at = models.DateTimeField(default=timezone.now)
    severity = models.CharField(max_length=50, choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')])
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.anomaly_id} - {self.employee_id.username} - {self.severity} - {self.detected_at.strftime('%Y-%m-%d %H:%M:%S')}"

class Alert(models.Model):
    alert_id = models.CharField(max_length=255, unique=True)
    employee_id = models.ForeignKey(User, on_delete=models.CASCADE)
    anomaly_id = models.ForeignKey('Anomaly', on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    resolved = models.BooleanField(default=False)
    status = models.CharField(max_length=50, default='open')
    description = models.TextField(blank=True, null=True)    
