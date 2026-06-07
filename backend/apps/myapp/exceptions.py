import logging

from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    request = context.get("request")

    logger.exception(
        "Unhandled exception | Method=%s | Path=%s | Error=%s",
        getattr(request, "method", None),
        getattr(request, "path", None),
        str(exc),
    )

    if response is not None:
        return response

    return Response(
        {
            "error": "Internal Server Error",
            "message": "Something went wrong."
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )