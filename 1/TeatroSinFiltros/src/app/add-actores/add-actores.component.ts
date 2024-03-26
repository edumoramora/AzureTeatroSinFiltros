import { Component, OnInit } from '@angular/core';
import { ActoresService } from '../services/actores.service'; // Asegúrate de tener este servicio
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-actores',
  templateUrl: './add-actores.component.html',
  styleUrls: ['./add-actores.component.css']
})
export class AddActoresComponent implements OnInit {
  actor = {
    nombre: '',
    imagen_url: '',
    descripcion: ''
  };
  isEditing: boolean = false;
  errorMessage: string = '';

  constructor(private actoresService: ActoresService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const actorId = params.get('id');
      if (actorId) {
        this.isEditing = true;
        this.actoresService.getActorById(actorId).subscribe(
          data => {
            this.actor = data;
          },
          error => {
            console.error('Error al obtener el actor', error);
            this.errorMessage = 'Error al cargar el actor';
          }
        );
      }
    });
  }

  onSubmit() {
    if (this.isEditing) {
      this.actoresService.updateActor(this.actor).subscribe(
        () => {
          this.router.navigate(['/actores']); // Asegúrate de tener esta ruta configurada
        },
        error => {
          if (error.status === 409) {
            this.errorMessage = 'Ya existe un actor con ese nombre. Por favor, elige otro nombre.';
          } else {
            console.error('Error al actualizar el actor', error);
            this.errorMessage = 'Error al actualizar el actor. Por favor, inténtalo de nuevo.';
          }
        }
      );
    } else {
      this.actoresService.addActor(this.actor).subscribe(
        () => {
          this.router.navigate(['/actores']); // Asegúrate de tener esta ruta configurada
        },
        error => {
          if (error.status === 409) {
            this.errorMessage = 'Ya existe un actor con ese nombre. Por favor, elige otro nombre.';
          } else {
            console.error('Error al añadir el actor', error);
            this.errorMessage = 'Error al añadir el actor. Por favor, inténtalo de nuevo.';
          }
        }
      );
    }
  }
}