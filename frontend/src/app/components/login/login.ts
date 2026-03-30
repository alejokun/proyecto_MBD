import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService); 

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  errorMsg: string | null = null;
  loading: boolean = false;

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMsg = null;

this.authService.login(this.loginForm.value).subscribe({
  next: () => {
    this.loading = false;
    
    if (this.authService.getRole() === 'admin') {
      // El Admin sí puede ir directo al Dashboard/Panel
      this.router.navigate(['/dashboard']); 
    } else {
      // EL CAMBIO: El usuario común ahora va al Home
      this.router.navigate(['/']); 
    }
  },
        error: (err) => {
          this.loading = false;
          this.errorMsg = 'Error: No se pudo conectar con el servidor o credenciales inválidas.';
          console.error('Detalle del error:', err);
        }
      });
    }
  }
}