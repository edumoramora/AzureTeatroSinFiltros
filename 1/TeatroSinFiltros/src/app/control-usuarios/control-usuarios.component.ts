import { Component, OnInit } from '@angular/core';
import { ControlUsuariosService } from '../services/control-usuarios.service'; // Ajusta la ruta según la estructura de tu proyecto
import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-control-usuarios',
  templateUrl: './control-usuarios.component.html',
  styleUrls: ['./control-usuarios.component.css']
})


export class ControlUsuariosComponent implements OnInit {
  usuarios: any[] = [];
  usuarioEditando: any = null; 
  usuarioEnEdicion: any = null;
  mensajeError: string = '';
  mensajeExito: string = '';

  constructor(private usuarioService: ControlUsuariosService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.obtenerUsuarios().subscribe(data => {
      this.usuarios = data;
    });
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.usuarioService.eliminarUsuario(id).subscribe({
        next: () => {
          alert('Usuario eliminado con éxito');
          this.cargarUsuarios(); 
        },
        error: (error) => {
          console.error('Error al eliminar el usuario', error);
          alert('Hubo un error al eliminar el usuario');
        }
      });
    }
  }
  

  modificarUsuario(usuario: any): void {
    this.usuarioEditando = usuario;
  }

  aceptarEdicion(usuario: any): void {
    this.usuarioEditando = null;
    this.cargarUsuarios(); 
  }

  habilitarEdicion(usuario: any): void {
    this.usuarioEnEdicion = Object.assign({}, usuario); 
  }
  
  actualizarDatoUsuario(usuario: any, campo: string, valor: string): void {
    console.log(`Actualizando ${campo} con valor: ${valor}`); 
    usuario[campo] = valor;
  }
  cancelarEdicion(): void {
    this.usuarioEditando = null;
    this.cargarUsuarios(); 
  }

  guardarCambios(usuario: any): void {
    this.usuarioService.actualizarUsuario(usuario.id_usuario, usuario).subscribe({
      next: (data) => {
        console.log('Usuario actualizado con éxito:', data);
        this.usuarioEnEdicion = null;
        this.mensajeError = ''; 
        this.mensajeExito = 'Los datos han sido actualizados con éxito!';
      },
      error: (error) => {
        console.error('Error al actualizar el usuario:', error);
        this.mensajeExito = ''; 
        this.mensajeError = 'Error al actualizar el usuario: ' + error.message;
      }
    });
  }
}

