from django.conf import settings
from django.db import models


class CampaignStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    ACTIVE = "active", "Active"
    COMPLETED = "completed", "Completed"
    CANCELLED = "cancelled", "Cancelled"


class Campaign(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True, null=True)
    goal_amount = models.DecimalField(max_digits=12, decimal_places=2)
    raised_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    category = models.CharField(max_length=80, blank=True, null=True)
    location = models.CharField(max_length=150, blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=CampaignStatus.choices, default=CampaignStatus.ACTIVE)

    organization = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="campaigns"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["organization"]),
            models.Index(fields=["status"]),
        ]
        constraints = [
            models.CheckConstraint(condition=models.Q(goal_amount__gt=0), name="goal_amount_positive"),
            models.CheckConstraint(condition=models.Q(raised_amount__gte=0), name="raised_amount_non_negative"),
        ]

    def __str__(self):
        return self.title