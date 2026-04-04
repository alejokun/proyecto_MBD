import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductosService } from '../../services/productos';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})

export class DashboardComponent implements OnInit {
  private prodService = inject(ProductosService);
  private cdr = inject(ChangeDetectorRef);

  // Variables para las métricas
  totalProductos: number = 0;
  bajoStock: number = 0;
  productosRecientes: Producto[] = []; 
  
  // Variable para la Prueba #20 (Spinner)
  loading: boolean = true;

  ngOnInit() {
    this.cargarEstadisticas();
  }

  // Función para el botón de Alertas (Módulo 6)
  verAlertas() {
    const productosCriticos = this.productosRecientes
      .filter(p => (p.stock ?? 0) <= 5)
      .map(p => `• ${p.nombre} (${p.stock} uds)`)
      .join('\n');

    if (productosCriticos.length > 0) {
      alert(`⚠️ Alerta de Inventario Crítico:\n\n${productosCriticos}`);
    } else {
      alert('✅ ¡Todo bajo control! No hay productos con stock crítico.');
    }
  }

  cargarEstadisticas() {
    this.loading = true; // Inicia el spinner
    
    this.prodService.getProductos().subscribe({
      next: (data: any) => {
        // Normalizamos la data por si viene paginada o en array simple
        const lista = Array.isArray(data) ? data : (data.results || []);
        
        // Cálculo de totales
        this.totalProductos = lista.length;
        
        // Cálculo de bajo stock (Métrica Prueba #17)
        this.bajoStock = lista.filter((p: Producto) => (p.stock ?? 0) <= 5).length;
        
        // Lógica para mostrar los últimos 5 (Prueba #18)
        // Tomamos los 5 del final y los invertimos para que el último creado sea el primero de la lista
        this.productosRecientes = lista.slice(-5).reverse(); 
        
        this.loading = false; // Apaga el spinner
        this.cdr.detectChanges(); // Fuerza la actualización de la vista
      },
      error: (err) => {
        console.error('Error al cargar datos del Dashboard:', err);
        this.loading = false; // Apaga el spinner aunque haya error
        this.cdr.detectChanges();
      }
    });
  }
}