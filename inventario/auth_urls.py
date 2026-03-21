from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='auth_register'),
    path('login/', views.LoginView.as_view(), name='auth_login'),
    path('profile/', views.ProfileView.as_view(), name='auth_profile'),
    path('logout/', views.LogoutView.as_view(), name='auth_logout'),
]