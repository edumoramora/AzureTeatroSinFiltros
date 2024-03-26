import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { AuthenticationService } from '../services/authentication.service';
import { ReservaService } from '../services/reserva-teatral.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

class AuthenticationServiceMock {
  isLoggedIn$ = of(true); 
  getUserRole = jasmine.createSpy().and.returnValue('admin'); 
}

class ReservaServiceMock {
  getReservasObras = jasmine.createSpy().and.returnValue(of([
    { id: 1, name: 'Obra 1', descripcion: 'Descripción 1', imagen_url: 'http://example.com/obra1.jpg', id_reservas_teatrales: 'Sala1' },
   
  ]));
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      declarations: [HomeComponent],
      providers: [
        { provide: AuthenticationService, useClass: AuthenticationServiceMock },
        { provide: ReservaService, useClass: ReservaServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] 
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar obras al iniciar', () => {
    expect(component.shows.length).toBeGreaterThan(0); 
    expect(component.shows[0].id).toEqual(1); 
  });

  it('debería suscribirse al estado de autenticación al iniciar', () => {
    expect(component.isLoggedIn).toBeTrue(); 
  });

});
