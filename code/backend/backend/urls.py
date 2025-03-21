from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
    path('', TemplateView.as_view(template_name="index.html")),
    path('endpoints', TemplateView.as_view(template_name="endpoints.html")),
    path('status', TemplateView.as_view(template_name="status.html")),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    
]