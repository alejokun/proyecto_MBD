from django.urls import path
from . import views

urlpatterns = [
    # Categorías
    path('categorias/', views.CategoriaList.as_view(), name='categoria-list'),
    path('categorias/<int:pk>/', views.CategoriaDetail.as_view(), name='categoria-detail'),
    
    # Productos
    path('productos/', views.ProductoList.as_view(), name='producto-list'),
    path('productos/<int:pk>/', views.ProductoDetail.as_view(), name='producto-detail'),
    
    # Movimientos
    path('movimientos/', views.MovimientoList.as_view(), name='movimiento-list'),
    path('movimientos/<int:pk>/', views.MovimientoDetail.as_view(), name='movimiento-detail'),
]