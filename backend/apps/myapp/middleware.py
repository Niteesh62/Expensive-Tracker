import logging
import time

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()

        response = self.get_response(request)

        duration = round(time.time() - start_time, 3)

        logger.info(
            "Request | %s %s | Status=%s | Duration=%ss",
            request.method,
            request.path,
            response.status_code,
            duration,
        )

        return response