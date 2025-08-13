from celery import shared_task
from django.core.management import call_command

@shared_task
def run_detection_task():
    call_command('run_detection')
