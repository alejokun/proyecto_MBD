from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Categorias, Productos, Movimientos

# ============================================
# SERIALIZERS PARA MODELOS EXISTENTES
# ============================================

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorias
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    # Mostrar el nombre de la categoría en lugar del ID
    categoria_nombre = serializers.CharField(source='id_categoria.nombre', read_only=True)
    
    class Meta:
        model = Productos
        fields = '__all__'

class MovimientoSerializer(serializers.ModelSerializer):
    # Mostrar nombres en lugar de IDs
    producto_nombre = serializers.CharField(source='id_producto.nombre', read_only=True)
    usuario_username = serializers.CharField(source='id_usuario.username', read_only=True)
    
    class Meta:
        model = Movimientos
        fields = '__all__'

# ============================================
# SERIALIZERS PARA AUTENTICACIÓN (NUEVOS)
# ============================================

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name', 'is_staff')
        read_only_fields = ('is_staff',)  # El usuario no puede cambiar su propio rol
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        # Por defecto, los usuarios registrados NO son admin
        user.is_staff = False
        user.save()
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Agregar claims personalizados al token
        token['username'] = user.username
        token['email'] = user.email
        token['is_staff'] = user.is_staff  # Para saber si es admin
        
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        # Agregar datos del usuario a la respuesta
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'is_staff': self.user.is_staff
        }
        return data