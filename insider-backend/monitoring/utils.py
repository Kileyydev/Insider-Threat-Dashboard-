# monitoring/utils.py
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from collections import defaultdict
from monitoring.models import Alert
from users.models import AuditLog
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

def detect_failed_otp_bruteforce():
    window_start = timezone.now() - timedelta(minutes=15)
    users = AuditLog.objects.filter(action='otp_failed', timestamp__gte=window_start) \
                            .values('actor').distinct()
    for user_data in users:
        user_id = user_data['actor']
        count = AuditLog.objects.filter(actor_id=user_id, action='otp_failed',
                                        timestamp__gte=window_start).count()
        if count > 5:
            exists = Alert.objects.filter(user_id=user_id, action='otp_failed',
                                          timestamp__gte=window_start).exists()
            if not exists:
                Alert.objects.create(
                    user_id=user_id, action='otp_failed',
                    description=f"More than 5 failed OTP attempts in last 15 minutes: {count}",
                    severity='high'
                )
                logger.warning(f"Alert created for user {user_id} - failed OTP brute force")

def detect_rapid_logins(threshold=5, period_minutes=10):
    now = timezone.now()
    window_start = now - timedelta(minutes=period_minutes)
    recent = AuditLog.objects.filter(action='login', timestamp__gte=window_start)
    counts = defaultdict(int)
    for log in recent:
        email = log.actor.email if log.actor else "unknown"
        counts[email] += 1
    return [u for u, c in counts.items() if c > threshold]

def detect_unusual_hours_login(start_hour=0, end_hour=6):
    flagged = []
    for log in AuditLog.objects.filter(action='login'):
        if start_hour <= log.timestamp.hour < end_hour:
            flagged.append(log.actor.email if log.actor else "unknown")
    return flagged

def detect_excessive_downloads(threshold=5, interval_minutes=5):
    now = timezone.now()
    start = now - timedelta(minutes=interval_minutes)
    logs = AuditLog.objects.filter(action__icontains='downloaded', timestamp__gte=start)
    counts = defaultdict(int)
    for log in logs:
        email = log.actor.email if log.actor else "unknown"
        counts[email] += 1
    return [u for u, c in counts.items() if c > threshold]

def detect_unauthorized_access():
    suspicious = []
    access_logs = AuditLog.objects.filter(action__icontains='access')
    for log in access_logs:
        user = log.actor
        resource = getattr(log, 'resource', None)
        if not user or not resource:
            continue
        if user.department and resource.department and user.department != resource.department:
            suspicious.append(log); continue
        allowed_groups = getattr(resource, 'allowed_groups', None)
        if allowed_groups is not None:
            allowed_groups = allowed_groups.all()
            if allowed_groups and not set(allowed_groups).intersection(set(user.groups.all())):
                suspicious.append(log)
    return suspicious

def detect_suspicious_sequences(time_window_minutes=10):
    now = timezone.now()
    start = now - timedelta(minutes=time_window_minutes)
    logs = AuditLog.objects.filter(timestamp__gte=start).order_by('actor', 'timestamp')
    from collections import defaultdict
    flagged = set()
    acts = defaultdict(list)
    for log in logs:
        if not log.actor: continue
        email = log.actor.email
        acts[email].append((log.action.lower(), log.timestamp))
    for user, seq in acts.items():
        names = [a for a, _ in seq]
        try:
            i_login = names.index('login')
            i_delete = next(i for i in range(i_login+1, len(names)) if 'delete' in names[i])
            _ = next(i for i in range(i_delete+1, len(names)) if 'logout' in names[i])
            flagged.add(user)
        except (StopIteration, ValueError):
            pass
    return list(flagged)

def run_all_detections():
    detect_failed_otp_bruteforce()

    from django.contrib.auth import get_user_model
    User = get_user_model()

    for email in detect_rapid_logins():
        try: user = User.objects.get(email=email)
        except User.DoesNotExist: continue
        Alert.objects.get_or_create(
            user=user, action='rapid_login',
            defaults={'description': f"User {email} logged in more than threshold times in short period",
                      'severity': 'medium'}
        )

    for email in detect_unusual_hours_login():
        try: user = User.objects.get(email=email)
        except User.DoesNotExist: continue
        Alert.objects.get_or_create(
            user=user, action='unusual_login_hour',
            defaults={'description': f"User {email} logged in during unusual hours",
                      'severity': 'medium'}
        )

    for email in detect_excessive_downloads():
        try: user = User.objects.get(email=email)
        except User.DoesNotExist: continue
        Alert.objects.get_or_create(
            user=user, action='excessive_downloads',
            defaults={'description': f"User {email} downloaded many files in a short period",
                      'severity': 'high'}
        )

    for log in detect_unauthorized_access():
        Alert.objects.get_or_create(
            user=log.actor, action='unauthorized_access',
            defaults={'description': f"User {log.actor.email} accessed resource outside allowed scope",
                      'severity': 'high'}
        )

    for email in detect_suspicious_sequences():
        try: user = User.objects.get(email=email)
        except User.DoesNotExist: continue
        Alert.objects.get_or_create(
            user=user, action='suspicious_sequence',
            defaults={'description': f"User {email} performed suspicious sequence of actions",
                      'severity': 'high'}
        )
