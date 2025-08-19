# monitoring/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Alert
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .serializers import AlertSerializer

@receiver(post_save, sender=Alert)
def broadcast_alert(sender, instance, created, **kwargs):
    if not created:
        return
    channel_layer = get_channel_layer()
    serialized = AlertSerializer(instance).data
    async_to_sync(channel_layer.group_send)(
        'alerts',
        {
            'type': 'alert_created',  # maps to AlertConsumer.alert_created
            'alert': serialized
        }
    )
