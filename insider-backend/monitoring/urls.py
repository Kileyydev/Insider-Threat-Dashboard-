from django.urls import path
from .views import AlertListView, AlertClearView

urlpatterns = [
    path('alerts/', AlertListView.as_view(), name='alert-list'),
    path('alerts/<int:pk>/clear/', AlertClearView.as_view(), name='alert-clear'),
]
