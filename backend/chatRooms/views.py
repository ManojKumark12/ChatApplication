from django.shortcuts import render
from rest_framework.views import APIView

# Create your views here.
class CreateRoom(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = ChatRoomSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save(created_by=request.user)

            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)