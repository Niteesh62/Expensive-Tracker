from django.contrib.auth.hashers import make_password
from rest_framework import serializers

from .models import Approval, Expense, SupportTicket, Trip, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'name',
            'email',
            'password',
            'currency',
            'notifications',
            'monthly_budget',
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


class ExpenseSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source='transaction_type')

    class Meta:
        model = Expense
        fields = [
            'id',
            'user',
            'title',
            'amount',
            'category',
            'date',
            'description',
            'type',
            'created_at',
            'updated_at',
        ]


class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = [
            'id',
            'user',
            'destination',
            'start_date',
            'end_date',
            'budget',
            'status',
            'created_at',
            'updated_at',
        ]


class ApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Approval
        fields = [
            'id',
            'employee',
            'category',
            'amount',
            'date',
            'status',
            'created_at',
            'updated_at',
        ]


class SupportTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportTicket
        fields = [
            'id',
            'name',
            'email',
            'category',
            'priority',
            'message',
            'status',
            'created_at',
            'updated_at',
        ]
