# monitoring/middleware.py
from urllib.parse import parse_qs
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import UntypedToken
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from channels.db import database_sync_to_async

@database_sync_to_async
def get_user_from_token(token):
    try:
        # Validate token
        validated_token = UntypedToken(token)
        # get user id
        jwt_auth = JWTAuthentication()
        user, _ = jwt_auth.get_user(validated_token)
        return user
    except Exception:
        return AnonymousUser()

class JwtAuthMiddleware:
    """
    Custom middleware for Channels to auth via ?token=<jwt>
    """
    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        return JwtAuthMiddlewareInstance(scope, self.inner)

class JwtAuthMiddlewareInstance:
    def __init__(self, scope, inner):
        self.scope = dict(scope)
        self.inner = inner

    async def __call__(self, receive, send):
        query_string = self.scope.get('query_string', b'').decode()
        params = parse_qs(query_string)
        token_list = params.get('token')
        if token_list:
            token = token_list[0]
            user = await get_user_from_token(token)
            self.scope['user'] = user
        inner = self.inner(self.scope)
        return await inner(receive, send)
