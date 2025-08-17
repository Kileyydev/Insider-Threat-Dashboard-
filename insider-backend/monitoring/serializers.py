from rest_framework import serializers
from .models import Alert

class AlertSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Alert
        fields = ['id', 'user', 'user_email', 'action', 'timestamp', 'description', 'severity', 'cleared']
        read_only_fields = ['id', 'user_email', 'timestamp']
