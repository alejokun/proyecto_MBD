import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ProductosListComponent } from './components/productos-list/productos-list';
import { ProductoFormComponent } from './components/producto-form/producto-form';
import { CategoriasListComponent } from './components/categorias-list/categorias-list';
import { ProfileComponent } from './components/profile/profile';
import { HomeComponent } from './components/home/home';
import { CarritoComponent } from './components/carrito/carrito';
import { MonitoreoComponent } from './components/monitoreo/monitoreo';

// Guardianes funcionales
import { adminGuard } from './guards/admin-guard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  // --------------------------------------------------------
  // 1. RUTAS PÚBLICAS (Abiertas para todos)
  // --------------------------------------------------------
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'carrito', component: CarritoComponent },

  // --------------------------------------------------------
  // 2. RUTAS DE USUARIO (Requieren solo estar logueado)
  // --------------------------------------------------------
  { 
    path: 'perfil', 
    component: ProfileComponent, 
    canActivate: [authGuard] 
  },

  // --------------------------------------------------------
  // 3. BLOQUE ADMINISTRATIVO (Doble Candado: Auth + Admin)
  // --------------------------------------------------------
  {
    path: '',
    canActivate: [authGuard, adminGuard], // Si falla uno, no entra a nada de abajo
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'productos', component: ProductosListComponent },
      { path: 'nuevo-producto', component: ProductoFormComponent },
      { path: 'editar-producto/:id', component: ProductoFormComponent },
      { path: 'categorias', component: CategoriasListComponent },
      { path: 'monitoreo', component: MonitoreoComponent },
    ]
  },

  // --------------------------------------------------------
  // 4. MANEJO DE ERRORES
  // --------------------------------------------------------
  { path: '**', redirectTo: '' }
];