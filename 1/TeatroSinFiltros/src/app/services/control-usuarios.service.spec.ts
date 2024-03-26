
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ControlUsuariosService } from './control-usuarios.service';

describe('ControlUsuariosService', () => {
  let service: ControlUsuariosService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ControlUsuariosService]
    });
    service = TestBed.inject(ControlUsuariosService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify(); 
  });

  it('debería obtener todos los usuarios', () => {
    const mockUsuarios = [
      { id: 1, nombre: 'Usuario 1' },
      { id: 2, nombre: 'Usuario 2' }
    ];
  
    service.obtenerUsuarios().subscribe(usuarios => {
      expect(usuarios.length).toBe(2);
      expect(usuarios).toEqual(mockUsuarios);
    });
  
    const req = httpController.expectOne('http://localhost:3000/api/usuarios');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsuarios);
  });

it('debería eliminar un usuario', () => {
  service.eliminarUsuario(1).subscribe(response => {
    expect(response).toBeTruthy();
  });

  const req = httpController.expectOne('http://localhost:3000/api/usuarios/1');
  expect(req.request.method).toBe('DELETE');
  req.flush({});
});

it('debería actualizar un usuario', () => {
  const usuarioActualizado = { id: 1, nombre: 'Usuario Actualizado' };

  service.actualizarUsuario(1, usuarioActualizado).subscribe(response => {
    expect(response).toBeTruthy();
  });

  const req = httpController.expectOne('http://localhost:3000/api/usuarios/1');
  expect(req.request.method).toBe('PUT');
  req.flush(usuarioActualizado);
});

});