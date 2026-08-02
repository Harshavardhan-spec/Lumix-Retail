from django.db import models
from products.models import Product


class Inventory(models.Model):
    """Model tracking product inventory levels across warehouses."""

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="inventories")
    current_stock = models.PositiveIntegerField(default=0, help_text="Available stock units")
    reorder_level = models.PositiveIntegerField(default=10, help_text="Minimum threshold trigger for reorder")
    warehouse = models.CharField(max_length=150, help_text="Warehouse location / store code")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["current_stock"]
        verbose_name = "Inventory"
        verbose_name_plural = "Inventories"
        unique_together = ("product", "warehouse")

    @property
    def is_low_stock(self) -> bool:
        return self.current_stock <= self.reorder_level

    def __str__(self) -> str:
        return f"{self.product.product_name} @ {self.warehouse}: {self.current_stock} units"
