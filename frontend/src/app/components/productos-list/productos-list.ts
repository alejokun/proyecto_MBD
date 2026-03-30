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
  private prodService = inject(ProductosService);
  private cdr = inject(ChangeDetectorRef);

  productos: Producto[] = [];
  loading: boolean = true;
  errorMsg: string | null = null;

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.loading = true;
    this.errorMsg = null;
    this.cdr.detectChanges();

    this.prodService.getProductos().subscribe({
      next: (data: any) => {
        this.productos = Array.isArray(data) ? data : (data.results || []);
        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: (err: any) => { // <-- Añadido : any
        console.error('❌ Error al obtener productos:', err);
        this.errorMsg = 'Error de conexión con el servidor.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.prodService.deleteProducto(id).subscribe({
        next: () => {
          this.productos = this.productos.filter(p => p.id !== id);
          this.cdr.detectChanges();
          alert('✅ Producto eliminado con éxito.');
        },
        error: (err: any) => { // <-- Añadido : any
          console.error('❌ Error al eliminar:', err);
          alert('No se pudo eliminar el producto. Revisa la consola.');
        }
      });
    }
  }
}