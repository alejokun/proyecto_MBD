import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-movimientos-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './movimientos-form.html',
  styleUrl: './movimientos-form.css'
})
export class MovimientosForm {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  productos: Producto[] = [];
  loading = false;

  movimientoForm = this.fb.group({
    id_producto: [null, [Validators.required]],
    tipo: ['entrada', [Validators.required]], // 'entrada' o 'salida'
    cantidad: [1, [Validators.required, Validators.min(1)]],
    observacion: [''],
    id_usuario: [1] // Por ahora estático, luego se saca del token
  });

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.http.get<Producto[]>('/api/productos/').subscribe(data => this.productos = data);
  }

  onSubmit() {
    if (this.movimientoForm.valid) {
      this.loading = true;
      this.http.post('/api/movimientos/', this.movimientoForm.value).subscribe({
        next: () => {
          alert('✅ Movimiento registrado y stock actualizado.');
          this.router.navigate(['/movimientos']);
        },
        error: (err) => {
          this.loading = false;
          console.error(err);
          alert('❌ Error al registrar movimiento.');
        }
      });
    }
  }
}