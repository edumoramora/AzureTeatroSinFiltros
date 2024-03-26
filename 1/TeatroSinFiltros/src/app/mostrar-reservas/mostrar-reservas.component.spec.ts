import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MostrarReservasComponent } from './mostrar-reservas.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { ReservaService } from '../services/reserva.service';
import { of } from 'rxjs';

describe('MostrarReservasComponent', () => {
  let component: MostrarReservasComponent;
  let fixture: ComponentFixture<MostrarReservasComponent>;
  let reservasServiceSpy: jasmine.SpyObj<ReservaService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MostrarReservasComponent],
      imports: [
        HttpClientTestingModule, 
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    reservasServiceSpy = jasmine.createSpyObj('ReservaService', ['eliminarReserva']);
    TestBed.configureTestingModule({
      providers: [{ provide: ReservaService, useValue: reservasServiceSpy }]
    });
    fixture = TestBed.createComponent(MostrarReservasComponent);
    component = fixture.componentInstance;
    fixture = TestBed.createComponent(MostrarReservasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar las reservas teatrales correctamente', () => {
    component.reservas = [
      { id_reservas_teatrales: 1, obra: 'Obra A', sala: 'Sala 1', fecha_hora: new Date('2023-01-01T20:00:00') },
      { id_reservas_teatrales: 2, obra: 'Obra B', sala: 'Sala 2', fecha_hora: new Date('2023-01-02T20:00:00') }
    ];
    fixture.detectChanges();
    const filasReservas = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(filasReservas.length).toEqual(2); 
  });
  
  it('debería llamar al método modificarReserva', () => {
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');
    component.modificarReserva(1);
    expect(routerSpy).toHaveBeenCalledWith(['/modificar-reserva', 1 ]);
  });

 it('debería llamar al método para eliminar una reserva', () => {
  component.reservas = [{
    id_reservas_teatrales: 1,
    obra: 'Obra de Prueba',
    sala: 'Sala de Prueba',
    fecha_hora: new Date(),
  }];
  const reservaParaEliminar = component.reservas[0];
  spyOn(window, 'confirm').and.returnValue(true);
  spyOn(component, 'eliminarReserva').and.callThrough();
  component.eliminarReserva(reservaParaEliminar.id_reservas_teatrales);
  expect(component.eliminarReserva).toHaveBeenCalledWith(reservaParaEliminar.id_reservas_teatrales);
});
  
});
