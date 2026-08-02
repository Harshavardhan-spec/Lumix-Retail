from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
import datetime

from products.models import Product
from .models import Forecast
from .serializers import ForecastSerializer, PredictRequestSerializer
from .services.predictor import DemandPredictor

predictor_service = DemandPredictor()


class PredictDemandView(APIView):
    """
    POST /api/v1/forecasting/predict/
    Runs AI demand forecasting for a target product SKU and stores historical prediction.
    """
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request) -> Response:
        serializer = PredictRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        product_id = serializer.validated_data["product_id"]
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": f"Product with ID {product_id} not found."}, status=status.HTTP_404_NOT_FOUND)

        input_data = serializer.validated_data
        input_data["unit_price"] = float(product.unit_price)

        # Execute prediction via service layer
        predicted_demand, confidence_score, explanation = predictor_service.predict(input_data)

        lead_days = serializer.validated_data.get("lead_time_days", 7)
        target_date = timezone.now().date() + datetime.timedelta(days=lead_days)

        # Save prediction record
        forecast_instance = Forecast.objects.create(
            product=product,
            predicted_demand=predicted_demand,
            forecast_date=target_date,
            confidence_score=confidence_score,
            explanation=explanation,
        )

        response_serializer = ForecastSerializer(forecast_instance)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class ForecastHistoryView(generics.ListAPIView):
    """
    GET /api/v1/forecasting/history/
    Lists historical demand forecast predictions.
    """
    queryset = Forecast.objects.select_related("product").all()
    serializer_class = ForecastSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = super().get_queryset()
        product_id = self.request.query_params.get("product_id")
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        return queryset
