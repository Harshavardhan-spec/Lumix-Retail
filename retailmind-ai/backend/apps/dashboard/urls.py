from django.urls import path
from .views import DashboardSummaryView, DashboardAlertsView, DashboardChartsView

urlpatterns = [
    path("summary/", DashboardSummaryView.as_view(), name="dashboard_summary"),
    path("alerts/", DashboardAlertsView.as_view(), name="dashboard_alerts"),
    path("charts/", DashboardChartsView.as_view(), name="dashboard_charts"),
]
