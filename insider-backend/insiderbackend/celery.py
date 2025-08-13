# insider-backend/celery.py (adjust project name accordingly)

import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'insiderbackend.settings')

app = Celery('insiderbackend')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
