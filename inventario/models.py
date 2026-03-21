from django.db import models
from django.contrib.auth.models import User

class Categorias(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    
    class Meta:
        managed = False
        db_table = 'categorias'
    
    def __str__(self):
        return self.nombre

class Productos(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    id_categoria = models.ForeignKey(Categorias, on_delete=models.PROTECT, db_column='id_categoria')
    fecha_creacion = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        managed = False
        db_table = 'productos'
    
    def __str__(self):
        return self.nombre

class Movimientos(models.Model):
    id_producto = models.ForeignKey(Productos, on_delete=models.PROTECT, db_column='id_producto')
    tipo = models.CharField(max_length=10)  # 'entrada' o 'salida'
    cantidad = models.IntegerField()
    id_usuario = models.ForeignKey(User, on_delete=models.PROTECT, db_column='id_usuario')
    fecha = models.DateTimeField(blank=True, null=True)
    observacion = models.TextField(blank=True, null=True)
    
    class Meta:
        managed = False
        db_table = 'movimientos'
    
    def __str__(self):
        return f"{self.id_producto} - {self.tipo} - {self.cantidad}"