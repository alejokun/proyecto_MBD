import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; // <--- Importamos ChangeDetectorRef
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
  private cdr = inject(ChangeDetectorRef); // <--- Inyectamos el "despertador"
  
  productos: Producto[] = [];
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;
  loading: boolean = true;

  ngOnInit() {
    // Sincronización de estado
    this.isLoggedIn = !!localStorage.getItem('access');
    this.isAdmin = localStorage.getItem('is_staff') === 'true';

    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      this.isAdmin = localStorage.getItem('is_staff') === 'true';
      this.cdr.detectChanges(); // Avisamos que el login cambió
    });

    this.cargarProductos();
  }

  cargarProductos() {
    this.loading = true;
    // Forzamos que el spinner se vea
    this.cdr.detectChanges();

    this.prodService.getProductos().subscribe({
      next: (data) => {
        console.log('✅ Django envió los datos:', data);
        this.productos = data;
        this.loading = false;
        
        // !!! ESTO ES LO VITAL !!!
        // Obliga a Angular a renderizar los productos AHORA mismo.
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