from django.urls import path
from . import views

urlpatterns = [
    # Endpoint principal: lista las últimas consultas
    path('consultas/', views.ConsultasMonitoreoView.as_view(), name='monitoreo-consultas'),
    
    # Endpoint para ver una consulta específica
    path('consultas/<int:consulta_id>/', views.ConsultasMonitoreoDetailView.as_view(), name='monitoreo-consulta-detail'),
    
    # Endpoint para limpiar consultas viejas
    path('limpiar/', views.LimpiarConsultasView.as_view(), name='monitoreo-limpiar'),
]