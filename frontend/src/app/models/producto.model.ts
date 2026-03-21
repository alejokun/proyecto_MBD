// Modelo para los Productos
export interface Producto {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: string;       // El contrato de DeepSeek pide String "00.00"
  stock: number;
  id_categoria: number; // Foreign Key obligatoria
  fecha_creacion?: string;
  categoria_nombre?: string; // Solo lectura del backend
}

// Modelo para las Categorías (ESTO ES LO QUE TE FALTA EXPORTAR)
export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}