from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from .models import User
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated

@api_view(['POST'])
def Login(request):
    email=request.data['email']
    password=request.data['password']

    user=User.objects.filter(email=email).first()#we are using authenticate even though not using default User
    #as created our custom User  because we registered it in settings.py as AUTH_USER_MODEL
    if not user:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    user=authenticate(username=user.username,password=password)
    if user:
        user_dict=UserSerializer(user).data##returns python dict
        refresh=RefreshToken.for_user(user) #Here user id will be included inside token,we have extracted this in jwt auth web socckets.
        access=refresh.access_token
        response=Response(
            {'message':'user Logged in successfully',
            'user':user_dict##this dict is converting into json by Response object
                },
            status=status.HTTP_200_OK

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
        print('success')
        return response
    else:
        print('not success')
        return Response(status=status.HTTP_401_UNAUTHORIZED)
class Signup(APIView):
    def post(self,request):
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
        return Response(
            serializer.errors,
            ###Serializer.errors looks like this 
            #             {
            #   "username": ["Username must be at least 4 characters long"],
            #   "email": ["user with this email already exists."]
            # }
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
    