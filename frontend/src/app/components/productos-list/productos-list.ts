import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';
import { ProductosService } from '../../services/productos';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-productos-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './productos-list.html',
  styleUrl: './productos-list.css'
})
export class ProductosListComponent implements OnInit {
  private prodService = inject(ProductosService);

  productos: Producto[] = [];
  loading: boolean = true;
  error: string | null = null; 

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.loading = true;
    this.prodService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error de conexión con el servidor.';
        this.loading = false;
      }
    });
  }

  eliminar(id: number | undefined): void {
    if (id && confirm('¿Eliminar producto?')) {
      this.prodService.eliminarProducto(id).subscribe({
        next: () => this.productos = this.productos.filter(p => p.id !== id),
        error: () => alert('Error al eliminar')
      });
    }
  }
}