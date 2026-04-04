import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms'; // Añadido FormsModule para el modal
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProductosService } from '../../services/productos';
import { CategoriasService } from '../../services/categorias'; // Usamos tu servicio pro
import { Categoria } from '../../models/producto.model';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule], // Añadido FormsModule
  templateUrl: './producto-form.html'
})
export class ProductoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private prodService = inject(ProductosService);
  private catService = inject(CategoriasService); // Inyectamos el servicio de categorías
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  categorias: Categoria[] = [];
  loading = false;
  isEditMode = false;
  productoId?: number;

  // Variable para el modal de nueva categoría (Prueba #22)
  nuevaCat = { nombre: '', descripcion: '' };

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

  // --- Lógica de la Prueba #22 (El "2 por 1") ---
  crearNuevaCategoria() {
    if (!this.nuevaCat.nombre) return alert('El nombre es obligatorio');

    this.catService.crearCategoria(this.nuevaCat).subscribe({
      next: (catCreada) => {
        alert('✅ Categoría creada y seleccionada');
        this.categorias.push(catCreada); // La metemos al array local
        
        // Actualizamos el valor en el Formulario Reactivo automáticamente
        this.productoForm.patchValue({ id_categoria: catCreada.id });
        
        this.nuevaCat = { nombre: '', descripcion: '' }; // Limpiamos datos del modal
        this.cdr.detectChanges();
      },
      error: (err) => alert('❌ Error: El nombre ya existe o no tienes permisos de Admin.')
    });
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
        this.cdr.detectChanges();
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
    
    const datos = {
      ...this.productoForm.value,
      id_categoria: Number(this.productoForm.value.id_categoria)
    };

    const operacion = this.isEditMode 
      ? this.prodService.updateProducto(this.productoId!, datos) 
      : this.prodService.crearProducto(datos);

    operacion.subscribe({
      next: () => this.router.navigate(['/productos']),
      error: (err) => {
        this.loading = false;
        console.error('Error al guardar:', err);
      }
    });
  }
}