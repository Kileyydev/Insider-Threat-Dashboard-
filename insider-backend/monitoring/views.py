from rest_framework import generics, permissions, status
from .models import Alert
from .serializers import AlertSerializer
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

class AlertListView(generics.ListAPIView):
    queryset = Alert.objects.all().order_by('-timestamp')
    serializer_class = AlertSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        # optional: filter by severity, cleared, or user
        qs = Alert.objects.all().order_by('-timestamp')
        severity = self.request.query_params.get('severity')
        if severity:
            qs = qs.filter(severity=severity)
        show_cleared = self.request.query_params.get('show_cleared')
        if show_cleared not in ('true', '1', 'yes'):
            qs = qs.filter(cleared=False)
        return qs

class AlertClearView(APIView):
    permission_classes = [IsAdminUser]
    serializer_class = AlertSerializer
    queryset = Alert.objects.all()
    lookup_field = 'pk'
    
    def patch(self, request, pk):
        alert = get_object_or_404(Alert, pk=pk)
        alert.cleared = True
        alert.save()
        serializer = AlertSerializer(alert)
        return Response(serializer.data, status=status.HTTP_200_OK)