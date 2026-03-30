import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  // Usamos 127.0.0.1 para saltarnos bloqueos de red de Windows
  private apiUrl = 'http://127.0.0.1:8000/api/auth/'; 

  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  private adminStatus = new BehaviorSubject<boolean>(localStorage.getItem('role') === 'admin');

  isLoggedIn$ = this.loggedIn.asObservable();
  isAdmin$ = this.adminStatus.asObservable();

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}login/`, credentials).pipe(
      tap((res: any) => {
        const token = res.access || res.token;
        // Mapeo profesional: Django usa is_staff, nosotros usamos 'admin'
        const role = res.user?.is_staff ? 'admin' : 'user';

        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('role', role);
          localStorage.setItem('username', res.user?.username || '');
          
          this.loggedIn.next(true);
          this.adminStatus.next(role === 'admin');
        }
      })
    );
  }

  logout(): void {
    localStorage.clear();
    this.loggedIn.next(false);
    this.adminStatus.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean { return !!localStorage.getItem('token'); }
  getRole(): string | null { return localStorage.getItem('role'); }
  updateStatus(): void {
    this.loggedIn.next(!!localStorage.getItem('token'));
    this.adminStatus.next(localStorage.getItem('role') === 'admin');
  }
}