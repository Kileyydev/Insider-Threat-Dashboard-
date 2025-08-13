from django.urls import path
from . import views

urlpatterns = [
    path('departments/', views.list_departments, name='list_departments'),
    path('department_resources/', views.department_resources, name='department_resources'),
]
