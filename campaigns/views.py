from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Campaign
from .permissions import IsCharity, IsOwnerOrAdminOrReadOnly
from .serializers import CampaignSerializer


class CampaignListCreateView(generics.ListCreateAPIView):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["status", "category"]

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated(), IsCharity()]
        return []

    def perform_create(self, serializer):
        serializer.save(organization=self.request.user)


class CampaignDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [IsOwnerOrAdminOrReadOnly]

# Create your views here.
