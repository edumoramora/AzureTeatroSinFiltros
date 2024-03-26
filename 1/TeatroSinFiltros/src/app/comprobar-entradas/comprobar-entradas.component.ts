import { Component } from '@angular/core';
import { ReservaService } from '../services/reserva.service';

@Component({
  selector: 'app-comprobar-entradas',
  templateUrl: './comprobar-entradas.component.html',
  styleUrls: ['./comprobar-entradas.component.css']
})
export class ComprobarEntradasComponent {

   reserva: any[] = [];
   id_reserva=null;
    constructor(private reservaService: ReservaService) { }
  
    ngOnInit(): void {
      this.cargarReservas();
    }
  
    cargarReservas(): void {
      this.reservaService.obtenerReservas().subscribe(reserva => {
        this.reserva = reserva;
      });
    }
  
    eliminarReserva(id: number): void {
      this.reservaService.eliminarReserva(id).subscribe(() => {
        this.cargarReservas(); 
      });
    }
}

