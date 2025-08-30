from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Certification, Language, Skill, SkillCategory, UserProfile

User = get_user_model()
class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'level', 'category']

class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = ['id', 'title', 'issuer', 'date', 'in_progress', 'badge', 'type']

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['id', 'name', 'proficiency']

class SkillCategorySerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)
    
    class Meta:
        model = SkillCategory
        fields = ['id', 'name', 'skills']
class UserSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', "username", 'email', 'first_name', 'last_name', 'profile_image')
        read_only_fields = ('id', 'email')
    
    def get_profile_image(self, obj):
        try:
            return obj.profile.profile_image.url if obj.profile.profile_image else None
        except UserProfile.DoesNotExist:
            return None

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', required=False)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ('user',)
    
    def update(self, instance, validated_data):
        # Handle User model updates
        user_data = validated_data.pop('user', {})
        user = instance.user
        
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()
        
        # Handle UserProfile updates
        return super().update(instance, validated_data)
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'password', 'password_confirm')
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        return validated_data