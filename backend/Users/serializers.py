from rest_framework import serializers
from .models import User
from chatRooms.serializers import ChatRoomSerializer
class UserSerializer(serializers.ModelSerializer):
    joined_rooms = ChatRoomSerializer(
        many=True,
        read_only=True
    )

    created_rooms = ChatRoomSerializer(
        many=True,
        read_only=True
    )
    class Meta:
        model = User
        fields = ['id','username', 'email', 'phone', 'password', 'bio', 'city','joined_rooms','created_rooms','profile_photo']

        extra_kwargs = {
            'password': {'write_only': True},
            'bio': {'required': False, 'allow_blank': True},
            'city': {'required': False, 'allow_blank': True},
            'phone': {'required': False, 'allow_blank': True},
            'profile_photo':{'required':False,'allow_null':True}

        }
        #overriding default create because User.objects.create_user or set_password inserts hashed password
        #unlike User.objects.create()
    def validate_username(self, username):
        if len(username) < 4:
            raise serializers.ValidationError("Username must be at least 4 characters long")
        return username
    def validate_password(self,password):
        if len(password) < 4:
            raise serializers.ValidationError("Password must be at least 4 characters long")
        return password       
    def create(self,validated_data):
            # print("ccccccccc")
            password=validated_data.pop('password')
            user=User(**validated_data)
            user.set_password(password)
            user.save()
            return user
    def update(self, instance, validated_data):

        password = validated_data.pop(
            'password',
            None
        )

        for attr, value in validated_data.items():

            setattr(instance, attr, value)

        if password:

            instance.set_password(password)

        instance.save()

        return instance
