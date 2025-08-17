from django.urls import path
from . import views

urlpatterns = [
    path('departments/', views.list_departments, name='list_departments'),
    path('departments/<int:pk>/resources/', views.department_resources, name='department_resources'),
]
