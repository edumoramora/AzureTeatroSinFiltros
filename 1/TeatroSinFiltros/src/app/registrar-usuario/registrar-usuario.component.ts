import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css']
})
export class RegistrarUsuarioComponent {
  usuario = {
    nombreUsuario: '',
    email: '',
    contrasena: '',
  };
  errorMensaje = 'Error en el registro';
  
  constructor(private authService: AuthenticationService, private router: Router) { }

  onSubmit() {
    this.authService.registrarUsuario(this.usuario).subscribe({
      next: (response) => {
        console.log('Usuario registrado con éxito', response);
        this.router.navigate(['/']); 
      },
      error: (error) => {
        this.errorMensaje = error.error;
      }
    });
  }
}