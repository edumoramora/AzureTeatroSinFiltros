import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActoresService } from './actores.service';

describe('ActoresService', () => {
  let service: ActoresService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ActoresService]
    });
    service = TestBed.inject(ActoresService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('debería recuperar todos los actores', () => {
    const mockActores = [
      { id: 1, nombre: 'Actor 1', imagen_url: 'http://imagen1.com' },
      { id: 2, nombre: 'Actor 2', imagen_url: 'http://imagen2.com' }
    ];

    service.getActores().subscribe(actores => {
      expect(actores).toEqual(mockActores);
    });

    const req = httpController.expectOne('http://localhost:3000/api/actores');
    expect(req.request.method).toBe('GET');
    req.flush(mockActores);
  });

  it('debería eliminar un actor', () => {
    service.deleteActor(1).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpController.expectOne('http://localhost:3000/api/actores/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Actor eliminado' });
  });

  it('debería añadir un nuevo actor', () => {
    const nuevoActor = { nombre: 'Nuevo Actor', imagen_url: 'http://nuevoactor.com' };
    service.addActor(nuevoActor).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpController.expectOne('http://localhost:3000/api/actores');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 3, ...nuevoActor });
  });

  it('debería recuperar un actor por su ID', () => {
    const actor = { id: 1, nombre: 'Actor 1', imagen_url: 'http://imagenactor1.com' };
    service.getActorById('1').subscribe(obtenido => {
      expect(obtenido).toEqual(actor);
    });

    const req = httpController.expectOne('http://localhost:3000/api/actores/1');
    expect(req.request.method).toBe('GET');
    req.flush(actor);
  });

  it('debería actualizar un actor', () => {
    const actorActualizado = { id: 1, nombre: 'Actor Actualizado', imagen_url: 'http://imagenactualizada.com' };
    service.updateActor(actorActualizado).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpController.expectOne('http://localhost:3000/api/actores/1');
    expect(req.request.method).toBe('PUT');
    req.flush({ ...actorActualizado });
  });

  it('debería obtener las obras por actor', () => {
    const obras = [{ id: 1, titulo: 'Obra 1' }, { id: 2, titulo: 'Obra 2' }];
    service.obtenerObrasPorActor(1).subscribe(response => {
      expect(response).toEqual(obras);
    });

    const req = httpController.expectOne('http://localhost:3000/api/obras_actor/1');
    expect(req.request.method).toBe('GET');
    req.flush(obras);
  });

  it('debería añadir un actor a una obra', () => {
    const actorObra = { obraId: 1, actorId: 1 };
    service.anadirActorObra(actorObra).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpController.expectOne('http://localhost:3000/api/obras_actor');
    expect(req.request.method).toBe('POST');
    req.flush({ ...actorObra });
  });
});
