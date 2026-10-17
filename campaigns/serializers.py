from rest_framework import serializers

from .models import Campaign


class CampaignSerializer(serializers.ModelSerializer):
    organization_id = serializers.PrimaryKeyRelatedField(source="organization", read_only=True)

    class Meta:
        model = Campaign
        fields = [
            "id", "title", "description", "goal_amount", "raised_amount",
            "category", "location", "image_url", "start_date", "end_date",
            "status", "organization_id", "created_at", "updated_at",
        ]
        read_only_fields = ["raised_amount"]