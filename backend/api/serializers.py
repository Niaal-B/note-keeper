from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note,Profile
from django.contrib.auth import get_user_model

class UserSerailizer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id","username","password"]
        extra_kwargs = {"password":{"write_only" : True}}

    def create(self,validated_data):
        user = User.objects.create_user(**validated_data)
        return user
        


class NotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id","title","content","created_at","author"]
        extra_kwargs = {"author": {"read_only" : True}}


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['profile_picture']


User = get_user_model()

class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff']