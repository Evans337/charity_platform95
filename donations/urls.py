from django.urls import path

from .views import ConfirmDonationView, CreateDonationView, MyDonationsView

urlpatterns = [
    path("", CreateDonationView.as_view(), name="donation-create"),
    path("my-donations/", MyDonationsView.as_view(), name="my-donations"),
    path("<int:pk>/confirm/", ConfirmDonationView.as_view(), name="donation-confirm"),
]