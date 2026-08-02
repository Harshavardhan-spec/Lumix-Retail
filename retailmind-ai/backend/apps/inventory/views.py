from rest_framework import viewsets, permissions, filters
from .models import Inventory
from .serializers import InventorySerializer


class InventoryViewSet(viewsets.ModelViewSet):
    """
    ModelViewSet for managing stock inventory.
    Provides standard GET, POST, PUT, PATCH, DELETE operations.
    """
    queryset = Inventory.objects.select_related("product").all()
    serializer_class = InventorySerializer
    permission_classes = (permissions.IsAuthenticated,)
    filter_backends = (filters.SearchFilter, filters.OrderingFilter)
    search_fields = ("product__product_name", "product__sku", "warehouse")
    ordering_fields = ("current_stock", "reorder_level", "updated_at")

    def get_queryset(self):
        queryset = super().get_queryset()
        warehouse = self.request.query_params.get("warehouse")
        low_stock_only = self.request.query_params.get("low_stock")

        if warehouse:
            queryset = queryset.filter(warehouse__iexact=warehouse)
        if low_stock_only in ("true", "1", "True"):
            queryset = [item for item in queryset if item.is_low_stock]
            # Convert back to list or filter via query
            pks = [item.pk for item in queryset]
            return Inventory.objects.filter(pk__in=pks)

        return queryset
