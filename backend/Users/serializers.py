from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['username', 'email', 'phone', 'password', 'bio', 'city']

        extra_kwargs = {
            'password': {'write_only': True},
            'bio': {'required': False, 'allow_blank': True},
            'city': {'required': False, 'allow_blank': True},
            'phone': {'required': False, 'allow_blank': True},

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
