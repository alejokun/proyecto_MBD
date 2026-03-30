import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http'; // Necesario para que no falle la prueba
import { ProductosService } from './productos'; // <-- CAMBIO AQUÍ

describe('ProductosService', () => { // <-- CAMBIO AQUÍ
  let service: ProductosService; // <-- CAMBIO AQUÍ

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductosService, provideHttpClient()] // Añadimos el cliente HTTP
    });
    service = TestBed.inject(ProductosService); // <-- CAMBIO AQUÍ
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});