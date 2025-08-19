# monitoring/tasks.py
from celery import shared_task
from .utils import run_all_detections

from .ml.infer import infer_and_record

@shared_task(name='monitoring.run_all_detections')
def run_all_detections_task():
    run_all_detections()
    # run ml inference for short window
    try:
        infer_and_record(window_minutes=15)
    except Exception as e:
        import logging; logging.exception("ML inference failed: %s", e)
