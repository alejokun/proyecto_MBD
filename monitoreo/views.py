from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework import status
from .models import ConsultasLog
from .serializers import ConsultaLogSerializer

class ConsultasMonitoreoView(APIView):
    """
    Endpoint que devuelve las últimas consultas SQL ejecutadas.
    Solo accesible para administradores (is_staff=True).
    """
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        # Obtener las últimas 100 consultas (la vista materializada las hace rápidas)
        consultas = ConsultasLog.objects.all()[:100]
        
        serializer = ConsultaLogSerializer(consultas, many=True)
        
        return Response({
            'total': len(consultas),
            'consultas': serializer.data,
            'timestamp': request.timestamp if hasattr(request, 'timestamp') else None
        })

class ConsultasMonitoreoDetailView(APIView):
    """
    Endpoint para ver una consulta específica por ID.
    """
    permission_classes = [IsAdminUser]
    
    def get(self, request, consulta_id):
        try:
            consulta = ConsultasLog.objects.get(id=consulta_id)
            serializer = ConsultaLogSerializer(consulta)
            return Response(serializer.data)
        except ConsultasLog.DoesNotExist:
            return Response(
                {'error': 'Consulta no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )

class LimpiarConsultasView(APIView):
    """
    Endpoint para limpiar consultas viejas (solo admin).
    Llama a la función de PostgreSQL creada por la IA de BD.
    """
    permission_classes = [IsAdminUser]
    
    def delete(self, request):
        from django.db import connection
        
        dias = request.query_params.get('dias', 7)
        
        with connection.cursor() as cursor:
            cursor.execute("SELECT limpiar_consultas_viejas(%s);", [dias])
            resultado = cursor.fetchone()[0]
        
        return Response({
            'mensaje': 'Limpieza ejecutada',
            'resultado': resultado,
            'dias_mantenidos': dias
        })  