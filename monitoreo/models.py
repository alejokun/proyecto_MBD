from django.db import models
from django.contrib.auth.models import User

class ConsultasLog(models.Model):
    """
    Modelo que mapea a la tabla 'consultas_log' creada por la IA de BD.
    managed=False para no modificar la estructura existente.
    """
    consulta_sql = models.TextField()
    tiempo_ejecucion = models.DecimalField(max_digits=10, decimal_places=3)
    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, db_column='usuario_id')
    metodo = models.CharField(max_length=10, blank=True, null=True)
    ruta = models.CharField(max_length=200, blank=True, null=True)
    fecha = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        managed = False  # No crear/modificar la tabla
        db_table = 'consultas_log'  # Nombre exacto de la tabla en PostgreSQL
        ordering = ['-fecha']  # Ordenar por fecha descendente por defecto
    
    def __str__(self):
        return f"{self.fecha} - {self.metodo} {self.ruta} - {self.tiempo_ejecucion}ms"