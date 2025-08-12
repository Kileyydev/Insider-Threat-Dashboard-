from django.core.management.base import BaseCommand
from monitoring.models import Alert
from users.models import AuditLog  # Adjust if your AuditLog is in a different app
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import get_user_model
import logging
from collections import defaultdict

logger = logging.getLogger(__name__)
User = get_user_model()

def detect_failed_otp_bruteforce():
    window_start = timezone.now() - timedelta(minutes=15)
    users = AuditLog.objects.filter(action='otp_failed', timestamp__gte=window_start).values('actor').distinct()

    for user_data in users:
        user_id = user_data['actor']
        count = AuditLog.objects.filter(actor_id=user_id, action='otp_failed', timestamp__gte=window_start).count()

        if count > 5:
            alert_exists = Alert.objects.filter(
                user_id=user_id,
                action='otp_failed',
                timestamp__gte=window_start
            ).exists()

            if not alert_exists:
                Alert.objects.create(
                    user_id=user_id,
                    action='otp_failed',
                    description=f"More than 5 failed OTP attempts in last 15 minutes: {count}",
                    severity='high'
                )
                logger.warning(f"Alert created for user {user_id} - failed OTP brute force")

def detect_rapid_logins(threshold=5, period_minutes=10):
    now = timezone.now()
    window_start = now - timedelta(minutes=period_minutes)
    recent_logins = AuditLog.objects.filter(action='login', timestamp__gte=window_start)

    user_login_counts = defaultdict(int)
    for log in recent_logins:
        user_email = log.actor.email if log.actor else "unknown"
        user_login_counts[user_email] += 1

    flagged_users = [user for user, count in user_login_counts.items() if count > threshold]
    return flagged_users

def detect_unusual_hours_login(start_hour=0, end_hour=6):
    logs = AuditLog.objects.filter(action='login')
    flagged_users = []

    for log in logs:
        if start_hour <= log.timestamp.hour < end_hour:
            user_email = log.actor.email if log.actor else "unknown"
            flagged_users.append(user_email)

    return flagged_users

def detect_excessive_downloads(threshold=5, interval_minutes=5):
    now = timezone.now()
    interval_start = now - timedelta(minutes=interval_minutes)

    download_logs = AuditLog.objects.filter(
        action__icontains='downloaded',
        timestamp__gte=interval_start
    )

    user_download_counts = defaultdict(int)
    for log in download_logs:
        user = log.actor.email if log.actor else 'unknown'
        user_download_counts[user] += 1

    flagged_users = [user for user, count in user_download_counts.items() if count > threshold]
    return flagged_users

def detect_unauthorized_access():
    suspicious_logs = []
    access_logs = AuditLog.objects.filter(action__icontains='access')

    for log in access_logs:
        user = log.actor
        resource = getattr(log, 'resource', None)
        if not user or not resource:
            continue

        if user.department and resource.department and user.department != resource.department:
            suspicious_logs.append(log)
            continue

        allowed_groups = getattr(resource, 'allowed_groups', None)
        if allowed_groups is not None:
            allowed_groups = allowed_groups.all()
            user_groups = user.groups.all()
            if allowed_groups and not set(allowed_groups).intersection(set(user_groups)):
                suspicious_logs.append(log)

    return suspicious_logs

def detect_suspicious_sequences(time_window_minutes=10):
    now = timezone.now()
    interval_start = now - timedelta(minutes=time_window_minutes)
    logs = AuditLog.objects.filter(timestamp__gte=interval_start).order_by('actor', 'timestamp')

    flagged_users = set()
    user_actions = defaultdict(list)

    for log in logs:
        if not log.actor:
            continue
        user_email = log.actor.email
        user_actions[user_email].append((log.action.lower(), log.timestamp))

    for user, actions in user_actions.items():
        action_names = [a[0] for a in actions]
        try:
            i_login = action_names.index('login')
            i_delete = next(i for i in range(i_login+1, len(action_names)) if 'delete' in action_names[i])
            i_logout = next(i for i in range(i_delete+1, len(action_names)) if 'logout' in action_names[i])
            flagged_users.add(user)
        except (StopIteration, ValueError):
            pass

    return list(flagged_users)

class Command(BaseCommand):
    help = 'Run security detection checks on audit logs and create alerts.'

    def handle(self, *args, **options):
        self.stdout.write("Starting detection checks...")

        detect_failed_otp_bruteforce()
        self.stdout.write("Checked failed OTP brute force attempts.")

        flagged_rapid_logins = detect_rapid_logins()
        if flagged_rapid_logins:
            for user_email in flagged_rapid_logins:
                try:
                    user_obj = User.objects.get(email=user_email)
                except User.DoesNotExist:
                    continue
                Alert.objects.get_or_create(
                    user=user_obj,
                    action='rapid_login',
                    defaults={
                        'description': f"User {user_email} logged in more than threshold times in short period",
                        'severity': 'medium'
                    }
                )
                self.stdout.write(f"Rapid login alert created for {user_email}")

        flagged_unusual_logins = detect_unusual_hours_login()
        if flagged_unusual_logins:
            for user_email in flagged_unusual_logins:
                try:
                    user_obj = User.objects.get(email=user_email)
                except User.DoesNotExist:
                    continue
                Alert.objects.get_or_create(
                    user=user_obj,
                    action='unusual_login_hour',
                    defaults={
                        'description': f"User {user_email} logged in during unusual hours",
                        'severity': 'medium'
                    }
                )
                self.stdout.write(f"Unusual hour login alert created for {user_email}")

        flagged_downloads = detect_excessive_downloads()
        if flagged_downloads:
            for user_email in flagged_downloads:
                try:
                    user_obj = User.objects.get(email=user_email)
                except User.DoesNotExist:
                    continue
                Alert.objects.get_or_create(
                    user=user_obj,
                    action='excessive_downloads',
                    defaults={
                        'description': f"User {user_email} downloaded many files in a short period",
                        'severity': 'high'
                    }
                )
                self.stdout.write(f"Excessive download alert created for {user_email}")

        suspicious_access_logs = detect_unauthorized_access()
        if suspicious_access_logs:
            for log in suspicious_access_logs:
                self.stdout.write(f"Unauthorized access detected in log ID {log.id}")
                Alert.objects.get_or_create(
                    user=log.actor,
                    action='unauthorized_access',
                    defaults={
                        'description': f"User {log.actor.email} accessed resource outside allowed scope",
                        'severity': 'high'
                    }
                )

        flagged_sequences = detect_suspicious_sequences()
        if flagged_sequences:
            for user_email in flagged_sequences:
                try:
                    user_obj = User.objects.get(email=user_email)
                except User.DoesNotExist:
                    continue
                Alert.objects.get_or_create(
                    user=user_obj,
                    action='suspicious_sequence',
                    defaults={
                        'description': f"User {user_email} performed suspicious sequence of actions",
                        'severity': 'high'
                    }
                )
                self.stdout.write(f"Suspicious sequence alert created for {user_email}")

        self.stdout.write("Detection checks complete.")
