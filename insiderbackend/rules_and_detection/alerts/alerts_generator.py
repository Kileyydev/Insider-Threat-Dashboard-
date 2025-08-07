from insiderbackend.rules_and_detection.models import Anomaly, Alert
from accounts.models import EmployeeDetails 

def get_employee_details(employee_id):
    """
    Fetches employee details based on the provided employee ID.
    
    :param employee_id: ID of the employee.
    :return: An instance of EmployeeDetails or None if not found.
    """
    try:
        return EmployeeDetails.objects.get(employee_id=employee_id)
    except EmployeeDetails.DoesNotExist:
        return None

def get_anomaly_details(anomaly_id):
    """
    Fetches anomaly details based on the provided anomaly ID.
    
    :param anomaly_id: ID of the anomaly.
    :return: An instance of Anomaly or None if not found.
    """
    try:
        return Anomaly.objects.get(id=anomaly_id)
    except Anomaly.DoesNotExist:
        return None

def generate_alert(employee_id, anomaly_id, description):
    """
    Generates an alert for a detected anomaly.
    
    :param user: User instance who is associated with the alert.
    :param anomaly_type: Type of the anomaly detected.
    :param description: Description of the anomaly.
    :return: An instance of Alert.
    """
    get_anomaly_details = get_anomaly_details(anomaly_id)
    if not anomaly_id:
        raise ValueError("Anomaly with the given ID does not exist.")
    
    employee_id = get_employee_details(employee_id)
    if not get_employee_details:
        raise ValueError("Employee with the given ID does not exist.")
    # Create the alert
    alert = Alert.objects.create(
        employee_id=get_employee_details.employee_id,
        anomaly_id=anomaly_id,
        description=description
    )
    
    return alert