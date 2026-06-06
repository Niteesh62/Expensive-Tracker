from django.urls import path
from .views import (
    approval_detail,
    approval_list,
    expense_detail,
    expense_list,
    login,
    register,
    support_ticket_detail,
    support_ticket_list,
    trip_detail,
    trip_list,
    user_detail,
)

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),

    path('expenses/', expense_list, name='expense-list'),
    path('expenses/<int:pk>/', expense_detail, name='expense-detail'),

    path('trips/', trip_list, name='trip-list'),
    path('trips/<int:pk>/', trip_detail, name='trip-detail'),

    path('approvals/', approval_list, name='approval-list'),
    path('approvals/<int:pk>/', approval_detail, name='approval-detail'),

    path('support-tickets/', support_ticket_list, name='support-ticket-list'),
    path('support-tickets/<int:pk>/', support_ticket_detail, name='support-ticket-detail'),
]