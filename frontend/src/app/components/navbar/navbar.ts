// src/app/components/navbar/navbar.ts
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
    // Suscripción reactiva: Si el estado cambia en cualquier lado, el Navbar reacciona
    this.authService.isLoggedIn$.subscribe(status => this.isLoggedIn = status);
    this.authService.isAdmin$.subscribe(status => this.isAdmin = status);
  }

  logout() {
    this.authService.logout();
    // El servicio ya limpia el localStorage y redirige
  }
}