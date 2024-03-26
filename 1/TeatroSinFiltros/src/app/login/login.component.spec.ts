import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthenticationService } from '../services/authentication.service';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let router: Router;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthenticationService', ['login']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule, RouterTestingModule],
      providers: [
        { provide: AuthenticationService, useValue: authServiceMock }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('debería navegar a la ruta principal tras un login exitoso', () => {
    const mockResponse = { token: 'fake-token' };
    authServiceMock.login.and.returnValue(of(mockResponse));
    
    component.nombre_usuario = 'test';
    component.contrasena = 'password';
    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('debería mostrar un mensaje de error cuando el login falla', () => {
    const error = new Error('Error de inicio de sesión');
    authServiceMock.login.and.returnValue(throwError(error));

    component.nombre_usuario = 'usuario';
    component.contrasena = 'contrasena';
    component.onSubmit();

    fixture.detectChanges();

    expect(component.errorMensaje).toBe(error.message);
  });

});
