import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AsientosService } from './asientos.service';

interface SalaResponse {
  id_sala_funciones: number;
  id_reservas_teatrales: number;
}

describe('AsientosService', () => {
  let service: AsientosService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AsientosService]
    });
    service = TestBed.inject(AsientosService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify(); 
  });


  it('debería recuperar asientos de la sala', () => {
    const mockAsientos = [
      { id: 1, numero: 'A1', estado: 'libre' },
      { id: 2, numero: 'A2', estado: 'ocupado' }
    ];
  
    service.getAsientos(1).subscribe(asientos => {
      expect(asientos.length).toBe(2);
      expect(asientos).toEqual(mockAsientos);
    });
  
    const req = httpController.expectOne('http://localhost:3000/api/asientos/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockAsientos);
  });
  
  it('debería obtener el ID de la sala por el ID de la obra', () => {
    const mockRespuesta: SalaResponse = {
      id_sala_funciones: 1,
      id_reservas_teatrales: 123
    };
  
    service.getIdSalaPorIdObra(1).subscribe(respuesta => {
      expect(respuesta).toEqual(mockRespuesta);
    });
  
    const req = httpController.expectOne('http://localhost:3000/api/obra/1/sala');
    expect(req.request.method).toBe('GET');
    req.flush(mockRespuesta);
  });
});