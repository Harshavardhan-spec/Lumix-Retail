from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    """Serializer for FMCG Product catalog CRUD operations."""

    class Meta:
        model = Product
        fields = (
            "id",
            "sku",
            "product_name",
            "category",
            "brand",
            "unit_price",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")
