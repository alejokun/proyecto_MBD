import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProductosService } from '../../services/productos';
import { CategoriasService } from '../../services/categorias';
import { Categoria } from '../../models/producto.model';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './producto-form.html'
})
export class ProductoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private prodService = inject(ProductosService);
  private catService = inject(CategoriasService);
  private router = inject(Router);

  categorias: Categoria[] = [];
  loading = false;

  // Definimos el formulario con las reglas del contrato de DeepSeek
  productoForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: [''],
    precio: ['0.00', [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    id_categoria: [null, [Validators.required]]
  });

  ngOnInit(): void {
    // Necesitamos las categorías para el desplegable (Select)
    this.catService.getCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  onSubmit() {
    if (this.productoForm.valid) {
      this.loading = true;
      this.prodService.crearProducto(this.productoForm.value as any).subscribe({
        next: () => {
          alert('✅ Producto guardado correctamente.');
          this.router.navigate(['/productos']);
        },
        error: (err) => {
          this.loading = false;
          alert('❌ Error al guardar. Revisa los datos.');
          console.error(err);
        }
      });
    }
  }
}