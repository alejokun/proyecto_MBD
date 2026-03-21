import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
          // Guardamos los tokens según el contrato de DeepSeek
          localStorage.setItem('access', res.access);
          localStorage.setItem('refresh', res.refresh);
          localStorage.setItem('username', res.user.username);
          localStorage.setItem('is_staff', res.user.is_staff.toString());
          
          this.loading = false;
          this.router.navigate(['/dashboard']); // ¡Adentro!
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