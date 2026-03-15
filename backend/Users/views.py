from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
# from django.views.decorators.csrf import csrf_exempt
from .serializers import UserSerializer
from rest_framework import status
# @csrf_exempt
# def test_view(request):
#     return HttpResponse("SUccess")

class Signup(APIView):
    def post(self,request):
        data=request.data
        serializer=UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message':'user created successfully'},
                status=status.HTTP_201_CREATED

            )
        print(serializer.errors)
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

