from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Resource(models.Model):
    resource_id = models.CharField(max_length=255, unique=True)
    resource = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    policy_id = models.ForeignKey('rules_and_detection.AccessPolicy', on_delete=models.CASCADE, blank=True, null=True, related_name='linked_resources')
    file = models.FileField(upload_to='resources/', blank=True, null=True)
    tags = models.CharField(max_length=255, blank=True, null=True)
    employee_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resources', blank=True, null=True)
    classification_level = models.CharField(max_length=50, choices=[
        ('public', 'Public'),
        ('internal', 'Internal'),
        ('confidential', 'Confidential'),
        ('secret', 'Secret'),
    ], default='public')

    def __str__(self):
        return f"{self.resource_name} - {self.resource_id} - {self.uploaded_by.username}"