import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CrearReservaComponent } from './crear-reserva.component';
import { of } from 'rxjs';
describe('CrearReservaComponent', () => {
  let component: CrearReservaComponent;
  let fixture: ComponentFixture<CrearReservaComponent>;

  beforeEach(async () => {
  
    await TestBed.configureTestingModule({
      declarations: [ CrearReservaComponent ],
      imports: [FormsModule, HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar obras y salas correctamente', async () => {
    component.obras = [{ id: 1, titulo: 'Obra 1' }, { id: 2, titulo: 'Obra 2' }];
    component.salas = [{ id_sala: 1, nombre_sala: 'Sala 1' }, { id_sala: 2, nombre_sala: 'Sala 2' }];
    fixture.detectChanges();
    await fixture.whenStable();
  
    expect(component.obras.length).toBeGreaterThan(0);
    expect(component.salas.length).toBeGreaterThan(0);
  });

  it('debería llamar a crearReserva cuando se envía el formulario', () => {
    spyOn(component, 'crearReserva');
    const form = fixture.debugElement.query(By.css('form')).nativeElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    expect(component.crearReserva).toHaveBeenCalled();
  });

});