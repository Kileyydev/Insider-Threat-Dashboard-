from datetime import timedelta
from django.utils import timezone
from monitoring.models import Alert
from users.models import AuditLog  # Replace 'yourapp' with your actual app name for audit logs

def detect_failed_otp_bruteforce():
    window_start = timezone.now() - timedelta(minutes=15)
    # Group by user (actor) with failed OTP attempts in last 15 minutes
    users = AuditLog.objects.filter(action='otp_failed', timestamp__gte=window_start).values('actor').distinct()

    for user_data in users:
        user_id = user_data['actor']
        count = AuditLog.objects.filter(actor_id=user_id, action='otp_failed', timestamp__gte=window_start).count()

        if count > 5:
            # Avoid duplicate alerts for the same user/action in the window
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
                
def detect_rapid_logins(threshold=5, period_minutes=10):
    """
    Detect users with more than `threshold` logins within last `period_minutes`.
    Returns list of user emails flagged.
    """
    now = timezone.now()
    window_start = now - timedelta(minutes=period_minutes)

    # Filter audit logs for login actions within window
    recent_logins = AuditLog.objects.filter(
        action='login',
        timestamp__gte=window_start
    )

    # Count logins per user
    user_login_counts = {}
    for log in recent_logins:
        user_email = log.actor.email if log.actor else "unknown"
        user_login_counts[user_email] = user_login_counts.get(user_email, 0) + 1

    # Find users exceeding threshold
    flagged_users = [user for user, count in user_login_counts.items() if count > threshold]

    return flagged_users

def detect_unusual_hours_login(start_hour=0, end_hour=6):
    """
    Detect logins between start_hour and end_hour (default: midnight to 6AM).
    Returns list of user emails flagged.
    """
    logs = AuditLog.objects.filter(action='login')
    flagged_users = []

    for log in logs:
        if log.timestamp.hour >= start_hour and log.timestamp.hour < end_hour:
            user_email = log.actor.email if log.actor else "unknown"
            flagged_users.append(user_email)

    return flagged_users  

def detect_excessive_downloads(threshold=5, interval_minutes=5):
    """
    Detect users who downloaded more than `threshold` files within `interval_minutes`.
    Returns a list of user emails flagged.
    """
    now = timezone.now()
    interval_start = now - timedelta(minutes=interval_minutes)

    # Filter download logs within interval
    download_logs = AuditLog.objects.filter(
        action__icontains='downloaded',
        timestamp__gte=interval_start
    )

    # Count downloads per user
    user_download_counts = {}
    for log in download_logs:
        user = log.actor.email if log.actor else 'unknown'
        user_download_counts[user] = user_download_counts.get(user, 0) + 1

    # Flag users exceeding threshold
    flagged_users = [user for user, count in user_download_counts.items() if count > threshold]

    return flagged_users

def detect_unauthorized_access():
    """
    Detect audit logs where user accessed resources outside their allowed department or groups.
    Assumes AuditLog has 'resource' and 'actor' ForeignKeys, and 'action' indicating access.
    Returns list of suspicious log entries.
    """
    suspicious_logs = []

    # Get all access logs (filter actions you consider "access")
    access_logs = AuditLog.objects.filter(action__icontains='access')

    for log in access_logs:
        user = log.actor
        resource = getattr(log, 'resource', None)
        if not user or not resource:
            continue

        # Check if user's department matches resource's department
        if user.department and resource.department and user.department != resource.department:
            suspicious_logs.append(log)
            continue

        # Check if user's groups have access to resource via your AccessControl model (pseudo check)
        # For example, if resource requires group that user is not in:
        allowed_groups = resource.allowed_groups.all()  # Adjust based on your model
        user_groups = user.groups.all()
        if allowed_groups and not set(allowed_groups).intersection(set(user_groups)):
            suspicious_logs.append(log)

    return suspicious_logs
      
def detect_suspicious_sequences(time_window_minutes=10):
    """
    Detect sequences of suspicious actions by a user within a short time window.
    For example, login followed by resource delete then logout quickly.
    Returns list of user emails flagged.
    """

    now = timezone.now()
    interval_start = now - timedelta(minutes=time_window_minutes)

    # Filter logs in interval, order by actor and timestamp
    logs = AuditLog.objects.filter(timestamp__gte=interval_start).order_by('actor', 'timestamp')

    flagged_users = set()
    from collections import defaultdict

    user_actions = defaultdict(list)  # user_email -> list of actions in order

    for log in logs:
        if not log.actor:
            continue
        user_email = log.actor.email
        user_actions[user_email].append((log.action.lower(), log.timestamp))

    for user, actions in user_actions.items():
        # Convert actions to just strings for easy scanning
        action_names = [a[0] for a in actions]

        # Example: look for sequence login → delete → logout in order (not necessarily contiguous)
        try:
            i_login = action_names.index('login')
            i_delete = next(i for i in range(i_login+1, len(action_names)) if 'delete' in action_names[i])
            i_logout = next(i for i in range(i_delete+1, len(action_names)) if 'logout' in action_names[i])

            # If found sequence, flag user
            flagged_users.add(user)
        except StopIteration:
            pass
        except ValueError:
            pass

    return list(flagged_users)
