import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReservaService } from './reserva.service';

describe('ReservaService', () => {
  let service: ReservaService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReservaService]
    });
    service = TestBed.inject(ReservaService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify(); 
  });

  it('debería registrar una reserva', () => {
    const mockReserva = { id_obra: 1, fecha_hora: '2021-12-31T23:59:59' };
    service.registrarReserva(mockReserva).subscribe(reserva => {
      expect(reserva).toEqual(mockReserva);
    });

    const req = httpController.expectOne('http://localhost:3000/api/reserva');
    expect(req.request.method).toBe('POST');
    req.flush(mockReserva); 
  });

  it('debería obtener todas las reservas', () => {
    const mockReservas = [{ id_reserva: 1, nombre: 'John Doe', num_entradas: 2 }];

    service.obtenerReservas().subscribe(reservas => {
      expect(reservas.length).toBe(1);
      expect(reservas).toEqual(mockReservas);
    });

    
    const req = httpController.expectOne('http://localhost:3000/api/reserva');
    expect(req.request.method).toBe('GET');
    req.flush(mockReservas); 
  });

  it('debería eliminar una reserva', () => {
    service.eliminarReserva(1).subscribe(response => {
      expect(response).toBeTruthy(); 
    });

    const req = httpController.expectOne('http://localhost:3000/api/reserva/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({}); 
  });

  
});