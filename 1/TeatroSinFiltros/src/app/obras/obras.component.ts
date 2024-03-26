import { Component, OnInit,Input  } from '@angular/core';
import { ObraService } from '../services/obra.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './obras.component.html',
  styleUrls: ['./obras.component.css']
})


export class ObrasComponent implements OnInit {
  showImageUrl: string = 'url_de_imagen_por_defecto.jpg';
  bookingUrl: string = 'url_de_reserva_por_defecto';
  showDescription: string = 'Descripción por defecto';
  title = 'TeatroSinFiltros';
  shows: any[] = [];
  showButton: boolean = false;
  isLoggedIn: boolean = false;
  constructor(private router: Router, private obraService: ObraService,  public authService: AuthenticationService) { 
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

    ngOnInit() {
      this.cargarObras();
    }
  
    cargarObras() {
      this.obraService.getObras().subscribe(
        (data) => {
          this.shows = data;
        },
        (error) => {
          console.error('Error al obtener obras', error);
        }
      );
    }
  
  get isUserAdmin(): boolean {
    return this.authService.getUserRole === 'admin';
  }
  
  verInformacionObra(showId: number): void {
    this.router.navigate(['/obras-info', showId]);
  }
  


  handleDelete(obraId: number) {
    if (confirm('¿Estás seguro de querer eliminar esta obra?')) {
      this.obraService.deleteObra(obraId).subscribe({
        next: () => {
          this.shows = this.shows.filter(show => show.id !== obraId);
          this.cargarObras();
        },
        error: (error) => {
          console.error('Error al eliminar la obra', error);
          this.cargarObras();
        }
      });
    }
  }
}



