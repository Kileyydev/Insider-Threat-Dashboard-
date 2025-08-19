from django.apps import AppConfig
from django.core.cache import cache
from django.conf import settings

class MonitoringConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'monitoring'

    def ready(self):
        # ensure signals import
        try:
            import monitoring.signals  # noqa
        except Exception:
            pass

        # run detections once after boot (guarded by cache)
        flag_key = 'monitoring:detections_bootstrap_ran'
        if not cache.get(flag_key):
            try:
                from monitoring.tasks import run_all_detections_task
                run_all_detections_task.delay()
                cache.set(flag_key, True, timeout=3600)  # 1 hour guard; adjust
            except Exception:
                # don't crash app startup if Celery not up yet
                pass
