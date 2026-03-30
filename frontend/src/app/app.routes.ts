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
// Guardianes
import { adminGuard } from './guards/admin-guard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  // 1. PÁGINAS PÚBLICAS
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'carrito', component: CarritoComponent },

  // 2. RUTAS DE USUARIO LOGUEADO (Cualquier Rol)
  { 
    path: 'perfil', 
    component: ProfileComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'dashboard', 
    // Si eres Admin vas al Dashboard, si no, podrías redirigir al Home o Perfil
    component: DashboardComponent, 
    canActivate: [authGuard] 
  },

  // 3. RUTAS PROTEGIDAS (Solo Administradores)
  { 
    path: 'productos', 
    component: ProductosListComponent, 
    canActivate: [adminGuard] 
  },
  { 
    path: 'nuevo-producto', 
    component: ProductoFormComponent, 
    canActivate: [adminGuard] 
  },
  { 
    path: 'editar-producto/:id', 
    component: ProductoFormComponent, 
    canActivate: [adminGuard] 
  },
  { 
    path: 'categorias', 
    component: CategoriasListComponent, 
    canActivate: [adminGuard] 
  },
  
  // NUEVA RUTA ACADÉMICA: Monitoreo de Base de Datos
  { 
    path: 'monitoreo', 
    component: MonitoreoComponent, 
    canActivate: [adminGuard] 
  },

  // Redirección comodín
  { path: '**', redirectTo: '' }
];