import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse,HttpHeaders  } from '@angular/common/http';
import { Observable,throwError  } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ControlUsuariosService {
  private apiUrl = 'https://azure-teatro-sin-filtros-k7nf-edumoramoras-projects.vercel.app/api/usuarios'; 

  constructor(private http: HttpClient) { }
  
obtenerUsuarios(): Observable<any[]> {
    const headers = new HttpHeaders({
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation' // Opcional, dependiendo de tus necesidades
    });

    return this.http.get<any[]>(this.apiUrl, { headers });
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
