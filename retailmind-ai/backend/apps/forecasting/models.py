from django.db import models
from products.models import Product


class Forecast(models.Model):
    """Model storing historical and generated AI demand forecasts."""

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="forecasts")
    predicted_demand = models.PositiveIntegerField(help_text="Predicted unit demand over target forecast window")
    forecast_date = models.DateField(help_text="Target date for predicted demand")
    confidence_score = models.FloatField(default=0.92, help_text="AI Model confidence score (0.0 to 1.0)")
    explanation = models.TextField(blank=True, help_text="XAI breakdown of key drivers influencing forecast")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-forecast_date", "-created_at"]
        verbose_name = "Demand Forecast"
        verbose_name_plural = "Demand Forecasts"

    def __str__(self) -> str:
        return f"{self.product.product_name} ({self.forecast_date}): {self.predicted_demand} units ({self.confidence_score*100:.1f}%)"
