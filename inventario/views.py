from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Categorias, Productos, Movimientos
from .serializers import (
    CategoriaSerializer, 
    ProductoSerializer, 
    MovimientoSerializer,
    UserSerializer,
    CustomTokenObtainPairSerializer
)

# ============================================
# PERMISOS PERSONALIZADOS
# ============================================

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permiso que permite GET a cualquiera, pero POST/PUT/DELETE solo a admin.
    """
    def has_permission(self, request, view):
        # Permitir GET a todos
        if request.method in permissions.SAFE_METHODS:
            return True
        # POST/PUT/DELETE solo si es admin
        return request.user and request.user.is_staff

# ============================================
# VISTAS DE CATEGORÍAS
# ============================================

class CategoriaList(generics.ListCreateAPIView):
    queryset = Categorias.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAdminOrReadOnly]

class CategoriaDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Categorias.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAdminOrReadOnly]

# ============================================
# VISTAS DE PRODUCTOS
# ============================================

class ProductoList(generics.ListCreateAPIView):
    queryset = Productos.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [IsAdminOrReadOnly]

class ProductoDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Productos.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [IsAdminOrReadOnly]

# ============================================
# VISTAS DE MOVIMIENTOS
# ============================================

class MovimientoList(generics.ListCreateAPIView):
    queryset = Movimientos.objects.all()
    serializer_class = MovimientoSerializer
    permission_classes = [IsAdminOrReadOnly]

class MovimientoDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Movimientos.objects.all()
    serializer_class = MovimientoSerializer
    permission_classes = [IsAdminOrReadOnly]

# ============================================
# VISTAS DE AUTENTICACIÓN (NUEVAS)
# ============================================

class RegisterView(generics.CreateAPIView):
    """Registro de nuevos usuarios"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class LoginView(TokenObtainPairView):
    """Login personalizado que incluye datos del usuario"""
    serializer_class = CustomTokenObtainPairSerializer

class ProfileView(generics.RetrieveAPIView):
    """Ver perfil del usuario actual"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user

class LogoutView(APIView):
    """Cerrar sesión (invalida el token)"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
                return Response(
                    {"message": "Sesión cerrada exitosamente"}, 
                    status=status.HTTP_205_RESET_CONTENT
                )
            else:
                return Response(
                    {"error": "Se requiere refresh_token"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )