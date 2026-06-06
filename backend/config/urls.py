from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.utils import timezone
from django.db import connection
from django.db.utils import OperationalError
from django.http import JsonResponse
from datetime import datetime


# Custom 404 handler
def custom_404(request, exception):
    return JsonResponse({
        "error": "Not Found",
        "message": "The requested API endpoint does not exist."
    }, status=404)
    
def home(request):
    now = datetime.now()  # server local time

    return JsonResponse({
        "status": "ok",
        "message": "Backend is running 🚀",
        "time": now.strftime("%Y-%m-%d %H:%M:%S")
    })


# ✅ Health Check API (DB included)
def health_check(request):
    db_status = "ok"

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
    except OperationalError:
        db_status = "down"

    return JsonResponse({
        "status": "ok" if db_status == "ok" else "degraded",
        "database": db_status,
        "message": "Backend health check completed",
        "time": timezone.now()
    })


urlpatterns = [
    path('admin/', admin.site.urls),

    # Health API
    path('api/health/', health_check),
    
    path('', home),

    # Accounts API
    path('api/accounts/', include('apps.myapp.urls')),
]

# Attach custom error handler
handler404 = custom_404