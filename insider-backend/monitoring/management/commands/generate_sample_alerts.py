from django.core.management.base import BaseCommand
from monitoring.models import Alert
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class Command(BaseCommand):
    help = 'Generate sample alerts for test users'

    def handle(self, *args, **options):
        # List of users by email with example alert info
        sample_users = [
            'insaiderdash@gmail.com',
            'imkiley2003@gmail.com',
            'sean.mutuku@strathmore.edu',
            'goretti.giciriri@strathmore.edu',
        ]

        alerts_created = 0
        now = timezone.now()

        for email in sample_users:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                self.stdout.write(f"User with email {email} not found, skipping.")
                continue

            # Example alert actions and descriptions for variety
            example_alerts = [
                {
                    'action': 'failed_otp',
                    'description': 'Multiple failed OTP attempts detected',
                    'severity': 'high',
                },
                {
                    'action': 'unusual_login_hour',
                    'description': 'User logged in during unusual hours',
                    'severity': 'medium',
                },
                {
                    'action': 'excessive_downloads',
                    'description': 'User downloaded many files in a short period',
                    'severity': 'high',
                },
                {
                    'action': 'suspicious_sequence',
                    'description': 'User performed suspicious sequence of actions',
                    'severity': 'high',
                },
            ]

            for alert_data in example_alerts:
                # Avoid duplicates by action and user
                alert, created = Alert.objects.get_or_create(
                    user=user,
                    action=alert_data['action'],
                    description=alert_data['description'],
                    severity=alert_data['severity'],
                    cleared=False,
                    defaults={'timestamp': now}
                )
                if created:
                    alerts_created += 1
                    self.stdout.write(f"Created alert '{alert.action}' for user {email}")

        self.stdout.write(f"Total new alerts created: {alerts_created}")
