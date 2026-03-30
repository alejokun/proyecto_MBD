import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductosService } from '../../services/productos';
import { AuthService } from '../../services/auth.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  private prodService = inject(ProductosService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef); 
  
  productos: Producto[] = [];
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;
  loading: boolean = true;

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      this.cdr.detectChanges();
    });
    
    this.authService.isAdmin$.subscribe(status => {
      this.isAdmin = status;
      this.cdr.detectChanges();
    });

    this.cargarProductos();
  }

  // --- LÓGICA DEL CARRITO (DATOS QUEMADOS) ---
  agregarAlCarrito(producto: Producto) {
    // 1. Obtener lo que hay en el navegador
    const carritoActual = JSON.parse(localStorage.getItem('carrito_mbd') || '[]');

    // 2. Buscar si ya existe para no duplicar filas
    const index = carritoActual.findIndex((p: any) => p.id === producto.id);

    if (index >= 0) {
      carritoActual[index].cantidad++;
    } else {
      // Guardamos lo básico para no saturar el LocalStorage
      carritoActual.push({
        id: producto.id,
        nombre: producto.nombre,
        cantidad: 1
      });
    }

    // 3. Guardar y avisar
    localStorage.setItem('carrito_mbd', JSON.stringify(carritoActual));
    alert(`🛒 Se añadió "${producto.nombre}" a tu solicitud.`);
  }

  cargarProductos() {
    this.loading = true;
    this.cdr.detectChanges();

    this.prodService.getProductos().subscribe({
      next: (data) => {
        console.log('✅ Django envió los datos:', data);
        this.productos = data;
        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('❌ Error capturado:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}