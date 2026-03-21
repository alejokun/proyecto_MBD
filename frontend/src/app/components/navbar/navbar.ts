import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  private router = inject(Router);

  // Variables de estado del usuario
  isLoggedIn: boolean = false;
  username: string | null = '';
  isAdmin: boolean = false;

  ngOnInit(): void {
    this.checkUserStatus();
  }

  checkUserStatus() {
    const token = localStorage.getItem('access');
    this.isLoggedIn = !!token;
    this.username = localStorage.getItem('username');
    this.isAdmin = localStorage.getItem('is_staff') === 'true';
  }

  logout() {
    // Limpiamos todo el rastro
    localStorage.clear();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}