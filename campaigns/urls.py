from django.urls import path

from .views import CampaignDetailView, CampaignListCreateView
from donations.views import CampaignDonationsView

urlpatterns = [
    path("", CampaignListCreateView.as_view(), name="campaign-list-create"),
    path("<int:pk>/", CampaignDetailView.as_view(), name="campaign-detail"),
    path("<int:campaign_id>/donations/", CampaignDonationsView.as_view(), name="campaign-donations"),
]