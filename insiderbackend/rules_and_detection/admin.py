from django.contrib import admin
from .models import AccessPolicy
from .models import Alert
from .models import Anomaly

# Register your models here.
admin.site.register(Alert)
admin.site.register(Anomaly)
admin.site.register(AccessPolicy)