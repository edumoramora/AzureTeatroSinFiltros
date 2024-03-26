import { Component, OnInit } from '@angular/core';
import { ObraService } from '../services/obra.service';
import { AuthenticationService } from '../services/authentication.service';
import { ReservaService } from '../services/reserva-teatral.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  title = 'TeatroSinFiltros';
  shows: any[] = [];
  isLoggedIn: boolean = false;
  constructor(private obraService: ObraService,  public authService: AuthenticationService , public reservaService: ReservaService 
    ) {
      this.authService.isLoggedIn$.subscribe(isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
      });
     }

    ngOnInit() {
      this.cargarObras();
    }
  
    cargarObras() {
      this.reservaService.getReservasObras().subscribe(
        (data) => {
          this.shows = data;
          console.log(data);
        },
        (error) => {
          console.error('Error al obtener obras', error);
        }
      );
    }
  
  get isUserAdmin(): boolean {
    return this.authService.getUserRole === 'admin';
  }

}



