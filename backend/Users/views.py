from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from .models import User
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from infrastructure.redis.login_rate_limit import get_client_ip
from infrastructure.redis.rate_limiting import rate_limit_check
# @api_view(['POST'])
# def Login(request):

#     client_ip=get_client_ip(request)
#     if not (rate_limit_check(f"user:login:{client_ip}",'login_request')):
#         return Response(
#             {
#                 "message": (
#                     "Too many login attempts. "
#                     "Please try again in 1 minute."
#                 )
#             },
#             status=status.HTTP_429_TOO_MANY_REQUESTS
#         )
#     email=request.data['email']
#     password=request.data['password']

#     user=User.objects.filter(email=email).first()#we are using authenticate even though not using default User
#     #as created our custom User  because we registered it in settings.py as AUTH_USER_MODEL
#     if not user:
#         return Response(status=status.HTTP_401_UNAUTHORIZED)
#     user=authenticate(username=user.username,password=password)
#     if user:
#         user_dict=UserSerializer(user).data##returns python dict
#         refresh=RefreshToken.for_user(user) #Here user id will be included inside token,we have extracted this in jwt auth web socckets.
#         access=refresh.access_token
#         response=Response(
#             {'message':'user Logged in successfully',
#             'user':user_dict##this dict is converting into json by Response object
#                 },
#             status=status.HTTP_200_OK

#         )
#         response.set_cookie(
#             key="access",
#             value=str(access),
#             httponly=True,
#             secure=True,   # True in production (HTTPS)
#             samesite="None"
#                 )
#         response.set_cookie(
#                     key="refresh",
#                     value=str(refresh),
#                     httponly=True,
#                     secure=True,   # True in production (HTTPS)
#                     samesite="None"
#                 )
#         print('success')
#         return response
#     else:
#         print('not success')
#         return Response(status=status.HTTP_401_UNAUTHORIZED)
@api_view(["POST"])
def Login(request):

    client_ip = get_client_ip(request)

    if not rate_limit_check(
        f"user:login:{client_ip}",
        "login_request"
    ):
        return Response(
            {
                "message": (
                    "Too many login attempts. "
                    "Please try again in 1 minute."
                )
            },
            status=status.HTTP_429_TOO_MANY_REQUESTS
        )

    email = request.data["email"]
    password = request.data["password"]

    user = User.objects.filter(
        email=email
    ).first()

    if not user:
        return Response(
            {
                "message": "Invalid email or password."
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    user = authenticate(
        username=user.username,
        password=password
    )

    if not user:
        return Response(
            {
                "message": "Invalid email or password."
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    user_dict = UserSerializer(user).data

    refresh = RefreshToken.for_user(user)
    access = refresh.access_token

    response = Response(
        {
            "message": "Login successful.",
            "user": user_dict
        },
        status=status.HTTP_200_OK
    )

    response.set_cookie(
        key="access",
        value=str(access),
        httponly=True,
        secure=True,
        samesite="None"
    )

    response.set_cookie(
        key="refresh",
        value=str(refresh),
        httponly=True,
        secure=True,
        samesite="None"
    )

    return response
class Signup(APIView):
    def post(self,request):
        client_ip = get_client_ip(request)

        if not rate_limit_check(f"user:signup:{client_ip}","signup_request"):
            return Response(
                {
                    "message": (
                        "Too many  signups. "
                        "Please try again in 1 minute."
                    )
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )
        data=request.data
        serializer=UserSerializer(data=data)
        if serializer.is_valid():
            user=serializer.save()
            user_dict=UserSerializer(user).data##returns python dict
            refresh=RefreshToken.for_user(user)
            access=refresh.access_token
            response=Response(
                {'message':'user created successfully',
                'user':user_dict##this dict is converting into json by Response object
                 },
                status=status.HTTP_201_CREATED

            )
            response.set_cookie(
                key="access",
                value=str(access),
                httponly=True,
                secure=True,   # True in production (HTTPS)
                samesite="None"
                    )
            response.set_cookie(
                        key="refresh",
                        value=str(refresh),
                        httponly=True,
                        secure=True,   # True in production (HTTPS)
                        samesite="None"
                    )
            return response
        # print(serializer.errors)


        errors = []

        for field_errors in serializer.errors.values():
            errors.extend(field_errors)

        return Response(
            {
                "message": errors[0],
                "errors": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )

class Logout(APIView):
    def post(self,request):
        response=Response({'message':'Logout Successful'}
                          ,  status=status.HTTP_200_OK)
        response.delete_cookie('access')
        response.delete_cookie('refresh')
        return response
# def UserProfile(APIView):
#     def get(self,request):
class Profile(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        serializer = UserSerializer(request.user)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )
    def put(self, request):
        print("iiii")
        serializer = UserSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={"request": request}
        )

        if serializer.is_valid():

            serializer.save()

            return Response(serializer.data)
        print(serializer.errors)
        return Response(
            serializer.errors,
            status=400
        )
    