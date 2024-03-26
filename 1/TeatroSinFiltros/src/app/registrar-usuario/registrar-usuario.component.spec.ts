import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarUsuarioComponent } from './registrar-usuario.component';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

describe('RegistrarUsuarioComponent', () => {
  let component: RegistrarUsuarioComponent;
  let fixture: ComponentFixture<RegistrarUsuarioComponent>;
  let authServiceMock: jasmine.SpyObj<AuthenticationService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthenticationService', ['registrarUsuario']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [BrowserModule, FormsModule], // Añade las importaciones necesarias
      declarations: [RegistrarUsuarioComponent],
      providers: [
        { provide: AuthenticationService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería registrar un usuario y navegar a la página de inicio', () => {
    const responseMock = { success: true }; // Simula una respuesta positiva
    authServiceMock.registrarUsuario.and.returnValue(of(responseMock));
  
    component.usuario.nombreUsuario = 'test';
    component.usuario.email = 'test@example.com';
    component.usuario.contrasena = 'password123';
    component.onSubmit();
  
    expect(authServiceMock.registrarUsuario).toHaveBeenCalledWith(component.usuario);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('debería mostrar un mensaje de error si el registro falla', () => {
    const errorMensaje = 'Error en el registro';
    authServiceMock.registrarUsuario.and.returnValue(throwError({ error: errorMensaje }));
  
    component.onSubmit();
  
    fixture.detectChanges(); 
  
    expect(component.errorMensaje).toBe(errorMensaje);
  });
});