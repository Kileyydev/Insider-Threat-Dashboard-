# users/management/commands/seed_initial.py
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from users.models import Department, Role

User = get_user_model()

class Command(BaseCommand):
    help = 'Seed initial roles, departments, and a superuser (if not present)'

    def handle(self, *args, **options):
        # Departments
        deps = ['Finance', 'IT', 'HR', 'Operations']
        for d in deps:
            Department.objects.get_or_create(name=d)
        self.stdout.write(self.style.SUCCESS('Departments ensured.'))

        # Roles
        roles = ['System Admin', 'Manager', 'Employee', 'Analyst']
        for r in roles:
            Role.objects.get_or_create(name=r)
        self.stdout.write(self.style.SUCCESS('Roles ensured.'))

        # Superuser
        if not User.objects.filter(email='admin@insider.local').exists():
            User.objects.create_superuser(email='admin@insider.local', password='AdminPass123!', full_name='System Admin')
            self.stdout.write(self.style.SUCCESS('Superuser created: admin@insider.local / AdminPass123!'))
        else:
            self.stdout.write('Superuser already exists.')
