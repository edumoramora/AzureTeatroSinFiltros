import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing'; 
import { CrearSalaComponent } from './crear-sala.component';


describe('CrearSalaComponent', () => {
  let component: CrearSalaComponent;
  let fixture: ComponentFixture<CrearSalaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearSalaComponent ],
      imports: [
        FormsModule,
        HttpClientTestingModule 
      ]

    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearSalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });
  
  it('debería capturar el nombre de la sala directamente en la propiedad', () => {
    component.sala.nombre_sala = 'Sala Nueva';
    fixture.detectChanges();
    expect(component.sala.nombre_sala).toEqual('Sala Nueva');
  });

  it('debería tener el valor correcto en la propiedad num_filas', () => {
    component.sala.num_filas = 10;
    fixture.detectChanges();
    expect(component.sala.num_filas).toEqual(10);
  });

  it('debería tener el valor correcto en la propiedad num_columnas', () => {
    component.sala.num_columnas = 10;
    fixture.detectChanges();
    expect(component.sala.num_columnas).toEqual(10);
  });


  it('debería generar matriz de asientos correctamente', () => {
    component.sala.num_filas = 2;
    component.sala.num_columnas = 3;
    component.generarMatrizDeAsientos();
    expect(component.asientos.length).toBe(2);
    expect(component.asientos[0].length).toBe(3);
    expect(component.asientos[1][2].estado).toBe('libre');
  });

  it('debería alternar el estado de un asiento', () => {
    component.asientos = [[{ fila: 1, columna: 1, estado: 'libre' }]];
    const asiento = component.asientos[0][0];
    component.toggleSeat(asiento);
    expect(asiento.estado).toBe('ocupado');
  });

  it('debería guardar los asientos seleccionados', () => {
    const spySetItem = spyOn(localStorage, 'setItem');
    component.selectedSeatIds = [1, 2, 3];
    component.saveSelectedSeats();
    expect(spySetItem).toHaveBeenCalledWith('occupiedSeats', JSON.stringify([1, 2, 3]));
  });

  it('debería mostrar un mensaje de error si falta información al crear la sala', () => {
    component.onSubmit();
    expect(component.errorMensaje).not.toBe('');
  });
});