import { Component, OnInit } from '@angular/core';
import { ReservaService } from '../services/reserva-teatral.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mostrar-reservas',
  templateUrl: './mostrar-reservas.component.html',
  styleUrls: ['./mostrar-reservas.component.css']
})
export class MostrarReservasComponent implements OnInit {
  reservas: any[] = [];

  constructor(private router: Router,private reservasService: ReservaService) { }

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.reservasService.getReservas().subscribe(reservas => {
      this.reservas = reservas;
    });
  }

  modificarReserva(id: number): void {
    this.router.navigate(['/modificar-reserva', id]);
  }

  eliminarReserva(id: number): void {
    if(confirm('¿Estás seguro de querer eliminar esta reserva?')) {
      this.reservasService.eliminarReserva(id).subscribe(() => {
        this.cargarReservas(); 
      });
    }
  }
}
