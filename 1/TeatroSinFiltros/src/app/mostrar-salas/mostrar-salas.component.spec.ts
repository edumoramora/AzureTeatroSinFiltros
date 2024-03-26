import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MostrarSalasComponent } from './mostrar-salas.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
describe('MostrarSalasComponent', () => {
  let component: MostrarSalasComponent;
  let fixture: ComponentFixture<MostrarSalasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MostrarSalasComponent],
      imports: [HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MostrarSalasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('debería mostrar las salas correctamente', () => {
    component.salas = [
      { id_sala: 1, nombre_sala: 'Sala A', num_filas: 10, num_columnas: 20 },
      { id_sala: 2, nombre_sala: 'Sala B', num_filas: 15, num_columnas: 25 }
    ];
    fixture.detectChanges();
    const filasSalas = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(filasSalas.length).toEqual(2); 
  });

  it('debería llamar al método modificarSala', () => {
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate');
    component.modificarSala(1);
    expect(routerSpy).toHaveBeenCalledWith(['/modificacion-sala', 1 ]);
  });
  
  it('debería llamar al método eliminarSala cuando se hace clic en el botón Eliminar', () => {
    component.salas = [
      { id_sala: 1, nombre_sala: 'Sala Principal', num_filas: 10, num_columnas: 20 },
    ];
  
    fixture.detectChanges();
    spyOn(component, 'eliminarSala').and.callThrough();
    const btnEliminar = fixture.debugElement.nativeElement.querySelectorAll('.btn-danger')[0];
    btnEliminar.click();
    expect(component.eliminarSala).toHaveBeenCalledWith(component.salas[0].id_sala);
  });
});
