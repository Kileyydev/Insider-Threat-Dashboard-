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
        finally:
            pass
def rbac(user, action, resource):
    
    """
    Check if the user has permission to perform the action on the resource.
    """
    user = get_employee_details(user.id)
    if not user:
        return False
    if not user.is_authenticated:
        return False

    # Example logic for checking permissions
    role, department = get_employee_role(user.id)
    if not role or not department:
        return False
    # Check if the resource has an associated access policy
    access_policy = get_access_policy(resource.access_policy_id)
    if not access_policy:
        return False

    # Check if the user has the required role for the action
    if action in EmployeesRoles[department]['roles']:
        return True
    # Check if the user has the required permissions for the action
    if action in access_policy.allowed_actions:
        return True
    return False

def dac(user, action, resource):
    """
    Check if the user has permission to perform the action on the resource.
    """
    if not user.is_authenticated:
        return False

    # Example logic for checking permissions
    if action == 'view' and resource.is_public:
        return True
    elif action == 'edit' and user.has_perm('change_resource', resource):
        return True
    elif action == 'delete' and user.has_perm('delete_resource', resource):
        return True

    return False