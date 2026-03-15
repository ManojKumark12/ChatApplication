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
    def create(self,validated_data):
            # print("ccccccccc")
            password=validated_data.pop('password')
            user=User(**validated_data)
            user.set_password(password)
            user.save()
            return user
