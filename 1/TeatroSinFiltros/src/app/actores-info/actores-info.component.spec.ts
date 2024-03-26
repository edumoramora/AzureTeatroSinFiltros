
import { ActoresInfoComponent } from './actores-info.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { RouterTestingModule } from '@angular/router/testing';

describe('ActorInfoComponent', () => {
  let component: ActoresInfoComponent;
  let fixture: ComponentFixture<ActoresInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [ActoresInfoComponent],
      
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActoresInfoComponent);
    component = fixture.componentInstance;
  
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar la imagen y la información del actor', () => {
    component.actor = { nombre: 'Nombre del Actor', descripcion: 'Descripción del Actor', imagen_url: 'url-de-la-imagen.jpg' };
    fixture.detectChanges();
    const imagen = fixture.debugElement.query(By.css('.actor-imagen')).nativeElement;
    const nombre = fixture.debugElement.query(By.css('.actor-info-container h2')).nativeElement;
    const descripcion = fixture.debugElement.query(By.css('.actor-info-container p')).nativeElement;
  
    expect(imagen.src).toContain('url-de-la-imagen.jpg');
    expect(nombre.textContent).toContain('Nombre del Actor');
    expect(descripcion.textContent).toContain('Descripción del Actor');
  });

  it('debería listar las obras en las que participa el actor', () => {
    component.obras = [{ titulo: 'Título de la Obra', imagen_url: 'url-de-la-imagen-obra.jpg', obra_id: '1' }];
    fixture.detectChanges();
    const obrasItems = fixture.debugElement.queryAll(By.css('.obra-item'));
    expect(obrasItems.length).toEqual(1);
  });

  it('debería mostrar la opción de añadir a nueva obra si el usuario está logueado', () => {
    component.isLoggedIn = true;
    fixture.detectChanges();
    const anadirObraSection = fixture.debugElement.query(By.css('.mt-4'));
    expect(anadirObraSection).toBeTruthy();
  });
});
