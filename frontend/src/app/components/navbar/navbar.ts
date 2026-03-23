import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoggedIn = false;
  isAdmin = false;

  ngOnInit() {
    // Escuchamos los cambios del servicio de autenticación
    this.authService.isLoggedIn$.subscribe(status => this.isLoggedIn = status);
    this.authService.isAdmin$.subscribe(status => this.isAdmin = status);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']); // Al cerrar sesión, lo mandamos al Home público
  }
}