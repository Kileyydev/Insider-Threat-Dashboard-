from django.contrib import admin
from django.urls import path, include
from . import views 
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.auth_urls')),
    path('api/users/', include('users.api_urls')),
    path('', views.home_view),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('files.urls')),
    path('api/monitoring/', include('monitoring.urls')),
    path('', include('accesscontrol.urls')),
]



if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
