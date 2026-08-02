from rest_framework import viewsets, permissions, filters
from .models import Product
from .serializers import ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    """
    ModelViewSet for managing FMCG products.
    Provides standard GET, POST, PUT, PATCH, DELETE operations.
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (permissions.IsAuthenticated,)
    filter_backends = (filters.SearchFilter, filters.OrderingFilter)
    search_fields = ("sku", "product_name", "category", "brand")
    ordering_fields = ("created_at", "unit_price", "product_name")

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get("category")
        brand = self.request.query_params.get("brand")
        if category:
            queryset = queryset.filter(category__iexact=category)
        if brand:
            queryset = queryset.filter(brand__iexact=brand)
        return queryset
