from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse



# Custom 404 handler
def custom_404(request, exception):
    return JsonResponse({
        "error": "Not Found",
        "message": "The requested API endpoint does not exist."
    }, status=404)

urlpatterns = [
    path('admin/', admin.site.urls),

    # API root for frontend/backend communication
    path('api/accounts/', include('apps.myapp.urls')),
]

# Attach custom error handler
handler404 = custom_404