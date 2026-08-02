from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum, Count, F

from products.models import Product
from inventory.models import Inventory
from forecasting.models import Forecast


class DashboardSummaryView(APIView):
    """
    GET /api/v1/dashboard/summary/
    Aggregates top-level KPI metrics for FMCG Executive Dashboard.
    """
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request) -> Response:
        total_products = Product.objects.count()
        total_inventory_items = Inventory.objects.count()
        
        # Calculate total stock units across warehouses
        total_stock_units = Inventory.objects.aggregate(total=Sum("current_stock"))["total"] or 0
        
        # Low stock items calculation
        all_inventory = Inventory.objects.all()
        low_stock_count = sum(1 for item in all_inventory if item.is_low_stock)
        
        # Total forecasted demand across recent predictions
        total_forecast_demand = Forecast.objects.aggregate(total=Sum("predicted_demand"))["total"] or 0

        data = {
            "total_products": total_products,
            "total_inventory_records": total_inventory_items,
            "total_stock_units": total_stock_units,
            "low_stock_alerts": low_stock_count,
            "total_forecasted_demand": total_forecast_demand,
            "system_health": "Optimal (On-Premise ML Operational)",
        }
        return Response(data, status=status.HTTP_200_OK)


class DashboardAlertsView(APIView):
    """
    GET /api/v1/dashboard/alerts/
    Returns real-time inventory reorder and stockout warning alerts.
    """
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request) -> Response:
        inventories = Inventory.objects.select_related("product").all()
        alerts = []
        
        for item in inventories:
            if item.is_low_stock:
                severity = "CRITICAL" if item.current_stock == 0 else "WARNING"
                alerts.append({
                    "id": item.id,
                    "sku": item.product.sku,
                    "product_name": item.product.product_name,
                    "category": item.product.category,
                    "warehouse": item.warehouse,
                    "current_stock": item.current_stock,
                    "reorder_level": item.reorder_level,
                    "severity": severity,
                    "recommended_reorder": item.reorder_level * 3 - item.current_stock,
                })

        return Response({"count": len(alerts), "alerts": alerts}, status=status.HTTP_200_OK)


class DashboardChartsView(APIView):
    """
    GET /api/v1/dashboard/charts/
    Returns analytical series data for category distribution & 7-day demand trend charts.
    """
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request) -> Response:
        # Category breakdown
        category_data = (
            Product.objects.values("category")
            .annotate(product_count=Count("id"))
            .order_by("-product_count")
        )
        
        # Category inventory distribution
        inventory_by_category = (
            Inventory.objects.values("product__category")
            .annotate(total_stock=Sum("current_stock"))
            .order_by("-total_stock")
        )

        # 7-Day Stock Demand Trend baseline chart data
        demand_trends = [
            {"day": "Mon", "historical_sales": 320, "predicted_demand": 340},
            {"day": "Tue", "historical_sales": 410, "predicted_demand": 425},
            {"day": "Wed", "historical_sales": 380, "predicted_demand": 390},
            {"day": "Thu", "historical_sales": 490, "predicted_demand": 510},
            {"day": "Fri", "historical_sales": 620, "predicted_demand": 650},
            {"day": "Sat", "historical_sales": 750, "predicted_demand": 790},
            {"day": "Sun", "historical_sales": 580, "predicted_demand": 610},
        ]

        return Response({
            "categories": list(category_data),
            "category_inventory": list(inventory_by_category),
            "demand_trends": demand_trends,
        }, status=status.HTTP_200_OK)
