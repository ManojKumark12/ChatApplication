from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import ChatRoomSerializer
from rest_framework.response import Response

# Create your views here.
class CreateRoom(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("hello")

        serializer = ChatRoomSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save(created_by=request.user)

            return Response(serializer.data, status=201)
        else:
            print("not validdd")

        return Response(serializer.errors, status=400)