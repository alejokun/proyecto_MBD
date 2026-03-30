// src/app/components/producto-form/producto-form.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProductosService } from '../../services/productos';
import { HttpClient } from '@angular/common/http'; // Usamos el proxy directamente por ahora
import { Categoria, Producto } from '../../models/producto.model';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './producto-form.html'
})
export class ProductoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private prodService = inject(ProductosService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  categorias: Categoria[] = [];
  loading = false;
  isEditMode = false;
  productoId?: number;

  productoForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: [''],
    precio: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    id_categoria: [null as any, [Validators.required]]
  });

  ngOnInit(): void {
    // Cargar categorías directamente (manteniendo tu lógica de no crear servicios extra)
    this.http.get<Categoria[]>('http://localhost:8000/api/categorias/').subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error al cargar categorías', err)
    });

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.productoId = +id;
      this.cargarDatosProducto(this.productoId);
    }
  }

  cargarDatosProducto(id: number) {
    this.loading = true;
    this.prodService.getProductoById(id).subscribe({
      next: (prod: any) => {
        this.productoForm.patchValue({
          nombre: prod.nombre,
          descripcion: prod.descripcion,
          precio: prod.precio,
          stock: prod.stock,
          id_categoria: prod.id_categoria
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar producto', err);
        this.router.navigate(['/productos']);
      }
    });
  }

  onSubmit() {
    if (this.productoForm.invalid) return;
    this.loading = true;
    
    // Aseguramos que el ID de categoría sea un número
    const datos = {
      ...this.productoForm.value,
      id_categoria: Number(this.productoForm.value.id_categoria)
    };

    const operacion = this.isEditMode 
      ? this.prodService.updateProducto(this.productoId!, datos) 
      : this.prodService.crearProducto(datos);

    operacion.subscribe({
      next: () => {
        this.router.navigate(['/productos']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al guardar:', err);
      }
    });
  }
}