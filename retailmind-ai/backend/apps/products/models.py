from django.db import models


class Product(models.Model):
    """Model representing FMCG products in the supply chain."""

    sku = models.CharField(max_length=64, unique=True, help_text="Stock Keeping Unit identifier")
    product_name = models.CharField(max_length=255, help_text="Full product name")
    category = models.CharField(max_length=100, help_text="FMCG category e.g., Dairy, Beverages, Personal Care")
    brand = models.CharField(max_length=100, help_text="Manufacturer / Brand name")
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, help_text="Retail selling price per unit")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Product"
        verbose_name_plural = "Products"

    def __str__(self) -> str:
        return f"[{self.sku}] {self.product_name} - {self.brand}"
