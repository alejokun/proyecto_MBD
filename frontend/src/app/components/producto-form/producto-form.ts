import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProductosService } from '../../services/productos';
import { CategoriasService } from '../../services/categorias';
import { Categoria, Producto } from '../../models/producto.model';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './producto-form.html'
})
export class ProductoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private prodService = inject(ProductosService);
  private catService = inject(CategoriasService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  categorias: Categoria[] = [];
  loading = false;
  isEditMode = false;
  productoId?: number;

  // Variable para el modal (Soporta creación y edición)
  nuevaCat: any = { nombre: '', descripcion: '' };

  productoForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: [''],
    precio: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    id_categoria: [null as any, [Validators.required]]
  });

  ngOnInit(): void {
    this.cargarCategorias();
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.productoId = +id;
      this.cargarDatosProducto(this.productoId);
    }
  }

  cargarCategorias() {
    this.catService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  // --- GESTIÓN DE CATEGORÍAS (Pruebas #22, #23, #24) ---

  guardarCategoria() {
    if (!this.nuevaCat.nombre) return alert('El nombre es obligatorio');

    if (this.nuevaCat.id) {
      // PRUEBA #23: EDITAR
      this.catService.updateCategoria(this.nuevaCat.id, this.nuevaCat).subscribe({
        next: (res) => {
          const index = this.categorias.findIndex(c => c.id === res.id);
          this.categorias[index] = res;
          alert('✅ Categoría actualizada correctamente');
          this.nuevaCat = { nombre: '', descripcion: '' };
          this.cdr.detectChanges();
        }
      });
    } else {
      // PRUEBA #22: CREAR
      this.catService.crearCategoria(this.nuevaCat).subscribe({
        next: (catCreada) => {
          this.categorias.push(catCreada);
          this.productoForm.patchValue({ id_categoria: catCreada.id });
          alert('✅ Categoría creada y seleccionada');
          this.nuevaCat = { nombre: '', descripcion: '' };
          this.cdr.detectChanges();
        },
        error: () => alert('❌ Error: El nombre ya existe o no tienes permisos.')
      });
    }
  }

  prepararEdicionCat(cat: Categoria) {
    this.nuevaCat = { ...cat }; // Clonamos para editar
  }

  borrarCategoria(id: number) {
    if (confirm('¿Estás seguro? Se borrará permanentemente si no tiene productos.')) {
      this.catService.deleteCategoria(id).subscribe({
        next: () => {
          this.categorias = this.categorias.filter(c => c.id !== id);
          alert('✅ Categoría eliminada');
          this.cdr.detectChanges();
        },
        error: () => alert('❌ No se puede eliminar: Hay productos usando esta categoría.')
      });
    }
  }

  // --- GESTIÓN DE PRODUCTOS ---

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
        this.cdr.detectChanges();
      },
      error: () => this.router.navigate(['/productos'])
    });
  }

  onSubmit() {
    if (this.productoForm.invalid) return;
    this.loading = true;
    
    const datos = {
      ...this.productoForm.value,
      id_categoria: Number(this.productoForm.value.id_categoria)
    };

    const operacion = this.isEditMode 
      ? this.prodService.updateProducto(this.productoId!, datos) 
      : this.prodService.crearProducto(datos);

    operacion.subscribe({
      next: () => this.router.navigate(['/productos']),
      error: () => this.loading = false
    });
  }
}