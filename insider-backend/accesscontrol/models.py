from django.db import models
from django.conf import settings

class ResourceAccess(models.Model):
    ACCESS_LEVELS = [
        ('read', 'Read'),
        ('write', 'Write'),
        ('download', 'Download'),
        ('delete', 'Delete'),
        ('upload', 'Upload'),
        ('none', 'No Access'),
        ('full_control', 'Full Access')
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='resource_accesses'
    )
    resource = models.ForeignKey(
        'users.Resource', on_delete=models.CASCADE, related_name='user_accesses'
    )
    access_level = models.CharField(max_length=20, choices=ACCESS_LEVELS, default='none')

    class Meta:
        unique_together = ('user', 'resource')

    def __str__(self):
        return f"{self.user.email} → {self.resource.name} ({self.access_level})"
