from django.contrib import admin
from .models import Inventory


@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ("product", "warehouse", "current_stock", "reorder_level", "is_low_stock_display", "updated_at")
    list_filter = ("warehouse",)
    search_fields = ("product__product_name", "product__sku", "warehouse")
    ordering = ("current_stock",)

    def is_low_stock_display(self, obj) -> bool:
        return obj.is_low_stock
    is_low_stock_display.boolean = True
    is_low_stock_display.short_description = "Low Stock Warning"
