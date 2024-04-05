import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class AuthenticationService {
  private _isLoggedIn = false;
  private _userRole: string = '';
  private loginUrl = 'http://localhost:3000/api/login'; 
  private registerUrl = 'http://localhost:3000/api/usuarios';
  private isLoggedInSource = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSource.asObservable();

  constructor(private http: HttpClient) {this.checkLoginStatus();}

  private checkLoginStatus(): void {
    const token = localStorage.getItem('token');
    this.isLoggedInSource.next(!!token);
  }


login(credentials: { nombre_usuario: string; contrasena: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'apikey': this.apikey
      // Otros headers necesarios para Supabase
    });

    return this.http.post(this.loginUrl, credentials, { headers }).pipe(
      map((response: any) => {
        // Suponiendo que tu procedimiento almacenado devuelve el token y el rol
        localStorage.setItem('token', response.token);
        localStorage.setItem('userRole', response.rol);
        console.log("Login successful");
        return response;
      }),
      catchError(error => {
        console.error('Login failed', error);
        return throwError(error);
      })
    );
  }
}
  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  get getUserRole(): string {
    return this._userRole;
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }

   registrarUsuario(usuario: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.registerUrl ,usuario, { headers });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    this.isLoggedInSource.next(false);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMsg = 'Ocurrió un error desconocido';
    if (error.status === 401) {
      errorMsg = 'Contraseña incorrecta';
    } else if (error.status === 404) {
      errorMsg = 'Usuario no encontrado';
    }
    return throwError(() => new Error(errorMsg));
  }
}
