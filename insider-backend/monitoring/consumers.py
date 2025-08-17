# monitoring/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from channels.auth import login, logout

class AlertConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # If you want only authenticated users:
        user = self.scope.get('user', None)
        if user is None or user.is_anonymous:
            # Optionally accept then close, or reject
            await self.close(code=4001)
            return

        await self.channel_layer.group_add('alerts', self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard('alerts', self.channel_name)

    # Handler for messages sent to group
    async def alert_created(self, event):
        # event will contain serialized alert data
        await self.send(text_data=json.dumps({
            'type': 'alert.created',
            'alert': event['alert'],
        }))
