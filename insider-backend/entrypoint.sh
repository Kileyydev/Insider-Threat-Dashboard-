#!/usr/bin/env bash
set -e

# wait-for-postgres or other services here if you need them (optional)
# example: python manage.py wait_for_db

# run migrations (comment out if you don't want automatic migrate)
python manage.py migrate --noinput || true

# collect static (optional for dev)
# python manage.py collectstatic --noinput

# default command: runserver if CMD not provided
if [ -z "$@" ]; then
  exec python manage.py runserver 0.0.0.0:8000
else
  exec "$@"
fi
