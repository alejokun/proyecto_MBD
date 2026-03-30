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

  totalProductos: number = 0;
  bajoStock: number = 0;
  productosRecientes: Producto[] = []; 
  loading: boolean = true;

  ngOnInit() {
    this.cargarEstadisticas();
  }
verAlertas() {
  const productosCriticos = this.productosRecientes
    .filter(p => (p.stock ?? 0) <= 5)
    .map(p => `• ${p.nombre} (${p.stock} uds)`)
    .join('\n');

  if (productosCriticos.length > 0) {
    alert(`⚠️ Productos con Bajo Stock:\n\n${productosCriticos}`);
  } else {
    alert('✅ ¡Todo bajo control! No hay productos con stock crítico.');
  }
}
  cargarEstadisticas() {
    this.loading = true;
    this.prodService.getProductos().subscribe({
      next: (data: any) => {
        const lista = Array.isArray(data) ? data : (data.results || []);
        
        this.totalProductos = lista.length;
        
        // Sincronizado con el HTML (Bajo stock <= 5)
        this.bajoStock = lista.filter((p: Producto) => (p.stock ?? 0) <= 5).length;
        
        // Tomamos los últimos 5 y los invertimos para que el más nuevo esté arriba
        this.productosRecientes = lista.slice(-5).reverse(); 
        
        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error en Dashboard:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}