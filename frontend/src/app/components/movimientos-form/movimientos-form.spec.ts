import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientosForm } from './movimientos-form';

describe('MovimientosForm', () => {
  let component: MovimientosForm;
  let fixture: ComponentFixture<MovimientosForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimientosForm],
    }).compileComponents();

    fixture = TestBed.createComponent(MovimientosForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
