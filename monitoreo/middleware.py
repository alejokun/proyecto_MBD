import time
import re
from django.db import connection
from django.utils.timezone import now
from .models import ConsultasLog

class SQLCaptureMiddleware:
    """
    Middleware que captura las consultas SQL ejecutadas durante cada request.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Iniciar temporizador
        start_time = time.time()
        
        # Ejecutar la request
        response = self.get_response(request)
        
        # Calcular tiempo total
        duration_ms = (time.time() - start_time) * 1000
        
        # Capturar consultas SQL ejecutadas (así es como Django las guarda)
        # Forzar a Django a guardar las consultas si no lo está haciendo
        from django.db import reset_queries
        queries = connection.queries
        
        # Obtener información del usuario (si está autenticado)
        user = request.user if request.user.is_authenticated else None
        
        # Guardar cada consulta en la base de datos
        for query in queries:
            # Limpiar la consulta SQL para que sea más legible
            sql_clean = self._clean_sql(query.get('sql', ''))
            
            # Crear registro en la tabla particionada
            try:
                ConsultasLog.objects.create(
                    consulta_sql=sql_clean,
                    tiempo_ejecucion=float(query.get('time', 0)),
                    usuario=user,
                    metodo=request.method,
                    ruta=request.path,
                    fecha=now()
                )
            except Exception as e:
                # Si hay error al guardar, no detengamos la request
                print(f"Error guardando consulta: {e}")
        
        # Limpiar consultas después de procesarlas para no acumular memoria
        reset_queries()
        
        return response
    
    def _clean_sql(self, sql):
        """
        Limpia la consulta SQL para que sea más legible.
        Elimina comillas extras y formatea ligeramente.
        """
        if not sql:
            return ""
        # Eliminar múltiples espacios
        sql = re.sub(r'\s+', ' ', sql)
        # Eliminar espacios alrededor de comas
        sql = re.sub(r'\s*,\s*', ', ', sql)
        return sql.strip()