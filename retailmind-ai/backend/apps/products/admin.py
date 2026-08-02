from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("sku", "product_name", "category", "brand", "unit_price", "created_at")
    list_filter = ("category", "brand")
    search_fields = ("sku", "product_name", "brand")
    ordering = ("-created_at",)
