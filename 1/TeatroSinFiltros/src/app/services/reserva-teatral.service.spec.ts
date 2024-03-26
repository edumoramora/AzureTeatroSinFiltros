import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReservaService } from './reserva-teatral.service';

describe('ReservaTeatralService', () => {
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

  it('debería crear una reserva', () => {
    const nuevaReserva = { id_obra: 1, id_sala: 1, fecha_hora: '2021-01-01T10:00:00' };
    service.crearReserva(nuevaReserva).subscribe(response => {
      expect(response).toBeTruthy();
    });
  
    const req = httpController.expectOne(`${service['apiUrl']}`);
    expect(req.request.method).toBe('POST');
    req.flush(nuevaReserva);
  });

  it('debería obtener todas las reservas', () => {
    const mockReservas = [
      { id_reservas_teatrales: 1, fecha_hora: '2021-01-01T10:00:00' },
      { id_reservas_teatrales: 2, fecha_hora: '2021-01-02T12:00:00' }
    ];
  
    service.getReservas().subscribe(reservas => {
      expect(reservas.length).toBe(2);
      expect(reservas).toEqual(mockReservas);
    });
  
    const req = httpController.expectOne(`${service['apiUrl']}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockReservas);
  });

it('debería obtener todas las reservas con detalles de las obras', () => {
  const mockReservasObras = [
    { id: 1, obra: 'Obra 1', fecha: '2021-01-01T10:00:00' },
    { id: 2, obra: 'Obra 2', fecha: '2021-01-02T12:00:00' }
  ];

  service.getReservasObras().subscribe(reservas => {
    expect(reservas.length).toBe(2);
    expect(reservas).toEqual(mockReservasObras);
  });

  const req = httpController.expectOne('http://localhost:3000/api/reservas_teatrales_obras');
  expect(req.request.method).toBe('GET');
  req.flush(mockReservasObras);
});

it('debería modificar una reserva', () => {
  const reservaModificada = { id_obra: 1, id_sala: 1, fecha_hora: '2021-01-01T12:00:00' };
  service.modificarReserva(1, reservaModificada).subscribe(response => {
    expect(response).toBeTruthy();
  });

  const req = httpController.expectOne(`http://localhost:3000/api/reservas_teatrales/1`);
  expect(req.request.method).toBe('PUT');
  req.flush(reservaModificada);
});

it('debería eliminar una reserva', () => {
  service.eliminarReserva(1).subscribe(response => {
    expect(response).toBeTruthy();
  });

  const req = httpController.expectOne(`http://localhost:3000/api/reservas_teatrales/1`);
  expect(req.request.method).toBe('DELETE');
  req.flush({});
});

it('debería obtener una reserva por su ID', () => {
  const mockReserva = { id_obra: 1, id_sala: 1, fecha_hora: '2021-01-01T10:00:00', id_reservas_teatrales: 1 };

  service.getReservaPorId(1).subscribe(reserva => {
    expect(reserva).toEqual(mockReserva);
  });

  const req = httpController.expectOne(`http://localhost:3000/api/reservas_teatrales/1`);
  expect(req.request.method).toBe('GET');
  req.flush(mockReserva);
});
});