from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from .models import UserProfile
from .serializers import UserSerializer, UserProfileSerializer, UserRegistrationSerializer

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    try:
        profile = request.user.profile
    except UserProfile.DoesNotExist:
        profile = UserProfile.objects.create(user=request.user)
    
    serializer = UserProfileSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        # Create user
        user = User.objects.create(
            username=serializer.validated_data['email'],  # Use email as username
            email=serializer.validated_data['email'],
            first_name=serializer.validated_data.get('first_name', ''),
            last_name=serializer.validated_data.get('last_name', ''),
            password=make_password(serializer.validated_data['password'])
        )
        
        # Create profile
        UserProfile.objects.create(user=user)
        
        # Return user data
        user_serializer = UserSerializer(user)
        return Response(user_serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)