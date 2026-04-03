from rest_framework import serializers
from .models import ConsultasLog

class ConsultaLogSerializer(serializers.ModelSerializer):
    """
    Serializer para mostrar las consultas SQL capturadas.
    """
    usuario_nombre = serializers.CharField(source='usuario.username', read_only=True, default='Anónimo')
    
    class Meta:
        model = ConsultasLog
        fields = [
            'id', 
            'consulta_sql', 
            'tiempo_ejecucion', 
            'fecha', 
            'metodo', 
            'ruta',
            'usuario_nombre'
        ]