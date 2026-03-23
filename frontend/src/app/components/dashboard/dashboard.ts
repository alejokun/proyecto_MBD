import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductosService } from '../../services/productos';
import { Producto } from '../../models/producto.model'; // Asegúrate de tener el modelo

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

  // Variables de las tarjetas
  totalProductos: number = 0;
  bajoStock: number = 0;
  movimientosHoy: number = 0; 
  
  // VARIABLE QUE FALTABA (La que causaba el error TS2339)
  productosRecientes: Producto[] = []; 
  
  loading: boolean = true;

  ngOnInit() {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.loading = true;
    this.cdr.detectChanges();

    this.prodService.getProductos().subscribe({
      next: (data: any) => {
        // Manejo de paginación de Django (por si acaso)
        const lista = Array.isArray(data) ? data : (data.results || []);
        
        // Llenamos las estadísticas
        this.totalProductos = lista.length;
        this.bajoStock = lista.filter((p: any) => p.stock <= 5).length;
        
        // Llenamos la tabla de abajo con los últimos 5 productos
        this.productosRecientes = lista.slice(-5).reverse(); 
        
        this.loading = false;
        this.cdr.detectChanges(); // ¡Despierta Angular!
      },
      error: (err) => {
        console.error('Error en Dashboard:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}