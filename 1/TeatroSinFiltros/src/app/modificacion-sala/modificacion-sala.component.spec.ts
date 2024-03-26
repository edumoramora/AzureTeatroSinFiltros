import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ModificacionSalaComponent } from './modificacion-sala.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('ModificacionSalaComponent', () => {
  let component: ModificacionSalaComponent;
  let fixture: ComponentFixture<ModificacionSalaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModificacionSalaComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificacionSalaComponent);
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

  it('debería llamar al método crearSala cuando se hace clic en el botón', () => {
    spyOn(component, 'crearSala');
    const buttonElement = fixture.debugElement.query(By.css('.btn-success')).nativeElement;
    buttonElement.click();
    expect(component.crearSala).toHaveBeenCalled();
  });

  it('debería mostrar mensaje de error cuando falta información', () => {
    component.errorMensaje = 'Falta información necesaria.';
    fixture.detectChanges();
    const alertElement = fixture.debugElement.query(By.css('.alert-danger')).nativeElement;
    expect(alertElement.textContent).toContain('Falta información necesaria.');
  });
})