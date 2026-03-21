import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-movimientos-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movimientos-list.html',
  styleUrl: './movimientos-list.css'
})
export class MovimientosListComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = '/api/movimientos/';

  movimientos: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  ngOnInit(): void {
    this.cargarMovimientos();
  }

  cargarMovimientos(): void {
    this.loading = true;
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.movimientos = data.reverse(); // Los más nuevos primero
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar movimientos:', err);
        this.error = 'No se pudo obtener el historial de movimientos.';
        this.loading = false;
      }
    });
  }
}