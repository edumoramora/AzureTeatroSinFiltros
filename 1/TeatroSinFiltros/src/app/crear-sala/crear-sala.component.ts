import { Component, OnInit } from '@angular/core';
import { GenerarsalaService } from '../services/generarsala.service'; 
import { ObraService } from '../services/obra.service'; 
import { Router } from '@angular/router';
interface Asiento {
  fila: number;
  columna: number;
  estado: string;
}

@Component({
  selector: 'app-crear-sala',
  templateUrl: './crear-sala.component.html',
  styleUrls: ['./crear-sala.component.css']
})
export class CrearSalaComponent implements OnInit {
  sala: any = {};
  obras: any[] = [];
  errorMensaje: string = '';
  numFilas: number = 0;
  numColumnas: number = 0;
  salaCreada = false; 
  filas: number[] = [];
  columnas: number[] = [];
  asientos: Asiento[][] = [];
  selectedSeatIds: number[] = [];

  constructor(private router: Router, private generarsalaService: GenerarsalaService, private obraService: ObraService) {}

  ngOnInit() {
  }

  

  generarMatrizDeAsientos() {
    this.asientos = [];
    for (let i = 0; i < this.sala.num_filas; i++) {
      let fila: Asiento[] = [];
      for (let j = 0; j < this.sala.num_columnas; j++) {
        fila.push({
          fila: i + 1,
          columna: j + 1,
          estado: 'libre' 
        });
      }
      this.asientos.push(fila);
    }
  }

  toggleSeat(asiento: any): void {
    asiento.estado = asiento.estado === 'libre' ? 'ocupado' : 'libre';
  
    if (asiento.estado === 'ocupado') {
      this.selectedSeatIds.push(asiento.id_asiento);
    } else {
      const index = this.selectedSeatIds.indexOf(asiento.id_asiento);
      if (index > -1) {
        this.selectedSeatIds.splice(index, 1);
      }
    }
  
    this.saveSelectedSeats();
  }

  saveSelectedSeats(): void {
    localStorage.setItem('occupiedSeats', JSON.stringify(this.selectedSeatIds));
  }

  crearSala(): void {
    this.sala.asientos = this.asientos.flat(); 

    this.generarsalaService.subirConfiguracionSala(this.sala).subscribe({
      next: (respuesta) => {
       this.salaCreada = true;
       alert('Sala y asientos creados con éxito.');
       this.router.navigate(['/']); 
      },
      error: (error) => {
        this.errorMensaje = 'Hubo un error al crear la sala. Por favor, inténtalo de nuevo.';
        console.error('Error al crear la sala:', error);
      }
    });
  }

  onSubmit() {
    if (!this.sala.nombre_sala) {
      this.errorMensaje = 'El nombre de la sala es obligatorio.';
      return;
    }
    if (!this.sala.num_filas) {
      this.errorMensaje = 'El número de filas es obligatorio.';
      return;
    }

    if (!this.sala.num_columnas) {
      this.errorMensaje = 'El número de columnas es obligatorio.';
      return;
    }
    this.errorMensaje ='';
    this.generarMatrizDeAsientos();
    this.salaCreada = true;
 
  }
}



