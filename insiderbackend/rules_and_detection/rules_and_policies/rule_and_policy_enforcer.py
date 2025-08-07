from insiderbackend.rules_and_detection.rules_and_policies.department_roles import EmployeesRoles
from insiderbackend.rules_and_detection.models import AccessPolicy
from insiderbackend.resources.models import Resource
from insiderbackend.accounts.models import EmployeeDetails

def get_employee_details(employee_id,employee):
    """
    Fetches employee details based on the provided employee ID.
    
    :param employee_id: ID of the employee.
    :return: An instance of EmployeeDetails or None if not found.
    """
    try:
        return EmployeeDetails.objects.get(employee_id=employee_id, employee=employee)
        
    except EmployeeDetails.DoesNotExist:
        return None

def get_employee_role(employee_id, employee ):
    """
    Fetches the role of an employee based on the provided employee ID.
    
    :param employee_id: ID of the employee.
    :return: Role of the employee or None if not found.
    """
    employee_details = get_employee_details(employee_id, employee)
    if employee_details:
        return employee_details.role, employee_details.department
    return None 

def get_resource_details(resource_id):
    """
    Fetches resource details based on the provided resource ID.
    
    :param resource_id: ID of the resource.
    :return: An instance of Resource or None if not found.
    """
    try:
        return Resource.objects.get(resource_id=resource_id)
    except Resource.DoesNotExist:
        return None
   
def get_access_policy(policy_id):
    """
    Fetches the access policy based on the provided policy ID.
    
    :param policy_id: ID of the access policy.
    :return: An instance of AccessPolicy or None if not found.
    """
    if policy_id is None:
        return None
    else:
        try:
            return AccessPolicy.objects.get(policy_id=policy_id)
        except AccessPolicy.DoesNotExist:
            return None

def rbac(user, action, resource):
    if not user or not user.is_authenticated:
        return False

    employee_details = get_employee_details(user.id, user)
    if not employee_details:
        return False

    role = employee_details.role
    department = employee_details.department

    # Ensure department key matches the EmployeesRoles dictionary
    if department not in EmployeesRoles:
        return False

    # Check if role is valid for the department
    if role not in EmployeesRoles[department]['roles']:
        return False

    # Get access policy
    access_policy = get_access_policy(resource.policy_id)
    if not access_policy:
        return False

    # Check if the action is allowed in the policy
    if action in access_policy.allowed_actions.split(','):
        return True

    return False

def dac(user, action, resource):
    if not user or not user.is_authenticated:
        return False

    employee_details = get_employee_details(user.id, user)
    if not employee_details:
        return False

    # Check if resource is public and action is view
    if action == 'view' and resource.is_public:
        return True

    # Check user permissions
    perm_codename = f"{action}_resource"
    if user.has_perm(f"resources.{perm_codename}", resource):
        return True

    return False

# MAC enforcement based on security labels
def mac(user, action, resource):
    if not user or not user.is_authenticated:
        return False

    employee_details = get_employee_details(user.id, user)
    if not employee_details:
        return False

    # Let's assume both user and resource have a classification level
    user_level = employee_details.classification_level
    resource_level = resource.classification_level

    # MAC enforcement: User can access only if their level >= resource's
    if user_level >= resource_level:
        return True

    return False

def create_access_policy(policy_id, allowed_actions):
    """
    Create a new access policy with the given policy ID and allowed actions.
    
    :param policy_id: Unique identifier for the policy.
    :param allowed_actions: List of actions allowed by this policy.
    :return: The created AccessPolicy instance.
    """
    access_policy = AccessPolicy(
        policy_id=policy_id,
        allowed_actions=','.join(allowed_actions)
    )
    access_policy.save()
    return access_policy

def enforce_policy(user, action, resource):
    """
    Enforce the access policy based on the user's role and the resource's access policy.

    :param user: User instance who is trying to access the resource.
    :param action: Action being performed (e.g., 'view', 'edit', 'delete').
    :param resource: Resource instance being accessed.
    :return: True if access is allowed, False otherwise.
    """
    if not user or not user.is_authenticated:
        return False

    # Check RBAC
    if rbac(user, action, resource):
        return True

    # Check DAC
    if dac(user, action, resource):
        return True

    # Check MAC
    if mac(user, action, resource):
        return True

    # Check access policy
    access_policy = get_access_policy(resource.policy_id)
    if not access_policy:
        return False

    
    # Example logic for checking permissions

    if action == 'view' and resource.is_public:
        return True
    elif action == 'edit' and user.has_perm('change_resource', resource):
        return True
    elif action == 'delete' and user.has_perm('delete_resource', resource):
        return True
    elif action == 'create' and user.has_perm('add_resource', resource):
        return True
    elif action == 'download' and user.has_perm('download_resource', resource):
        return True
    elif action == 'upload' and user.has_perm('upload_resource', resource):
        return True
    elif action == 'share' and user.has_perm('share_resource', resource):
        return True
    elif action == 'view' and user.has_perm('view_resource', resource):
        return True
    
    return False