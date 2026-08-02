from rest_framework import serializers
from .models import Forecast
from products.serializers import ProductSerializer


class ForecastSerializer(serializers.ModelSerializer):
    """Serializer for displaying demand forecasts."""

    product_detail = ProductSerializer(source="product", read_only=True)

    class Meta:
        model = Forecast
        fields = (
            "id",
            "product",
            "product_detail",
            "predicted_demand",
            "forecast_date",
            "confidence_score",
            "explanation",
            "created_at",
        )
        read_only_fields = ("id", "created_at")


class PredictRequestSerializer(serializers.Serializer):
    """Serializer for demand prediction requests."""

    product_id = serializers.IntegerField(required=True, help_text="ID of the target product")
    lead_time_days = serializers.IntegerField(default=7, min_value=1, max_value=60)
    promotional_event = serializers.BooleanField(default=False)
    historical_sales_7d = serializers.IntegerField(default=150, min_value=0)
    historical_sales_30d = serializers.IntegerField(default=600, min_value=0)
