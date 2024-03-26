import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ActoresComponent } from './actores.component';
import { ActoresService } from '../services/actores.service';
import { of } from 'rxjs';

describe('ActoresComponent', () => {
  let component: ActoresComponent;
  let fixture: ComponentFixture<ActoresComponent>;
  let actoresServiceMock: any;

  beforeEach(async () => {
    actoresServiceMock = {
      getActores: jasmine.createSpy('getActores').and.returnValue(of([{ id: 1, nombre: 'Actor 1', imagen_url: 'url-de-imagen-1.jpg' }])) // Retorna un Observable mockeado
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [ActoresComponent],
      providers: [
        { provide: ActoresService, useValue: actoresServiceMock } // Usa el mock en lugar del servicio real
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });


  it('debería mostrar los actores destacados', () => {
    component.actores = [{ id: 1, nombre: 'Actor 1', imagen_url: 'url-de-imagen-1.jpg' }];
    fixture.detectChanges();
    const actorCards = fixture.debugElement.queryAll(By.css('.actor-card'));
    expect(actorCards.length).toEqual(1);
    expect(actorCards[0].query(By.css('.actor-name')).nativeElement.textContent).toContain('Actor 1');
  });

  it('debería mostrar los botones de administración solo si el usuario está logueado', () => {
    component.isLoggedIn = true;
    fixture.detectChanges();
    const adminButtons = fixture.debugElement.queryAll(By.css('.admin-buttons'));
    expect(adminButtons.length).toBeGreaterThan(0, 'Los botones de administración deberían mostrarse cuando el usuario está logueado');
  });

});
