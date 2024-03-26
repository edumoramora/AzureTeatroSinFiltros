import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  nombre_usuario: string = '';
  contrasena: string = '';
  errorMensaje: string = ''; 

  constructor(private authService: AuthenticationService, private router: Router) {}

  onSubmit() {
    this.authService.login({ nombre_usuario: this.nombre_usuario, contrasena: this.contrasena })
      .subscribe({
        next: (response) => {
          console.log(response);
          localStorage.setItem('token', response.token);
          this.router.navigate(['/']);
        },
        error: (error: Error) => {
          this.errorMensaje = error.message;
        }
      });
  }
}
