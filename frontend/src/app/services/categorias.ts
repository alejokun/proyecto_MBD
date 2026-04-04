import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private http = inject(HttpClient);
  private apiUrl = '/api/categorias/'; // Usando el Proxy configurado

  // Obtener todas las categorías (Prueba #21)
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  // Crear una nueva categoría (Prueba #22)
  // Recibe un objeto con nombre y descripción opcional
  crearCategoria(categoria: { nombre: string, descripcion?: string }): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria);
  }
} 