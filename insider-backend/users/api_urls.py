from django.urls import path
from . import views
from .views import GroupListAPIView 


urlpatterns = [
    path('', views.list_users, name='list_users'),
    path('department/resources/', views.department_resources, name='department_resources'),
    path('resource/upload/', views.upload_resource, name='upload_resource'),
    path('resource/assign-access/', views.assign_resource_access, name='assign_resource_access'),
    path('resource/download/<int:pk>/', views.download_resource, name='download_resource'),
    path('audit/logs/', views.audit_logs, name='audit_logs'),
    path('csrf/', views.csrf_token_view, name='csrf_token'),
    path('groups/', GroupListAPIView.as_view(), name='group-list'),
    path('users/<int:pk>/update/', views.update_user, name='update_user'),
    path('groups/', views.list_groups, name='list_groups'),
     
]

