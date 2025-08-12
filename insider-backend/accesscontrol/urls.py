from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ResourceAccessViewSet

router = DefaultRouter()
router.register(r'resource-access', ResourceAccessViewSet, basename='resource-access')

urlpatterns = [
    path('api/accesscontrol/', include(router.urls)),
]
