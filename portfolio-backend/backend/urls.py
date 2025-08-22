from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from about.views import AboutViewSet
from projects.views import ProjectViewSet
from blog.views import BlogPostViewSet
from contact.views import ContactMessageViewSet
from django.conf import settings
from django.conf.urls.static import static


router = routers.DefaultRouter()
router.register(r'about', AboutViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'blog', BlogPostViewSet)
router.register(r'contact', ContactMessageViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)