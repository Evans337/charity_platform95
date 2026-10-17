from rest_framework import serializers

from .models import Donation


class DonationSerializer(serializers.ModelSerializer):
    donor_id = serializers.PrimaryKeyRelatedField(source="donor", read_only=True)
    donor_name = serializers.SerializerMethodField()
    campaign_title = serializers.CharField(source="campaign.title", read_only=True)

    class Meta:
        model = Donation
        fields = [
            "id", "donor_id", "donor_name", "campaign", "campaign_title",
            "amount", "status", "transaction_id", "message", "anonymous",
            "created_at", "updated_at",
        ]
        read_only_fields = ["status", "transaction_id"]

    def get_donor_name(self, obj):
        return "Anonymous" if obj.anonymous else obj.donor.name


class CreateDonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = ["campaign", "amount", "message", "anonymous"]

    def validate_campaign(self, campaign):
        if campaign.status != "active":
            raise serializers.ValidationError("This campaign is not currently accepting donations.")
        return campaign