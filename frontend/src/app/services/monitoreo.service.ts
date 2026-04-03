import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ConsultasResponse, ConsultaSQL } from '../models/monitoreo.model';

@Injectable({ providedIn: 'root' })
export class MonitoreoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/monitoreo';

  getConsultas(): Observable<ConsultasResponse> {
    return this.http.get<ConsultasResponse>(`${this.apiUrl}/consultas/`);
  }

limpiarHistorial(dias: number = 7): Observable<any> {
  return this.http.delete(`${this.apiUrl}/limpiar/?dias=${dias}`);
}
}