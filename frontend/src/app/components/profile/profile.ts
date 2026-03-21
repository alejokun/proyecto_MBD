import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  private router = inject(Router);

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
    
    // Una fecha simulada para el diseño, ya que el backend no la manda en el login
    this.fechaIngreso = new Date().toLocaleDateString();
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}