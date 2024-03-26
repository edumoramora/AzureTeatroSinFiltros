import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObrasInfoComponent } from './obras-info.component';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

describe('ObrasInfoComponent', () => {
  let component: ObrasInfoComponent;
  let fixture: ComponentFixture<ObrasInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObrasInfoComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule, FormsModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObrasInfoComponent);
    component = fixture.componentInstance;
    component.obra = { imagen_url: '', titulo: 'Título de Prueba', descripcion: 'Descripción de Prueba', duracion: '120 min', categoria: 'Drama' };
    component.actores = [{ id: 1, nombre: 'Actor 1', imagen_url: '', actor_id: 1 }];
    component.isLoggedIn = true; 
    fixture.detectChanges();
  });


  it('debería renderizar los detalles de la obra correctamente', () => {
    const tituloEl = fixture.debugElement.query(By.css('.obra-info h2')).nativeElement;
    expect(tituloEl.textContent).toContain('Título de Prueba');
  });

  it('debería listar correctamente a los actores asociados', () => {
    const actoresItems = fixture.debugElement.queryAll(By.css('.actor-item'));
    expect(actoresItems.length).toBe(1); 
  });

  it('debería mostrar el botón Eliminar solo si el usuario está logueado', () => {
    const btnEliminar = fixture.debugElement.query(By.css('.btn-danger'));
    expect(btnEliminar).toBeTruthy();
  });

});