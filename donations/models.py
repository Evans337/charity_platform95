
from django.conf import settings
from django.db import models

from campaigns.models import Campaign


class DonationStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    SUCCESS = "success", "Success"
    FAILED = "failed", "Failed"


class Donation(models.Model):
    donor = models.ForeignKey(
     settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="donations"
    )
    campaign = models.ForeignKey(
        Campaign, on_delete=models.CASCADE, related_name="donations"
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(
        max_length=20, choices=DonationStatus.choices, default=DonationStatus.PENDING
    )
    transaction_id = models.CharField(max_length=120, blank=True, null=True)

    message = models.CharField(max_length=280, blank=True, null=True)
    anonymous = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["donor"]),
            models.Index(fields=["campaign"]),
            models.Index(fields=["status"]),
        ]
        constraints = [
            models.CheckConstraint(condition=models.Q(amount__gt=0), name="donation_amount_positive"),
        ]

    def __str__(self):
        return f"{self.donor} -> {self.campaign} (${self.amount}, {self.status})"
