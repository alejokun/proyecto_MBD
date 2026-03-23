import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ProductosListComponent } from './components/productos-list/productos-list';
import { ProductoFormComponent } from './components/producto-form/producto-form';
import { CategoriasListComponent } from './components/categorias-list/categorias-list';
import { MovimientosListComponent } from './components/movimientos-list/movimientos-list';
import { MovimientosForm } from './components/movimientos-form/movimientos-form';
import { ProfileComponent } from './components/profile/profile';
import { HomeComponent } from './components/home/home';

// Importamos el guardián que creamos hace un momento
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  // 1. PÁGINA DE INICIO (Pública)
  { path: '', component: HomeComponent },
  
  // 2. AUTENTICACIÓN
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // 3. RUTAS PROTEGIDAS (Solo Administradores)
  { 
    path: 'nuevo-producto', 
    component: ProductoFormComponent, 
    canActivate: [adminGuard] 
  },
  { 
    path: 'categorias', 
    component: CategoriasListComponent, 
    canActivate: [adminGuard] 
  },

  // 4. RUTAS DE USUARIO LOGUEADO (Cualquier Rol)
  { path: 'dashboard', component: DashboardComponent },
  { path: 'productos', component: ProductosListComponent },
  { path: 'movimientos', component: MovimientosListComponent },
  { path: 'nuevo-movimiento', component: MovimientosForm },
  { path: 'perfil', component: ProfileComponent },

  // Redirección por si escriben cualquier otra cosa (Comodín)
  { path: '**', redirectTo: '' }
];