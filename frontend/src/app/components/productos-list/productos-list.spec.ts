import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ProductosListComponent } from './productos-list';
import { ProductosService } from '../../services/productos';

describe('ProductosListComponent', () => {
  let component: ProductosListComponent;
  let fixture: ComponentFixture<ProductosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosListComponent, RouterModule.forRoot([])],
      providers: [
        ProductosService,
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});