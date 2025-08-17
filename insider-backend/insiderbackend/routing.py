# project_name/routing.py
from django.urls import re_path
from monitoring import consumers

websocket_urlpatterns = [
    re_path(r'ws/alerts/?$', consumers.AlertConsumer.as_asgi()),
]

from channels.auth import AuthMiddlewareStack
from monitoring.middleware import JwtAuthMiddleware

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JwtAuthMiddleware(
        URLRouter(insiderbackend.routing.websocket_urlpatterns)
    ),
})
