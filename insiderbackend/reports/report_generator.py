import jinja2
from insiderbackend.reports.models import Report
from insiderbackend.reports.utils import generate_report_data
from insiderbackend.reports.utils import save_report_to_file
from django.utils import timezone
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.core.exceptions import ValidationError
from django.db import transaction

def generate_report(report_type, user):
    # Get the report data
    report_data = generate_report_data(report_type, user)