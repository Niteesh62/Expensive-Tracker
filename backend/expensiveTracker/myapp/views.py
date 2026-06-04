from rest_framework.decorators import api_view

from rest_framework.response import Response

from .models import User

from .serializers import UserSerializer


# Register API

@api_view(['POST'])

def register(request):

    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():

        serializer.save()

        return Response({
            "message": "Registered Successfully"
        })

    return Response(serializer.errors)


# Login API

@api_view(['POST'])

def login(request):

    email = request.data.get("email")

    password = request.data.get("password")

    try:

        user = User.objects.get(email=email)

        if user.password == password:

            return Response({
                "message": "Login Successful"
            })

        else:

            return Response({
                "error": "Invalid Password"
            })

    except User.DoesNotExist:

        return Response({
            "error": "User Not Found"
        })