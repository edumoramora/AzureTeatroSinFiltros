import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse,HttpHeaders  } from '@angular/common/http';
import { Observable,throwError  } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ControlUsuariosService {
  private apiUrl = 'http://localhost:3000/api/usuarios'; 

  constructor(private http: HttpClient) { }

  obtenerUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  eliminarUsuario(id: number): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/${id}`,{ headers });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  actualizarUsuario(id: number, usuario: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/${id}`, usuario,{ headers }).pipe(
      catchError((error: HttpErrorResponse) => {
       
        let mensajeError = 'Ocurrió un error al actualizar el usuario';
        if (error.status === 409) {
          mensajeError = 'Los datos proporcionados ya están en uso por otro usuario';
        } else if (error.status === 500) {
          mensajeError = 'Error interno del servidor';
        }
       
        return throwError(() => new Error(mensajeError));
      })
    );
  }
}
