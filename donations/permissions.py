from rest_framework.permissions import BasePermission


class IsDonationOwnerOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        return obj.donor_id == request.user.id or request.user.role == "admin"


class IsCampaignOwnerOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        return obj.organization_id == request.user.id or request.user.role == "admin"