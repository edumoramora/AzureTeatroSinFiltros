import { Component, OnInit } from '@angular/core';
import { GenerarsalaService } from '../services/generarsala.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mostrar-salas',
  templateUrl: './mostrar-salas.component.html',
  styleUrls: ['./mostrar-salas.component.css']
})
export class MostrarSalasComponent implements OnInit {
  salas: any[] = [];

  constructor(private router: Router,private generarsalaService: GenerarsalaService) { }

  ngOnInit(): void {
    this.cargarSalas();
  }

  cargarSalas(): void {
    this.generarsalaService.getSalas().subscribe(salas => this.salas = salas);
  }

  modificarSala(id_sala: number): void {
    this.router.navigate(['/modificacion-sala', id_sala]);
  }

  eliminarSala(id_sala: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta sala?')) {
      this.generarsalaService.eliminarSala(id_sala).subscribe({
        next: () => {
          alert('Sala eliminada con éxito');
          this.cargarSalas(); 
        },
        error: (error) => {
          console.error('Error al eliminar la sala', error);
          alert('Hubo un error al eliminar la sala');
        }
      });
    }
  }
}