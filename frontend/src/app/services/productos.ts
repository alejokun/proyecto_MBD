import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private http = inject(HttpClient);
  
  // IMPORTANTE: La URL debe terminar en '/' para que Django no bloquee el GET
  private apiUrl = 'http://localhost:8000/api/productos/'; 

  // 1. Obtener todos los productos
  getProductos(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // 2. Obtener un producto por ID (para el formulario de edición)
  getProductoById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}${id}/`);
  }

  // 3. Crear un nuevo producto
  crearProducto(producto: any): Observable<any> {
    return this.http.post(this.apiUrl, producto);
  }

  // 4. Actualizar un producto existente
  updateProducto(id: number, producto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${id}/`, producto);
  }

  // 5. Eliminar un producto
  deleteProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}