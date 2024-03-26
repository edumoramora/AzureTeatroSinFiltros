import { Component, OnInit } from '@angular/core';
import { ActoresService } from '../services/actores.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-actores',
  templateUrl: './actores.component.html',
  styleUrls: ['./actores.component.css']
})

export class ActoresComponent implements OnInit {
  actores: any[] = [];
  actorId : any = null;
  showButton: boolean = false;
  isLoggedIn: boolean = false;
  constructor(
    private actoresService: ActoresService,
    public authService: AuthenticationService,
    private router: Router
  ) {  
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
    this.isLoggedIn = isLoggedIn;
  });}

  ngOnInit() {
    this.cargarActores();
  }

  cargarActores() {
    this.actoresService.getActores().subscribe(
      (data) => {
        this.actores = data;
      },
      (error) => {
        console.error('Error al obtener actores', error);
      }
    );
  }

  get isUserAdmin(): boolean {
    return this.authService.getUserRole === 'admin';
  }

  verDetalles(actorId: number): void {
    this.router.navigate(['/actores-info', actorId]);
  }

  handleDelete(actorId: number) {
    if (confirm('¿Estás seguro de querer eliminar este actor?')) {
      this.actoresService.deleteActor(actorId).subscribe({
        next: () => {
          this.actores = this.actores.filter(actor => actor.id !== actorId);
          this.cargarActores();
        },
        error: (error) => {
          console.error('Error al eliminar el actor', error);
          this.cargarActores();
        }
      });
    }
  }
}