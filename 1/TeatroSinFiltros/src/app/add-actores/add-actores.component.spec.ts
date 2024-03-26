import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AddActoresComponent } from './add-actores.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('AddActoresComponent', () => {
  let component: AddActoresComponent;
  let fixture: ComponentFixture<AddActoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule],
      declarations: [AddActoresComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(new Map<string, string>([['id', '123']])),
           
          }
        }
      ]
    });
    fixture = TestBed.createComponent(AddActoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Deberia crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería renderizar el formulario de actores', () => {
    const compilado = fixture.debugElement.nativeElement;
    expect(compilado.querySelector('form')).toBeTruthy();
    expect(compilado.querySelector('#nombre')).toBeTruthy();
    expect(compilado.querySelector('#imagen')).toBeTruthy();
    expect(compilado.querySelector('#descripcion')).toBeTruthy();
  });


  it('debería mostrar la vista previa de la imagen cuando se proporciona una URL de imagen válida', () => {
    component.actor.imagen_url = 'https://ejemplo.com/imagen.jpg';
    fixture.detectChanges();
    const vistaPreviaImagen = fixture.debugElement.query(By.css('.image-preview img'));
    expect(vistaPreviaImagen).toBeTruthy();
    expect(vistaPreviaImagen.nativeElement.src).toContain('https://ejemplo.com/imagen.jpg');
  });

  it('debería mostrar el mensaje de error cuando errorMessage no está vacío', () => {
    component.errorMessage = 'Error al añadir actor';
    fixture.detectChanges();
    const alertaError = fixture.debugElement.query(By.css('.alert.alert-danger'));
    expect(alertaError).toBeTruthy();
    expect(alertaError.nativeElement.textContent).toContain('Error al añadir actor');
  });

  it('debería llamar a onSubmit cuando se envía el formulario', () => {
    spyOn(component, 'onSubmit').and.callThrough();
    const form = fixture.debugElement.query(By.css('form')).nativeElement;
    form.dispatchEvent(new Event('submit'));
    expect(component.onSubmit).toHaveBeenCalled();
  });

});
