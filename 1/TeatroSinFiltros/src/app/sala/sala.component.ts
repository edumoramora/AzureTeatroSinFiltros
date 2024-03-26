import { Component, OnInit } from '@angular/core';
import { AsientosService } from '../services/asientos.service';
import { ReservaService } from '../services/reserva.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sala',
  templateUrl: './sala.component.html',
  styleUrls: ['./sala.component.css']
})
export class SalaComponent implements OnInit {
  asientos: any[] = [];
  idSala: any = ''; 
  selectedSeatsCount = 0;
  maxSeats = 5;
  maxSeatsReached = false; 
  nombreUsuario: string = '';
  Obra: any = '';
  idObra: number = 0;
  id_reservas_teatrales: number = 0;
  selectedSeatIds: number[] = [];
  mostrarMensajeExito = false;
  idReservaTeatral: string | null = null;

  constructor( 
    private reservaService: ReservaService,
    private asientosService: AsientosService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
     this.Obra = localStorage.getItem('obraSeleccionadaId');
     this.idReservaTeatral = this.route.snapshot.paramMap.get('id');
     console.log(this.idReservaTeatral);
      this.asientosService.getIdSalaPorIdObra(this.idReservaTeatral).subscribe(data => {
      this.idSala = data.id_sala_funciones;
      console.log(data.id_sala_funciones);  console.log(data.id_sala_funciones);
      this.id_reservas_teatrales= data.id_reservas_teatrales;
      this.asientosService.getAsientosFunciones(this.idSala).subscribe(data => {
        this.asientos = this.organizarAsientos(data); 
      });
    });
    setTimeout(() => {
      this.mostrarMensajeExito = false;
    }, 1000);
  }

  organizarAsientos(data: any[]): any[] {
    const filas = new Map<number, any[]>();
  
    data.forEach(asiento => {
      if (!filas.has(asiento.fila)) {
        filas.set(asiento.fila, []); 
      }
      filas.get(asiento.fila)?.push(asiento); 
    });
  
    return Array.from(filas.values());
  }


  guardarReserva(): void {
    const reserva = {
      nombreUsuario: this.nombreUsuario,
      cantidadButacas: this.selectedSeatsCount,
      id_reservas_teatrales: this.id_reservas_teatrales,
      butacasSeleccionadas: this.selectedSeatIds
    };

    if (!reserva.nombreUsuario || reserva.nombreUsuario.trim().length === 0) {
      alert('El nombre del usuario no puede estar vacío.');
    } else {
      this.reservaService.registrarReserva(reserva).subscribe({
        next: (response) => {
          this.mostrarMensajeExito = true;
          this.ngOnInit();
        },
        error: (error) => {
          console.error('Error al registrar la reserva', error);
        }
      });
    }
  }

    toggleSeat(asiento: any): void {
    if (this.selectedSeatsCount >= this.maxSeats && asiento.estado !== 'seleccionado') {
      this.maxSeatsReached = true; 
      return;
    }

    this.maxSeatsReached = false; 

    if (asiento.estado !== 'ocupado') {
      asiento.estado = asiento.estado === 'seleccionado' ? 'disponible' : 'seleccionado';
    }

    if (asiento.estado === 'seleccionado') {
      this.selectedSeatIds.push(asiento.id_butaca);
    } else {
      const index = this.selectedSeatIds.indexOf(asiento.id_butaca);
      if (index > -1) {
        this.selectedSeatIds.splice(index, 1);
      }
    }

    this.updateSelectedCount();
  }


  updateSelectedCount(): void {
    this.selectedSeatsCount = this.asientos
      .flat()
      .filter(asiento => asiento.estado === 'seleccionado').length;
    this.saveSelectedSeats();
  }

  saveSelectedSeats(): void {
    const selectedSeatsIndex = this.asientos
      .flat()
      .map((asiento, index) => asiento.estado === 'seleccionado' ? index : null)
      .filter(index => index != null);
    localStorage.setItem('selectedSeats', JSON.stringify(selectedSeatsIndex));
  }

  loadSelectedSeats(): void {
    try {
      const selectedSeatsData = localStorage.getItem('selectedSeats');
      const selectedSeats = selectedSeatsData ? JSON.parse(selectedSeatsData) : [];
      if (selectedSeats.length > 0) {
        this.asientos.flat().forEach((asiento, index) => {
          if (selectedSeats.includes(index)) {
            asiento.estado = 'seleccionado';
          }
        });
      }
    } catch (error) {
      console.error('Error al analizar los asientos seleccionados:', error);
    }
  }
}

