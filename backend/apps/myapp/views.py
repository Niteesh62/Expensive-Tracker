import logging

from django.contrib.auth.hashers import check_password
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Approval, Expense, SupportTicket, Trip, User
from .serializers import (
    ApprovalSerializer,
    ExpenseSerializer,
    SupportTicketSerializer,
    TripSerializer,
    UserSerializer,
)

logger = logging.getLogger(__name__)


def _safe_request_data(request):
    """
    Return request data with sensitive fields masked for logging.
    """
    try:
        data = request.data.copy()
    except Exception:
        return {}

    for field in ("password", "confirm_password", "old_password", "new_password"):
        if field in data:
            data[field] = "***masked***"
    return data


# Register API
@api_view(["POST"])
def register(request):
    logger.info("Registration attempt started. Method=%s", request.method)
    logger.debug("Registration request data=%s", _safe_request_data(request))

    try:
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            logger.info(
                "User registered successfully. User ID=%s, Email=%s",
                user.id,
                user.email,
            )

            return Response(
                {
                    "message": "Registered Successfully",
                    "user": UserSerializer(user).data,
                },
                status=status.HTTP_201_CREATED,
            )

        logger.warning(
            "Registration validation failed. Errors=%s",
            serializer.errors,
        )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception:
        logger.exception("Unexpected error during registration.")
        return Response(
            {"error": "Something went wrong"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# Login API
@api_view(["POST"])
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")

    logger.info("Login attempt started. Email=%s", email)
    logger.debug("Login request data=%s", _safe_request_data(request))

    if not email or not password:
        logger.warning("Login failed. Missing email or password. Email=%s", email)
        return Response(
            {"error": "Email and password are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        user = User.objects.get(email=email)

        if check_password(password, user.password):
            logger.info(
                "Login successful. User ID=%s, Email=%s",
                user.id,
                user.email,
            )

            return Response(
                {
                    "message": "Login Successful",
                    "user": UserSerializer(user).data,
                },
                status=status.HTTP_200_OK,
            )

        logger.warning("Invalid password. Email=%s", email)
        return Response(
            {"error": "Invalid Password"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    except User.DoesNotExist:
        logger.warning("User not found during login. Email=%s", email)
        return Response(
            {"error": "User Not Found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    except Exception:
        logger.exception("Unexpected login error. Email=%s", email)
        return Response(
            {"error": "Something went wrong"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET", "PUT"])
def user_detail(request, pk):
    logger.info("User detail request started. Method=%s, UserID=%s", request.method, pk)

    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        logger.warning("User not found. UserID=%s", pk)
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception:
        logger.exception("Unexpected error while fetching user. UserID=%s", pk)
        return Response(
            {"error": "Something went wrong"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    if request.method == "GET":
        logger.info("User fetched successfully. UserID=%s", pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    logger.debug("User update payload. UserID=%s, Data=%s", pk, _safe_request_data(request))
    serializer = UserSerializer(user, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        logger.info("User updated successfully. UserID=%s", pk)
        return Response(serializer.data)

    logger.warning(
        "User update validation failed. UserID=%s, Errors=%s",
        pk,
        serializer.errors,
    )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Expense CRUD
@api_view(["GET", "POST"])
def expense_list(request):
    logger.info("Expense list request started. Method=%s", request.method)

    try:
        if request.method == "GET":
            user_id = request.GET.get("user_id")
            logger.debug("Fetching expenses. user_id=%s", user_id)

            expenses = Expense.objects.all().order_by("-date", "-created_at")
            if user_id:
                expenses = expenses.filter(user_id=user_id)

            count = expenses.count()
            logger.info("Expenses fetched successfully. Count=%s, user_id=%s", count, user_id)

            serializer = ExpenseSerializer(expenses, many=True)
            return Response(serializer.data)

        logger.debug("Expense create payload=%s", _safe_request_data(request))
        serializer = ExpenseSerializer(data=request.data)

        if serializer.is_valid():
            expense = serializer.save()
            logger.info(
                "Expense created successfully. ExpenseID=%s, UserID=%s",
                expense.id,
                getattr(expense, "user_id", None),
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        logger.warning("Expense creation validation failed. Errors=%s", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception:
        logger.exception("Unexpected error in expense_list view.")
        return Response(
            {"error": "Something went wrong"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET", "PUT", "DELETE"])
def expense_detail(request, pk):
    logger.info("Expense detail request started. Method=%s, ExpenseID=%s", request.method, pk)

    try:
        expense = Expense.objects.get(pk=pk)
    except Expense.DoesNotExist:
        logger.warning("Expense not found. ExpenseID=%s", pk)
        return Response({"error": "Expense not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception:
        logger.exception("Unexpected error while fetching expense. ExpenseID=%s", pk)
        return Response(
            {"error": "Something went wrong"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    if request.method == "GET":
        logger.info("Expense fetched successfully. ExpenseID=%s", pk)
        serializer = ExpenseSerializer(expense)
        return Response(serializer.data)

    if request.method == "PUT":
        logger.debug("Expense update payload. ExpenseID=%s, Data=%s", pk, _safe_request_data(request))
        serializer = ExpenseSerializer(expense, data=request.data)

        if serializer.is_valid():
            serializer.save()
            logger.info("Expense updated successfully. ExpenseID=%s", pk)
            return Response(serializer.data)

        logger.warning(
            "Expense update validation failed. ExpenseID=%s, Errors=%s",
            pk,
            serializer.errors,
        )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    expense_id = expense.id
    expense.delete()
    logger.info("Expense deleted successfully. ExpenseID=%s", expense_id)
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"])
def trip_list(request):
    logger.info("Trip list request started. Method=%s", request.method)

    try:
        if request.method == "GET":
            user_id = request.GET.get("user_id")
            logger.debug("Fetching trips. user_id=%s", user_id)

            trips = Trip.objects.all().order_by("-start_date", "-created_at")
            if user_id:
                trips = trips.filter(user_id=user_id)

            count = trips.count()
            logger.info("Trips fetched successfully. Count=%s, user_id=%s", count, user_id)

            serializer = TripSerializer(trips, many=True)
            return Response(serializer.data)

        logger.debug("Trip create payload=%s", _safe_request_data(request))
        serializer = TripSerializer(data=request.data)

        if serializer.is_valid():
            trip = serializer.save()
            logger.info(
                "Trip created successfully. TripID=%s, UserID=%s",
                trip.id,
                getattr(trip, "user_id", None),
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        logger.warning("Trip creation validation failed. Errors=%s", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception:
        logger.exception("Unexpected error in trip_list view.")
        return Response(
            {"error": "Something went wrong"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET", "PUT", "DELETE"])
def trip_detail(request, pk):
    logger.info("Trip detail request started. Method=%s, TripID=%s", request.method, pk)

    try:
        trip = Trip.objects.get(pk=pk)
    except Trip.DoesNotExist:
        logger.warning("Trip not found. TripID=%s", pk)
        return Response({"error": "Trip not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception:
        logger.exception("Unexpected error while fetching trip. TripID=%s", pk)
        return Response(
            {"error": "Something went wrong"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    if request.method == "GET":
        logger.info("Trip fetched successfully. TripID=%s", pk)
        serializer = TripSerializer(trip)
        return Response(serializer.data)

    if request.method == "PUT":
        logger.debug("Trip update payload. TripID=%s, Data=%s", pk, _safe_request_data(request))
        serializer = TripSerializer(trip, data=request.data)

        if serializer.is_valid():
            serializer.save()
            logger.info("Trip updated successfully. TripID=%s", pk)
            return Response(serializer.data)

        logger.warning(
            "Trip update validation failed. TripID=%s, Errors=%s",
            pk,
            serializer.errors,
        )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    trip_id = trip.id
    trip.delete()
    logger.info("Trip deleted successfully. TripID=%s", trip_id)
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"])
def approval_list(request):
    logger.info("Approval list request started. Method=%s", request.method)

    try:
        if request.method == "GET":
            approvals = Approval.objects.all().order_by("-created_at")
            count = approvals.count()
            logger.info("Approvals fetched successfully. Count=%s", count)

            serializer = ApprovalSerializer(approvals, many=True)
            return Response(serializer.data)

        logger.debug("Approval create payload=%s", _safe_request_data(request))
        serializer = ApprovalSerializer(data=request.data)

        if serializer.is_valid():
            approval = serializer.save()
            logger.info(
                "Approval created successfully. ApprovalID=%s",
                approval.id,
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        logger.warning("Approval creation validation failed. Errors=%s", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception:
        logger.exception("Unexpected error in approval_list view.")
        return Response(
            {"error": "Something went wrong"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET", "PUT", "DELETE"])
def approval_detail(request, pk):
    logger.info("Approval detail request started. Method=%s, ApprovalID=%s", request.method, pk)

    try:
        approval = Approval.objects.get(pk=pk)
    except Approval.DoesNotExist:
        logger.warning("Approval not found. ApprovalID=%s", pk)
        return Response({"error": "Approval not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception:
        logger.exception("Unexpected error while fetching approval. ApprovalID=%s", pk)
        return Response(
            {"error": "Something went wrong"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    if request.method == "GET":
        logger.info("Approval fetched successfully. ApprovalID=%s", pk)
        serializer = ApprovalSerializer(approval)
        return Response(serializer.data)

    if request.method == "PUT":
        logger.debug("Approval update payload. ApprovalID=%s, Data=%s", pk, _safe_request_data(request))
        serializer = ApprovalSerializer(approval, data=request.data)

        if serializer.is_valid():
            serializer.save()
            logger.info("Approval updated successfully. ApprovalID=%s", pk)
            return Response(serializer.data)

        logger.warning(
            "Approval update validation failed. ApprovalID=%s, Errors=%s",
            pk,
            serializer.errors,
        )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    approval_id = approval.id
    approval.delete()
    logger.info("Approval deleted successfully. ApprovalID=%s", approval_id)
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"])
def support_ticket_list(request):
    logger.info("Support ticket list request started. Method=%s", request.method)

    try:
        if request.method == "GET":
            tickets = SupportTicket.objects.all().order_by("-created_at")
            count = tickets.count()
            logger.info("Support tickets fetched successfully. Count=%s", count)

            serializer = SupportTicketSerializer(tickets, many=True)
            return Response(serializer.data)

        logger.debug("Support ticket create payload=%s", _safe_request_data(request))
        serializer = SupportTicketSerializer(data=request.data)

        if serializer.is_valid():
            ticket = serializer.save()
            logger.info(
                "Support ticket created successfully. TicketID=%s",
                ticket.id,
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        logger.warning(
            "Support ticket creation validation failed. Errors=%s",
            serializer.errors,
        )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception:
        logger.exception("Unexpected error in support_ticket_list view.")
        return Response(
            {"error": "Something went wrong"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET", "PUT", "DELETE"])
def support_ticket_detail(request, pk):
    logger.info(
        "Support ticket detail request started. Method=%s, TicketID=%s",
        request.method,
        pk,
    )

    try:
        ticket = SupportTicket.objects.get(pk=pk)
    except SupportTicket.DoesNotExist:
        logger.warning("Support ticket not found. TicketID=%s", pk)
        return Response({"error": "Ticket not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception:
        logger.exception("Unexpected error while fetching support ticket. TicketID=%s", pk)
        return Response(
            {"error": "Something went wrong"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    if request.method == "GET":
        logger.info("Support ticket fetched successfully. TicketID=%s", pk)
        serializer = SupportTicketSerializer(ticket)
        return Response(serializer.data)

    if request.method == "PUT":
        logger.debug(
            "Support ticket update payload. TicketID=%s, Data=%s",
            pk,
            _safe_request_data(request),
        )
        serializer = SupportTicketSerializer(ticket, data=request.data)

        if serializer.is_valid():
            serializer.save()
            logger.info("Support ticket updated successfully. TicketID=%s", pk)
            return Response(serializer.data)

        logger.warning(
            "Support ticket update validation failed. TicketID=%s, Errors=%s",
            pk,
            serializer.errors,
        )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    ticket_id = ticket.id
    ticket.delete()
    logger.info("Support ticket deleted successfully. TicketID=%s", ticket_id)
    return Response(status=status.HTTP_204_NO_CONTENT)