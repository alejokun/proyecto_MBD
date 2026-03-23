import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // <--- Importado

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService); // <--- Inyectado

  // Variables para mostrar en la interfaz
  username: string | null = '';
  role: string = '';
  is_staff: boolean = false;
  fechaIngreso: string = '';

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.username = localStorage.getItem('username');
    this.is_staff = localStorage.getItem('is_staff') === 'true';
    this.role = this.is_staff ? 'Administrador del Sistema' : 'Operador de Inventario';
    
    // Fecha simulada para el diseño
    this.fechaIngreso = new Date().toLocaleDateString();
  }

  cerrarSesion() {
    // Borra todo del localStorage y avisa al Navbar
    this.authService.logout(); 
    this.router.navigate(['/login']);
  }
}