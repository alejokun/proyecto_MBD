import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-monitoreo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2 class="fw-bold">Módulo de Monitoreo</h2>
      <p class="text-muted">Capturando consultas SQL...</p>
    </div>
  `
})
// ¡ESTA LÍNEA ES LA CLAVE! 
// Asegúrate de que diga 'export' y que el nombre coincida con el import
export class MonitoreoComponent { 
}