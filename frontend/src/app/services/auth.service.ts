import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // El BehaviorSubject guarda el estado actual (true/false)
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private isAdmin = new BehaviorSubject<boolean>(this.checkAdmin());

  // Estos son los "observables" que los componentes van a escuchar
  isLoggedIn$ = this.loggedIn.asObservable();
  isAdmin$ = this.isAdmin.asObservable();

  constructor() {}

  private hasToken(): boolean {
    return !!localStorage.getItem('access');
  }

  private checkAdmin(): boolean {
    return localStorage.getItem('is_staff') === 'true';
  }

  // Método mágico para avisar a todos que el estado cambió
  updateStatus() {
    this.loggedIn.next(this.hasToken());
    this.isAdmin.next(this.checkAdmin());
  }

  logout() {
    localStorage.clear();
    this.updateStatus();
  }
}