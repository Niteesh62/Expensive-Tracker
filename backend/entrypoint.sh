#!/bin/sh

echo "=================================================="
echo "Starting Django Application"
echo "=================================================="

echo ""
echo "[1/8] Python Version"
python --version

echo ""
echo "[2/8] Current Directory"
pwd

echo ""
echo "[3/8] Files"
ls -la

echo ""
echo "[4/8] Environment"
echo "PORT=${PORT}"
echo "DJANGO_SETTINGS_MODULE=${DJANGO_SETTINGS_MODULE}"

echo ""
echo "[5/8] Django System Check"
python manage.py check

echo ""
echo "[6/8] Migration Status"
python manage.py showmigrations

echo ""
echo "[7/8] Applying Migrations"
python manage.py migrate --noinput

echo ""
echo "[8/8] Starting Gunicorn"
echo "Listening on 0.0.0.0:${PORT:-8080}"

exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:${PORT:-8080} \
    --workers 2 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -