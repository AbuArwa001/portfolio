from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import Project
from .serializers import ProjectSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

    def get_queryset(self):
        """
        Return projects for authenticated users:
        - Authenticated users see only their own projects
        - Anonymous users see all projects (read-only)
        """
        if self.request.user.is_authenticated:
            return Project.objects.filter(user=self.request.user)
        return Project.objects.all()

    def perform_create(self, serializer):
        """
        Automatically assign the current user to the project when creating
        """
        serializer.save(user=self.request.user)

    def update(self, request, *args, **kwargs):
        """
        Ensure users can only update their own projects
        """
        instance = self.get_object()
        
        # Check if the user owns the project
        if instance.user != request.user:
            return Response(
                {"detail": "You do not have permission to perform this action."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """
        Ensure users can only delete their own projects
        """
        instance = self.get_object()
        
        # Check if the user owns the project
        if instance.user != request.user:
            return Response(
                {"detail": "You do not have permission to perform this action."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return super().destroy(request, *args, **kwargs)