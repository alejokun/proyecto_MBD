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

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'productos', component: ProductosListComponent },
  { path: 'nuevo-producto', component: ProductoFormComponent },
  { path: 'categorias', component: CategoriasListComponent },
  { path: 'movimientos', component: MovimientosListComponent },
  { path: 'nuevo-movimiento', component: MovimientosForm },
  { path: 'perfil', component: ProfileComponent },
];