// src/app/components/categorias-list/categorias-list.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Categoria } from '../../models/producto.model';

@Component({
  selector: 'app-categorias-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categorias-list.html',
  styleUrl: './categorias-list.css'
})
export class CategoriasListComponent implements OnInit {
  private http = inject(HttpClient);
  // URL completa para evitar problemas de proxy
  private apiUrl = 'http://localhost:8000/api/categorias/'; 

  categorias: Categoria[] = [];
  loading: boolean = true;
  error: string | null = null;

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.loading = true;
    this.http.get<Categoria[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.categorias = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.error = 'No se pudieron cargar las categorías.';
        this.loading = false;
      }
    });
  }
}