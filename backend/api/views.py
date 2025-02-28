from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerailizer,NotesSerializer,ProfileSerializer,UserListSerializer
from rest_framework.permissions import IsAuthenticated,AllowAny,IsAdminUser
from .models import Note,Profile
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework.filters import SearchFilter
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes





User = get_user_model()


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerailizer
    permission_classes = [AllowAny]


class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NotesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)

        else:
            print(serializer.errors)

class NoteDelete(generics.DestroyAPIView):
    serializer_class = NotesSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)


class Userprofileview(generics.RetrieveAPIView):
    serializer_class = UserSerailizer
    permission_class = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)
    

class ProfilePictureUpdateView(APIView):
    parser_classes = (MultiPartParser, FormParser)  
    permission_classes = [IsAuthenticated]  

    def get(self, request):
        profile, created = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def post(self, request):
        profile, created = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Profile picture updated successfully", "data": serializer.data})
        return Response(serializer.errors, status=400)
    

class AdminLoginView(APIView):
    permission_classes = [AllowAny]  # Allow login without authentication
    def post(self, request):
        print(request.data)
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        print(user)
        
        if user and user.is_staff:  
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }, status=status.HTTP_200_OK)
        
        return Response({"error": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    

class AdminUserListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        search_query = request.GET.get("search", "")
        if search_query:
            users = User.objects.filter(username__icontains=search_query) | User.objects.filter(email__icontains=search_query)
        else:
            users = User.objects.filter(is_staff=False)

        serializer = UserListSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request): 
        serializer = UserSerailizer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class AdminUserDetailView(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, user_id):  
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerailizer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User updated successfully", "data": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, user_id): 
        try:
            user = User.objects.get(id=user_id)
            user.delete()
            return Response({"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(["GET"])
@permission_classes([IsAdminUser]) 
def list_users(request):
    users = User.objects.all()  
    serializer = UserListSerializer(users, many=True)
    return Response(serializer.data)