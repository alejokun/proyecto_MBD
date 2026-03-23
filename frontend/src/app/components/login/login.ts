import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService); 

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  errorMsg: string | null = null;
  loading: boolean = false;

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMsg = null;

      this.http.post<any>('/api/auth/login/', this.loginForm.value).subscribe({
        next: (res) => {
          // Guardamos los datos en el navegador
          localStorage.setItem('access', res.access);
          localStorage.setItem('refresh', res.refresh);
          localStorage.setItem('username', res.user.username);
          localStorage.setItem('is_staff', res.user.is_staff.toString());
          
          // Avisamos al Navbar para que cambie sus botones
          this.authService.updateStatus(); 
          
          this.loading = false;

          // REDIRECCIÓN SEGÚN ROL:
          if (res.user.is_staff) {
            // El Admin va al Panel de Control
            this.router.navigate(['/dashboard']); 
          } else {
            // El Usuario Común va directo al Catálogo (Home)
            this.router.navigate(['/']); 
          }
        },
        error: (err) => {
          this.loading = false;
          this.errorMsg = 'Usuario o contraseña incorrectos. Intenta de nuevo.';
          console.error('Error de login:', err);
        }
      });
    }
  }
}