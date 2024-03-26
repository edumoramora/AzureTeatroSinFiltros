import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservaService } from '../services/reserva-teatral.service';
import { ObraService } from '../services/obra.service';
import { GenerarsalaService } from '../services/generarsala.service';
import { AsientosService } from '../services/asientos.service';

@Component({
  selector: 'app-modificar-reserva',
  templateUrl: './modificar-reserva.component.html',
  styleUrls: ['./modificar-reserva.component.css']
})
export class ModificarReservaComponent implements OnInit {
  obras: any[] = [];
  salas: any[] = [];
  reserva: any = {
    id_obra: null,
    id_sala_funciones: null,
    fecha_hora: null,
    id_reservas_teatrales:null
  };
  sala: any = { id_sala:0 ,num_filas: 0, num_columnas: 0, nombre_sala: '' };
  asientos: any[][] = [];
  fecha: any ;
  salaSeleccionada: number = 0;
  errorMensaje: string = '';

  constructor(
    private obraService: ObraService,
    private salasService: GenerarsalaService,
    private reservasService: ReservaService,
    private asientosService: AsientosService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
        const id = +params['id']; 
        console.log(id);
        if (id) {
            this.cargarReserva(id);
        }
    });
    this.cargarObras();
    this.cargarSalas();
}

cargarReserva(id: number): void {
  this.reservasService.getReservaPorId(id).subscribe(reserva => {
    this.reserva.id_obra = reserva.id_obra; 
    this.reserva.id_sala_funciones = reserva.id_sala;
    this.reserva.id_reservas_teatrales = reserva.id_reservas_teatrales;
    if (reserva.fecha_hora) {
      const fecha = new Date(reserva.fecha_hora);
      this.reserva.fecha_hora = fecha.toISOString().slice(0, 16);
    } else {
      console.error('La fecha_hora de la reserva es null');
    } 
    this.cargarAsientosSalaPrincipio(this.reserva.id_sala_funciones);
    
  });
   
}


modificarReserva(): void {
  console.log(this.reserva.fecha_hora)
  if (this.reserva.id_obra!=null && this.reserva.id_sala_funciones!=null && this.reserva.fecha_hora!=null) {
    this.reservasService.modificarReserva(this.reserva.id_reservas_teatrales, this.reserva).subscribe({
      next: (respuesta) => {
        console.log('Reserva modificada con éxito:', respuesta);
        this.router.navigate(['/mostrar-reservas']);
      },
      error: (error) => {
        console.error('Error al modificar la reserva:', error);
        this.errorMensaje = 'Ha ocurrido un error al intentar modificar la reserva. Por favor, inténtalo de nuevo.';
      }
    });
  } else {
    console.error('Error: Faltan datos por rellenar');
    this.errorMensaje = 'Faltan datos por rellenar';
  }
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

  cargarAsientosSalaPrincipio(id_sala_funciones: number): void {
    this.salasService.getSalaByIdFuncion(id_sala_funciones).subscribe({
      next: (salaRecibida) => {
        this.reserva.id_sala_funciones=salaRecibida.id_sala;
        this.salaSeleccionada = salaRecibida.id_sala;
        this.asientosService.getAsientos(salaRecibida.id_sala).subscribe(asientosData => {
          this.asientos = this.organizarAsientos(asientosData);
        });
      },
      error: (error) => {
        console.error('Error al cargar la sala:', error);
      }
    });
  }
  
  cargarAsientosSala(id_sala_funciones: number): void {
    this.salasService.getSalaByIdFuncion(id_sala_funciones).subscribe({
      next: (salaRecibida) => {
        this.reserva.id_sala_funciones=salaRecibida.id_sala;
        this.sala.id_sala = salaRecibida.id_sala;
        console.log("pasa" + this.sala.id_sala);
        this.asientosService.getAsientos(id_sala_funciones).subscribe(asientosData => {
          this.asientos = this.organizarAsientos(asientosData);
        });
      },
      error: (error) => {
        console.error('Error al cargar la sala:', error);
      }
    });
  }
}
