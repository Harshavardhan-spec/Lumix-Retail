from django.contrib import admin
from .models import Forecast


@admin.register(Forecast)
class ForecastAdmin(admin.ModelAdmin):
    list_display = ("product", "predicted_demand", "forecast_date", "confidence_score_pct", "created_at")
    list_filter = ("forecast_date", "confidence_score")
    search_fields = ("product__product_name", "product__sku", "explanation")
    ordering = ("-created_at",)

    def confidence_score_pct(self, obj) -> str:
        return f"{obj.confidence_score * 100:.1f}%"
    confidence_score_pct.short_description = "Confidence Score"
