import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductosService } from '../../services/productos'; // Importamos el servicio
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

  // Variables para las métricas
  totalProductos: number = 0;
  bajoStock: number = 0;
  productosRecientes: Producto[] = [];
  loading: boolean = true;

  ngOnInit(): void {
    this.cargarResumen();
  }

  cargarResumen(): void {
    this.loading = true;
    this.prodService.getProductos().subscribe({
      next: (data) => {
        this.totalProductos = data.length;
        // Filtramos productos con stock menor a 5 para la alerta
        this.bajoStock = data.filter(p => p.stock < 5).length;
        // Tomamos los últimos 5 para mostrar en una lista rápida
        this.productosRecientes = data.slice(-5).reverse();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error en Dashboard:', err);
        this.loading = false;
      }
    });
  }
}