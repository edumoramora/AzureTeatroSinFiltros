import { TestBed } from '@angular/core/testing';
import { AuthenticationService } from './authentication.service';
import { HttpClientTestingModule, HttpTestingController, TestRequest  } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthenticationService]
    });
    service = TestBed.inject(AuthenticationService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('debería estar creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería hacer login y almacenar token y rol del usuario', () => {
    const mockResponse = {
      token: 'fake-token',
      rol: 'admin'
    };
  
    const loginData = { nombre_usuario: 'testuser', contrasena: '1234' };
    service.login(loginData).subscribe(response => {
      expect(response.token).toBe('fake-token');
      expect(response.rol).toBe('admin');
    });
  
    const req = httpController.expectOne('http://localhost:3000/api/login'); 
    expect(req.request.body).toEqual(loginData);
    req.flush(mockResponse);
  });

  it('debería manejar error 401 (Contraseña incorrecta)', () => {
    service.login({ nombre_usuario: 'user', contrasena: 'wrong' }).subscribe({
      next: () => {},
      error: (error: Error) => {
        expect(error.message).toBe('Contraseña incorrecta');
      }
    });

    const req: TestRequest = httpController.expectOne(service['loginUrl']);
    req.flush(null, { status: 401, statusText: 'Unauthorized' });
  });

  it('debería manejar error 404 (Usuario no encontrado)', () => {
    service.login({ nombre_usuario: 'unknownUser', contrasena: '1234' }).subscribe({
      next: () => {},
      error: (error: Error) => {
        expect(error.message).toBe('Usuario no encontrado');
      }
    });

    const req: TestRequest = httpController.expectOne(service['loginUrl']);
    req.flush(null, { status: 404, statusText: 'Not Found' });
  });

  it('debería manejar otros tipos de errores HTTP', () => {
    service.login({ nombre_usuario: 'user', contrasena: '1234' }).subscribe({
      next: () => {},
      error: (error: Error) => {
        expect(error.message).toBe('Ocurrió un error desconocido');
      }
    });

    const req: TestRequest = httpController.expectOne(service['loginUrl']);
    req.flush(null, { status: 500, statusText: 'Server Error' });
  });

  
});
