import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComprobarEntradasComponent } from './comprobar-entradas.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ComprobarEntradasComponent', () => {
  let component: ComprobarEntradasComponent;
  let fixture: ComponentFixture<ComprobarEntradasComponent>;
  let reservasServiceMock: any;

  beforeEach(async () => {
    reservasServiceMock = {
      obtenerReservas: jasmine.createSpy('obtenerReservas').and.returnValue(of([
       
        { id_reservas: 1, nombre_usuario: 'Usuario 1', cantidad_butacas: 2, id_reservas_teatrales: 101 },
      ])),
      eliminarReserva: jasmine.createSpy('eliminarReserva').and.returnValue(of({})) // Simula la eliminación
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ComprobarEntradasComponent],
     
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprobarEntradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar reservas correctamente', () => {
    component.reserva = [{ id_reservas: 1, nombre_usuario: 'Usuario 1', cantidad_butacas: 2, id_reservas_teatrales: 101 }];
    fixture.detectChanges();
    const filasReservas = fixture.debugElement.queryAll(By.css('table tbody tr'));
    expect(filasReservas.length).toBeGreaterThan(0, 'Debería haber al menos una reserva mostrada en la tabla');
  });

  it('debería llamar a eliminarReserva cuando se hace clic en el botón de eliminar', () => {
    spyOn(component, 'eliminarReserva').and.callThrough();
    component.reserva = [{ id_reservas: 1, nombre_usuario: 'Usuario 1', cantidad_butacas: 2, id_reservas_teatrales: 101 }];
    fixture.detectChanges();
    const botonEliminar = fixture.debugElement.query(By.css('.btn-danger'));
    if (botonEliminar) {
      botonEliminar.nativeElement.click();
      expect(component.eliminarReserva).toHaveBeenCalled(); // Verifica que se llamó al método
    } else {
      fail('El botón de eliminar no se encontró en el DOM');
    }
  });
  
});
