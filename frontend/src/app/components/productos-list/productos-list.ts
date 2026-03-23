import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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
  // Inyecciones de dependencias
  private prodService = inject(ProductosService);
  private cdr = inject(ChangeDetectorRef);

  // Variables de estado para la tabla
  productos: Producto[] = [];
  loading: boolean = true;
  errorMsg: string | null = null;

  ngOnInit(): void {
    this.cargarProductos();
  }

  /**
   * Obtiene los productos desde el servicio de Django
   */
  cargarProductos(): void {
    this.loading = true;
    this.errorMsg = null;
    this.cdr.detectChanges(); // Forzamos mostrar el spinner

    this.prodService.getProductos().subscribe({
      next: (data: any) => {
        console.log('📦 Datos recibidos de Django:', data);

        // Manejamos si los datos vienen directos o en .results (paginación)
        this.productos = Array.isArray(data) ? data : (data.results || []);
        
        this.loading = false;
        this.cdr.detectChanges(); // ¡Despierta a Angular para que pinte la tabla!
      },
      error: (err) => {
        console.error('❌ Error al obtener productos:', err);
        this.errorMsg = 'Error de conexión con el servidor.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Elimina un producto y actualiza la lista visualmente
   */
  eliminar(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      // IMPORTANTE: Sin el .subscribe() la petición NUNCA se envía a Django
      this.prodService.deleteProducto(id).subscribe({
        next: () => {
          // Filtramos el array local para que el producto desaparezca de la tabla sin recargar toda la página
          this.productos = this.productos.filter(p => p.id !== id);
          this.cdr.detectChanges();
          alert('✅ Producto eliminado con éxito.');
        },
        error: (err) => {
          console.error('❌ Error al eliminar:', err);
          alert('No se pudo eliminar el producto. Revisa la consola.');
        }
      });
    }
  }
}