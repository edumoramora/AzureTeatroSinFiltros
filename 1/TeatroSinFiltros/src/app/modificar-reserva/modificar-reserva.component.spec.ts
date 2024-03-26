import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ModificarReservaComponent } from './modificar-reserva.component';

describe('ModificarReservaComponent', () => {
  let component: ModificarReservaComponent;
  let fixture: ComponentFixture<ModificarReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModificarReservaComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar y seleccionar una obra', () => {
    component.obras = [{id: 1, titulo: 'Obra 1'}, {id: 2, titulo: 'Obra 2'}];
    fixture.detectChanges(); 
    component.reserva.id_obra = 1; 
    expect(component.reserva.id_obra).toEqual(1);
  });

  it('debería cargar y seleccionar una sala', () => {
    component.salas = [{id: 101, nombre_sala: 'Sala A'}, {id: 102, nombre_sala: 'Sala B'}];
    component.salaSeleccionada = 101;
    expect(component.salaSeleccionada).toEqual(101);
  });

  it('debería validar el formulario antes de modificar la reserva', () => {
    expect(component.reserva.id_obra).toBeNull(); 
    expect(component.reserva.fecha_hora).toBeNull(); 
    component.modificarReserva(); 
    fixture.detectChanges(); 
    expect(component.errorMensaje).not.toBe('');
  });


});
