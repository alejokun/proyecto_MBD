import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../models/auth.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8000/api/auth'; 
  private readonly TOKEN_KEY = 'auth_token';

  login(credentials: any) {
    return this.http.post<LoginResponse>(`${this.API_URL}/login/`, credentials)
      .pipe(
        tap(res => {
          if (res.access) localStorage.setItem(this.TOKEN_KEY, res.access);
        })
      );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}