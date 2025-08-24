from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    
    def __str__(self):
        return self.email  # Use email instead of username

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True)
    website = models.URLField(blank=True)
    github = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.email}'s Profile"