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

  // 1. Obtener todas las categorías (Prueba #21)
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  // 2. Crear una nueva categoría (Prueba #22)
  crearCategoria(categoria: { nombre: string, descripcion?: string }): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria);
  }

  // 3. Editar una categoría existente (Prueba #23)
  // Se concatena el ID al final de la URL: /api/categorias/ID/
  updateCategoria(id: number, categoria: { nombre: string, descripcion?: string }): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}${id}/`, categoria);
  }

  // 4. Eliminar una categoría (Prueba #24)
  // Recuerda que fallará si tiene productos vinculados (Integridad de la BD)
  deleteCategoria(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}