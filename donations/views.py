from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from campaigns.models import Campaign
from .models import Donation, DonationStatus
from .permissions import IsDonationOwnerOrAdmin, IsCampaignOwnerOrAdmin
from .serializers import CreateDonationSerializer, DonationSerializer


class CreateDonationView(generics.CreateAPIView):
    serializer_class = CreateDonationSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        donation = serializer.save(donor=request.user, status=DonationStatus.PENDING)
        return Response(DonationSerializer(donation).data, status=status.HTTP_201_CREATED)


class ConfirmDonationView(APIView):
    permission_classes = [IsAuthenticated, IsDonationOwnerOrAdmin]

    def post(self, request, pk):
        donation = get_object_or_404(Donation, pk=pk)
        self.check_object_permissions(request, donation)

        if donation.status != DonationStatus.PENDING:
            return Response(
                {"error": f"Donation is already {donation.status}, cannot confirm again."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            campaign = Campaign.objects.select_for_update().get(pk=donation.campaign_id)
            campaign.raised_amount = campaign.raised_amount + donation.amount
            campaign.save(update_fields=["raised_amount", "updated_at"])

            donation.status = DonationStatus.SUCCESS
            donation.transaction_id = f"SIMULATED-{donation.id}"
            donation.save(update_fields=["status", "transaction_id", "updated_at"])

        return Response(DonationSerializer(donation).data)


class MyDonationsView(generics.ListAPIView):
    serializer_class = DonationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Donation.objects.filter(donor=self.request.user)


class CampaignDonationsView(generics.ListAPIView):
    serializer_class = DonationSerializer
    permission_classes = [IsAuthenticated, IsCampaignOwnerOrAdmin]

    def get_queryset(self):
        campaign = get_object_or_404(Campaign, pk=self.kwargs["campaign_id"])
        self.check_object_permissions(self.request, campaign)
        return Donation.objects.filter(campaign=campaign, status=DonationStatus.SUCCESS)