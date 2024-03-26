import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ObraService } from './obra.service';
import { AuthenticationService } from './authentication.service';

describe('ObraService', () => {
  let service: ObraService;
  let httpController: HttpTestingController;
  let authServiceMock: any;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthenticationService', ['getToken']);
    authServiceMock.getToken.and.returnValue('fake-token');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ObraService,
        { provide: AuthenticationService, useValue: authServiceMock }
      ]
    });
    service = TestBed.inject(ObraService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('debería obtener todas las obras', () => {
    const mockObras = [
      { id: 1, titulo: 'Obra 1' },
      { id: 2, titulo: 'Obra 2' }
    ];
  
    service.getObras().subscribe(obras => {
      expect(obras.length).toBe(2);
      expect(obras).toEqual(mockObras);
    });
  
    const req = httpController.expectOne('http://localhost:3000/api/obras');
    expect(req.request.method).toBe('GET');
    req.flush(mockObras);
  });
  
  it('debería eliminar una obra', () => {
    service.deleteObra(1).subscribe(response => {
      expect(response).toBeTruthy();
    });
  
    const req = httpController.expectOne('http://localhost:3000/api/obras/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('debería añadir una nueva obra', () => {
    const nuevaObra = { titulo: 'Nueva Obra', descripcion: 'Descripción', imagen_url: 'http://url.com' };
    service.addObra(nuevaObra).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpController.expectOne('http://localhost:3000/api/obras');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 3, ...nuevaObra });
  });

  it('debería recuperar una obra por su ID', () => {
    const obra = { id: 1, titulo: 'Obra 1', descripcion: 'Descripción', imagen_url: 'http://url.com' };
    service.getObraById('1').subscribe(obtenida => {
      expect(obtenida).toEqual(obra);
    });
    const req = httpController.expectOne('http://localhost:3000/api/obras/1');
    expect(req.request.method).toBe('GET');
    req.flush(obra);
  });

  it('debería actualizar una obra', () => {
    const obraActualizada = { id: 1, titulo: 'Obra Actualizada', descripcion: 'Nueva Descripción', imagen_url: 'http://nuevaurl.com' };
    service.updateObra(obraActualizada).subscribe(response => {
      expect(response).toBeTruthy();
    });
    const req = httpController.expectOne('http://localhost:3000/api/obras/1');
    expect(req.request.method).toBe('PUT');
    req.flush(obraActualizada);
  });

  it('debería obtener actores de una obra específica', () => {
    const mockActores = [
      { id: 1, nombre: 'Actor 1' },
      { id: 2, nombre: 'Actor 2' }
    ];
  
    service.obtenerActoresPorObra(1).subscribe(actores => {
      expect(actores.length).toBe(2);
      expect(actores).toEqual(mockActores);
    });
  
    const req = httpController.expectOne(`http://localhost:3000/api/actores_obra/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockActores);
  });

  it('debería añadir un actor a una obra', () => {
    const actorObra = { obraId: 1, actorId: 1 };
    service.anadirActorObra(actorObra).subscribe(response => {
      expect(response).toBeTruthy();
    });
  
    const req = httpController.expectOne('http://localhost:3000/api/actores_obra');
    expect(req.request.method).toBe('POST');
    req.flush({ ...actorObra });
  });

  it('debería eliminar un actor de una obra', () => {
    service.eliminarActorDeObra(1).subscribe(response => {
      expect(response).toBeTruthy();
    });
  
    const req = httpController.expectOne('http://localhost:3000/api/actores_obra/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

});
