import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitoreoService } from '../../services/monitoreo.service';
import { ConsultaSQL } from '../../models/monitoreo.model';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-monitoreo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monitoreo.html',
  styleUrl: './monitoreo.css'
})
export class MonitoreoComponent implements OnInit, OnDestroy {
  private monitoreoService = inject(MonitoreoService);
  private cdr = inject(ChangeDetectorRef);
  
  consultas: ConsultaSQL[] = [];
  loading: boolean = true;
  pollSubscription?: Subscription;

  ngOnInit() {
    // Polling: Refresca cada 5 segundos automáticamente
    this.pollSubscription = timer(0, 5000)
      .pipe(
        switchMap(() => {
          this.loading = true; // Mostrar spinner en cada refresco si prefieres
          return this.monitoreoService.getConsultas();
        })
      )
      .subscribe({
        next: (res) => {
          // Validamos si la respuesta trae la propiedad 'consultas'
          if (res && res.consultas) {
            this.consultas = res.consultas;
            console.log('Consultas sincronizadas:', this.consultas.length);
          } else {
            console.warn('La respuesta no tiene el formato esperado:', res);
          }
          
          this.loading = false;
          // Forzamos a Angular a "pintar" los cambios recibidos
          this.cdr.detectChanges(); 
        },
        error: (err) => {
          console.error('Error en el flujo de monitoreo:', err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  ngOnDestroy() {
    // Es vital desuscribirse para evitar fugas de memoria y peticiones fantasma
    if (this.pollSubscription) {
      this.pollSubscription.unsubscribe();
      console.log('Polling de monitoreo detenido.');
    }
  }

  getMetodoClass(metodo: string): string {
    const colors: { [key: string]: string } = {
      'GET': 'bg-info',
      'POST': 'bg-success',
      'PUT': 'bg-warning',
      'DELETE': 'bg-danger'
    };
    return colors[metodo] || 'bg-secondary';
  }
}