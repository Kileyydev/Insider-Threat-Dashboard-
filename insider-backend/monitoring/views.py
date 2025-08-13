from rest_framework import generics, permissions
from .models import Alert
from .serializers import AlertSerializer
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response

class AlertListView(generics.ListAPIView):
    queryset = Alert.objects.all().order_by('-timestamp')
    serializer_class = AlertSerializer
    permission_classes = [permissions.IsAdminUser]

class AlertClearView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            alert = Alert.objects.get(pk=pk)
        except Alert.DoesNotExist:
            return Response({'detail': 'Alert not found'}, status=status.HTTP_404_NOT_FOUND)

        alert.cleared = True
        alert.save()
        serializer = AlertSerializer(alert)
        return Response(serializer.data, status=status.HTTP_200_OK)