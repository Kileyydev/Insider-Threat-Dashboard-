from django.contrib import admin
from .models import ResourceAccess

@admin.register(ResourceAccess)
class ResourceAccessAdmin(admin.ModelAdmin):
    list_display = ('user', 'resource', 'access_level')
    list_filter = ('access_level',)
    search_fields = ('user__email', 'resource__name')
