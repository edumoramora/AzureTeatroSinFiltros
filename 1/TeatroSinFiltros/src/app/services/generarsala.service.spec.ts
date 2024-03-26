import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GenerarsalaService } from './generarsala.service';

describe('GenerarsalaService', () => {
  let service: GenerarsalaService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GenerarsalaService]
    });
    service = TestBed.inject(GenerarsalaService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify(); 
  });

  it('debería subir configuración de la sala', () => {
    const nuevaSala = { nombre: 'Nueva Sala', capacidad: 100 };
    service.subirConfiguracionSala(nuevaSala).subscribe(response => {
      expect(response).toBeTruthy();
    });
  
    const req = httpController.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('POST');
    req.flush(nuevaSala);
  });

  it('debería obtener todas las salas', () => {
    const mockSalas = [
      { id: 1, nombre: 'Sala 1', capacidad: 100 },
      { id: 2, nombre: 'Sala 2', capacidad: 150 }
    ];
  
    service.getSalas().subscribe(salas => {
      expect(salas.length).toBe(2);
      expect(salas).toEqual(mockSalas);
    });
  
    const req = httpController.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(mockSalas);
  });

  it('debería eliminar una sala', () => {
    service.eliminarSala(1).subscribe(response => {
      expect(response).toBeTruthy();
    });
  
    const req = httpController.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('debería obtener una sala por su ID', () => {
    const mockSala = { id: 1, nombre: 'Sala 1', capacidad: 100 };
    service.getSalaById(1).subscribe(sala => {
      expect(sala).toEqual(mockSala);
    });
  
    const req = httpController.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSala);
  });

  it('debería actualizar una sala', () => {
    const salaActualizada = { id: 1, nombre: 'Sala Actualizada', capacidad: 150 };
    service.actualizarSala(1, salaActualizada).subscribe(response => {
      expect(response).toBeTruthy();
    });
  
    const req = httpController.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(salaActualizada);
  });
});