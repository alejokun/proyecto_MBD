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
        console.error('Error al cargar productos:', err);
        this.error = 'No se pudo conectar con el servidor de inventario.';
        this.loading = false;
      }
    });
  }

  eliminar(id: number | undefined): void {
    if (id && confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
      this.prodService.eliminarProducto(id).subscribe({
        next: () => {
          // Filtramos la lista local para que desaparezca de inmediato
          this.productos = this.productos.filter(p => p.id !== id);
          alert('Producto eliminado.');
        },
        error: (err) => alert('No se pudo eliminar el producto.')
      });
    }
  }
}