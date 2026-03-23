import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProductosService } from '../../services/productos';
import { CategoriasService } from '../../services/categorias';
import { Categoria, Producto } from '../../models/producto.model';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './producto-form.html'
})
export class ProductoFormComponent implements OnInit {
  // Inyecciones
  private fb = inject(FormBuilder);
  private prodService = inject(ProductosService);
  private catService = inject(CategoriasService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); // <-- Para leer el ID de la URL

  // Estados
  categorias: Categoria[] = [];
  loading = false;
  isEditMode = false; // <-- Bandera para saber si creamos o editamos
  productoId?: number;

  // Definición del Formulario
  productoForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: [''],
    precio: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    id_categoria: [null as any, [Validators.required]]
  });

  ngOnInit(): void {
    // 1. Cargar categorías para el select
    this.catService.getCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error al cargar categorías', err)
    });

    // 2. Lógica de Edición: ¿Hay un ID en la ruta?
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
        // Rellenamos el formulario con lo que nos mandó Django
        this.productoForm.patchValue({
          nombre: prod.nombre,
          descripcion: prod.descripcion,
          precio: prod.precio,
          stock: prod.stock,
          id_categoria: prod.id_categoria // Asegúrate que tu API mande este campo
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar producto', err);
        alert('No se pudo obtener la información del producto.');
        this.router.navigate(['/productos']);
      }
    });
  }

  onSubmit() {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const datos = this.productoForm.value as any;

    // Decidimos si llamar a Crear o a Actualizar
    const operacion = this.isEditMode 
      ? this.prodService.updateProducto(this.productoId!, datos) 
      : this.prodService.crearProducto(datos);

    operacion.subscribe({
      next: () => {
        alert(this.isEditMode ? '✅ ¡Producto actualizado!' : '✅ ¡Producto creado!');
        this.router.navigate(['/productos']);
      },
      error: (err) => {
        this.loading = false;
        alert('❌ Error al guardar. Revisa la consola.');
        console.error(err);
      }
    });
  }
}