# users/permissions.py
from rest_framework import permissions
from .models import AccessControl, ResourceAccess

ACTION_MAP = {
    'GET': 'read',
    'HEAD': 'read',
    'OPTIONS': 'read',
    'POST': 'write',
    'PUT': 'write',
    'PATCH': 'write',
    'DELETE': 'delete'
}

PERM_PRIORITY = {
    'none': 0,
    'read': 1,
    'download': 2,
    'upload': 3,
    'write': 4,
    'delete': 5,
    'full_control': 100,
}

class RoleEnforcer(permissions.BasePermission):
    def get_action(self, request):
        return ACTION_MAP.get(request.method)

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        action = self.get_action(request)
        if action is None:
            return False

        user = request.user
        if user.is_superuser:
            return True

        # owner gets full control
        if getattr(obj, 'created_by_id', None) == getattr(user, 'id', None):
            return True

        # 1. explicit per-user AccessControl
        ac = AccessControl.objects.filter(user=user, resource=obj).first()
        if ac and PERM_PRIORITY.get(ac.permission, 0) >= PERM_PRIORITY.get(action, 0):
            return True

        # 2. role-based ResourceAccess
        if getattr(user, 'role', None):
            ra = ResourceAccess.objects.filter(resource=obj, role=user.role).first()
            if ra and PERM_PRIORITY.get(ra.access_level, 0) >= PERM_PRIORITY.get(action, 0):
                return True

        # 3. department-level fallback: allow reads for same department and role level >= required
        user_dept = getattr(user, 'department', None)
        res_dept = getattr(obj, 'department', None)
        if user_dept and res_dept and user_dept == res_dept:
            # If user has a role, allow read by default; for higher actions require manager+
            if action == 'read':
                return True
            # allow write/delete only for level >= 3 (manager or owner)
            role_level = getattr(user.role, 'level', 0) if getattr(user, 'role', None) else 0
            if action in ('write', 'delete') and role_level >= 3:
                return True

        return False
