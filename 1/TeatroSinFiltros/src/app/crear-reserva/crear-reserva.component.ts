import { ReservaService } from '../services/reserva-teatral.service';
import { Component, OnInit } from '@angular/core';
import { ObraService } from '../services/obra.service';
import { GenerarsalaService } from '../services/generarsala.service';
import { AsientosService } from '../services/asientos.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-crear-reserva',
  templateUrl: './crear-reserva.component.html',
  styleUrls: ['./crear-reserva.component.css']
})
export class CrearReservaComponent implements OnInit {
  obras: any[] = [];
  salas: any[] = [];
  reserva: any = {};
  sala: any = { num_filas: 0, num_ncolumnas: 0, nombre_sala: '' };
  asientos: any[][] = [];
  salaSeleccionada: number = 0;
  errorMensaje: string = '';

  constructor(
    private router: Router,
    private obraService: ObraService,
    private salasService: GenerarsalaService,
    private reservasService: ReservaService,
    private asientosService: AsientosService
  ) { }

  ngOnInit(): void {
    this.cargarObras();
    this.cargarSalas();
  }

  cargarObras(): void {
    this.obraService.getObras().subscribe(obras => {
      this.obras = obras;
    });
  }

  cargarSalas(): void {
    this.salasService.getSalas().subscribe(salas => {
      this.salas = salas;
    });
  }

  organizarAsientos(asientos: any[]): any[][] {
    let filas: any[][] = [];
    asientos.forEach(asiento => {
      if (!filas[asiento.fila - 1]) {
        filas[asiento.fila - 1] = [];
      }
      filas[asiento.fila - 1][asiento.columna - 1] = asiento;
    });
    return filas;
  }

  
  cargarAsientosSala(id_sala: number): void {
    this.salasService.getSalaById(id_sala).subscribe({
      next: (salaRecibida) => {
        this.reserva.id_sala=salaRecibida.id_sala;
        this.sala = salaRecibida;
        this.asientosService.getAsientos(id_sala).subscribe(asientosData => {
          this.asientos = this.organizarAsientos(asientosData);
        });
      },
      error: (error) => {
        console.error('Error al cargar la sala:', error);
      }
    });
  }
  
  
  crearReserva(): void {
    if (!this.reserva.id_obra) {
      console.log('id_obra no definido:', this.reserva.id_obra);
      this.errorMensaje = 'La obra es obligatoria. Por favor, selecciona una obra.';
      return;
    }
  
    if (!this.reserva.id_sala) {
      console.log('id_sala no definido:', this.reserva.id_sala);
      this.errorMensaje = 'La sala es obligatoria. Por favor, selecciona una sala.';
      return;
    }
  
    if (!this.reserva.fecha_hora) {
      console.log('fecha_hora no definido:', this.reserva.fecha_hora);
      this.errorMensaje = 'La fecha y hora son obligatorias. Por favor, especifica la fecha y hora.';
      return;
    }
  
    this.reservasService.crearReserva(this.reserva).subscribe({
      next: (respuesta) => {
        this.errorMensaje = '';
        alert('Reserva creada con éxito.');
        this.router.navigate(['/']); 
      },
      error: (error) => {
        console.error('Error al crear la reserva:', error);
        this.errorMensaje = 'Ha ocurrido un error al intentar crear la reserva. Por favor, inténtalo de nuevo.';
      }
    });
  }
}

