from rest_framework import viewsets, permissions
from .models import ResourceAccess
from .serializers import ResourceAccessSerializer

class ResourceAccessViewSet(viewsets.ModelViewSet):
    queryset = ResourceAccess.objects.select_related('user', 'resource').all()
    serializer_class = ResourceAccessSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Optionally, you can filter per user or department here
        return super().get_queryset()

    def perform_create(self, serializer):
        serializer.save()
