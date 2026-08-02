from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/auth/", include("users.urls")),
    path("api/v1/products/", include("products.urls")),
    path("api/v1/inventory/", include("inventory.urls")),
    path("api/v1/forecasting/", include("forecasting.urls")),
    path("api/v1/dashboard/", include("dashboard.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
