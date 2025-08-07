from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class AccessPolicy(models.Model):
    POLICY_TYPES = [
        ('RBAC', 'Role-Based Access Control'),
        ('MAC', 'Mandatory Access Control'),
        ('DAC', 'Discretionary Access Control'),
        ('CUSTOM', 'Custom Policy')
    ]
    policy_name = models.CharField(max_length=255, unique=True)
    policy_type = models.CharField(max_length=50, choices=POLICY_TYPES, default='RBAC')
    policy_id = models.CharField(max_length=255, unique=True)
    employee_id = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='access_policies')
    resource_id = models.ForeignKey('resources.Resource', on_delete=models.CASCADE, related_name='access_policies', null=True, blank=True)
    resource_name = models.ForeignKey('resources.Resource', on_delete=models.CASCADE, related_name='name', null=True, blank=True)
    allowed_actions = models.CharField(max_length=50)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.employee_id.username} - {self.resource_name} - {self.allowed_actions}"

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
