from django.db import models
from django.conf import settings
from django.contrib.auth.models import Group


class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Resource(models.Model):
    name = models.CharField(max_length=255)
    path = models.CharField(max_length=500, blank=True)
    is_folder = models.BooleanField(default=False)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='resources')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='created_resources')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({'Folder' if self.is_folder else 'File'})"

from django.contrib.auth.models import Group

class ResourceAccess(models.Model):
    ACCESS_CHOICES = [
        ('read', 'Read'),
        ('write', 'Write'),
        ('download', 'Download'),
    ]

    resource = models.ForeignKey(Resource, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, null=True, blank=True, on_delete=models.CASCADE)  # <== This field
    access_level = models.CharField(max_length=10, choices=ACCESS_CHOICES)

    class Meta:
        unique_together = ('resource', 'user', 'group')

