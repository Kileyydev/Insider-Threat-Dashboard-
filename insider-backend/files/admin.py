from django.contrib import admin
from .models import Department, Resource, ResourceAccess  # import your models here

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'path', 'is_folder', 'department', 'created_by', 'created_at')
    list_filter = ('department', 'is_folder')
    search_fields = ('name', 'path')

@admin.register(ResourceAccess)
class ResourceAccessAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'resource', 'access_level')
    search_fields = ('user__email', 'resource__name')
