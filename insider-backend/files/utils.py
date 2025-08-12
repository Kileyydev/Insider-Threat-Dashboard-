# Access priority mapping (put this in utils.py or views.py)
ACCESS_PRIORITY = {'read': 1, 'download': 2, 'write': 3}

def highest_access_level_for_user_and_resource(user, resource):
    from files.models import ResourceAccess

    ua = ResourceAccess.objects.filter(resource=resource, user=user).order_by('-access_level').first()
    ra = ResourceAccess.objects.filter(resource=resource, group__in=user.groups.all()).order_by('-access_level').first()

    levels = []
    if ua:
        levels.append(ua.access_level)
    if ra:
        levels.append(ra.access_level)
    if levels:
        return max(levels, key=lambda l: ACCESS_PRIORITY.get(l, 0))
    return None

def log_action(actor, action, resource=None, ip=None, metadata=None):
    from users.models import AuditLog  # adjust import as necessary
    AuditLog.objects.create(actor=actor, action=action, resource=resource, ip_address=ip, metadata=metadata or {})
