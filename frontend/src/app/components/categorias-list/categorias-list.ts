import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Categoria } from '../../models/producto.model'; // Importamos el modelo

@Component({
  selector: 'app-categorias-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categorias-list.html',
  styleUrl: './categorias-list.css' // Asegúrate de que este archivo exista, aunque esté vacío
})
export class CategoriasListComponent implements OnInit {
  // Inyectamos HttpClient directamente aquí para no crear un servicio extra por ahora
  private http = inject(HttpClient);
  private apiUrl = '/api/categorias/'; // Usando el Proxy

  // Variables para la vista
  categorias: Categoria[] = [];
  loading: boolean = true;
  error: string | null = null;

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.loading = true;
    this.error = null;

    this.http.get<Categoria[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.categorias = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.error = 'No se pudieron cargar las categorías. Revisa la conexión con el Backend.';
        this.loading = false;
      }
    });
  }
}