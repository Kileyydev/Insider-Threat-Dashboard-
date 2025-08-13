# users/api.py or views.py in Django app

from rest_framework import viewsets, permissions
from .models import User
from .serializers import UserSerializer

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]  # protect as needed
