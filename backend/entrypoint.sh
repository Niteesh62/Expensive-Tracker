#!/bin/sh

echo "=================================================="
echo "Starting Django Application"
echo "=================================================="

echo ""
echo "[1/7] Python Version"
python --version

echo ""
echo "[2/7] Current Directory"
pwd

echo ""
echo "[3/7] Files"
ls -la

echo ""
echo "[4/7] Django System Check"
python manage.py check

echo ""
echo "[5/7] Migration Status"
python manage.py showmigrations

echo ""
echo "[6/7] Applying Migrations"
python manage.py migrate --noinput

echo ""
echo "[7/7] Starting Gunicorn"
echo "PORT=${PORT}"

gunicorn config.wsgi:application \
    --bind 0.0.0.0:${PORT:-8080} \
    --workers 2 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -