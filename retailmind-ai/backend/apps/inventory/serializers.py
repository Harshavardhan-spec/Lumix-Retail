from rest_framework import serializers
from .models import Inventory
from products.serializers import ProductSerializer


class InventorySerializer(serializers.ModelSerializer):
    """Serializer for Inventory CRUD operations."""

    product_detail = ProductSerializer(source="product", read_only=True)
    is_low_stock = serializers.ReadOnlyField()

    class Meta:
        model = Inventory
        fields = (
            "id",
            "product",
            "product_detail",
            "current_stock",
            "reorder_level",
            "warehouse",
            "is_low_stock",
            "updated_at",
        )
        read_only_fields = ("id", "updated_at", "is_low_stock")
