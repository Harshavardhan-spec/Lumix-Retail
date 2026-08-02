from django.urls import path
from .views import PredictDemandView, ForecastHistoryView

urlpatterns = [
    path("predict/", PredictDemandView.as_view(), name="forecast_predict"),
    path("history/", ForecastHistoryView.as_view(), name="forecast_history"),
]
