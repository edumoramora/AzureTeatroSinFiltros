import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { SalaComponent } from './sala.component';
import { AsientosService } from '../services/asientos.service';
import { ReservaService } from '../services/reserva.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('SalaComponent', () => {
  let component: SalaComponent;
  let fixture: ComponentFixture<SalaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [SalaComponent],
      providers: [
        AsientosService,
        ReservaService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe organizar los asientos correctamente', () => {
    const asientosMock = [
      { fila: 1, id_asiento: 1, estado: 'disponible' },
      { fila: 2, id_asiento: 2, estado: 'disponible' }
    
    ];

    const asientosOrganizados = component.organizarAsientos(asientosMock);
    expect(asientosOrganizados.length).toBeGreaterThan(0);
    expect(asientosOrganizados[0].length).toEqual(1); 
  });

  it('debe alternar el estado de un asiento y actualizar el contador de asientos seleccionados', () => {
    const asientoMock = { id_asiento: 1, estado: 'disponible' };
    component.asientos = [[asientoMock]]; 
    component.toggleSeat(asientoMock);
    expect(asientoMock.estado).toEqual('seleccionado');
    component.updateSelectedCount();
    expect(component.selectedSeatsCount).toEqual(1);
  });

  it('debe actualizar correctamente el conteo de asientos seleccionados', () => {
    component.asientos = [
      [{ id_asiento: 1, estado: 'seleccionado' }],
      [{ id_asiento: 2, estado: 'disponible' }]
    ];
    component.updateSelectedCount();
    expect(component.selectedSeatsCount).toEqual(1);
  });

  it('debe guardar los asientos seleccionados en el almacenamiento local', () => {
    spyOn(localStorage, 'setItem');
    component.asientos = [
      [{ id_asiento: 1, estado: 'seleccionado' }],
      [{ id_asiento: 2, estado: 'disponible' }]
    ];
    component.saveSelectedSeats();
    expect(localStorage.setItem).toHaveBeenCalledWith('selectedSeats', JSON.stringify([0]));
  });

  it('debe cargar los asientos seleccionados previamente del almacenamiento local', () => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([0]));
    component.asientos = [
      [{ id_asiento: 1, estado: 'disponible' }],
      [{ id_asiento: 2, estado: 'disponible' }]
    ];
    component.loadSelectedSeats();
    expect(component.asientos.flat()[0].estado).toEqual('seleccionado');
  });

});