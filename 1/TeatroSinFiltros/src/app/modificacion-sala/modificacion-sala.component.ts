import { Component, OnInit } from '@angular/core';
import { GenerarsalaService } from '../services/generarsala.service';
import { ActivatedRoute } from '@angular/router';
import { AsientosService } from '../services/asientos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modificacion-sala',
  templateUrl: './modificacion-sala.component.html',
  styleUrls: ['./modificacion-sala.component.css']
})

export class ModificacionSalaComponent implements OnInit {
  salas: any[] = [];
  sala: any = { num_filas: 0, num_columnas: 0, nombre_sala: '' };
  asientos: any[][] = [];
  salaCreada: boolean = false;
  errorMensaje: string = '';
  id_sala: number = -1;

  constructor(private route: ActivatedRoute,private router: Router,private generarsalaService: GenerarsalaService,private asientosService: AsientosService) { }

  ngOnInit(): void {
    this.id_sala = +this.route.snapshot.paramMap.get('id')!;
    if (this.id_sala) {
      this.cargarSala(this.id_sala);
    }
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
  
  cargarSala(id_sala: number): void {
    this.generarsalaService.getSalaById(id_sala).subscribe({
      next: (salaRecibida) => {
        this.salaCreada = true;
        this.sala = salaRecibida;
        this.asientosService.getAsientos(id_sala).subscribe(asientosData => {
          this.asientos = this.organizarAsientos(asientosData);
        });
      },
      error: (error) => {
        console.error('Error al cargar la sala:', error);
        this.errorMensaje = 'Error al cargar la sala.';
      }
    });
  }




  toggleSeat(asiento: any): void {
    if (asiento.estado === 'ocupado') {
      asiento.estado = 'disponible';
    }
    else {
      asiento.estado = asiento.estado === 'seleccionado' ? 'disponible' : 'ocupado';
    }
  }

  crearSala(): void {
    this.sala.asientos = this.asientos.flat();
    console.log(this.id_sala);
    this.generarsalaService.actualizarSala(this.sala.id, this.sala).subscribe({
      next: (respuesta) => {
        alert('Sala y asientos actualizados con éxito.');
        this.router.navigate(['/mostrar-salas']);
      },
      error: (error) => {
        this.errorMensaje = 'Hubo un error al actualizar la sala. Por favor, inténtalo de nuevo.';
        console.error('Error al actualizar la sala:', error);
      }
    });
  }
}