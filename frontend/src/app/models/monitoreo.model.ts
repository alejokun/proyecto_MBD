export interface ConsultaSQL {
  id: number;
  consulta_sql: string;
  tiempo_ejecucion: string;
  fecha: string;
  metodo: string;
  ruta: string;
  usuario_nombre: string;
}

export interface ConsultasResponse {
  total: number;
  consultas: ConsultaSQL[];
  timestamp: string | null;
}