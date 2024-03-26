import { Component, OnInit } from '@angular/core';
import { ObraService } from './services/obra.service';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'TeatroSinFiltros';
  shows: any[] = [];
  isLoggedIn: boolean = false;
  menuVisible: boolean = true;
  constructor(private obraService: ObraService,private authService: AuthenticationService) {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
   }

  ngOnInit() {
  
    this.obraService.getObras().subscribe(
      (data) => {
        console.log(data);
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

  logout(): void {
    this.authService.logout();
  }

  
  toggleMenu(): void {
    this.menuVisible = !this.menuVisible;
  }

  hideMenu(): void {
    this.menuVisible = false; 
  }
}

