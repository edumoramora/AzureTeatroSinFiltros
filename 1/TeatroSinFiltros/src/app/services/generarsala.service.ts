import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GenerarsalaService {
  private apiUrl = 'http://localhost:3000/api/salas';

  constructor(private http: HttpClient) { }

  subirConfiguracionSala(sala: any) {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl, sala,{ headers });
  }
  getSalas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  eliminarSala(id: number): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/${id}`,{ headers });
  }

  getSalaById(id_sala: number): Observable<any> {
    const url = `${this.apiUrl}/${id_sala}`;
    return this.http.get<any>(url);
  }

  
  getSalaByIdFuncion(id_sala: number): Observable<any> {
    const url = `http://localhost:3000/api/salas_funciones/${id_sala}`;
    return this.http.get<any>(url);
  }
  
  actualizarSala(id_sala: number, sala: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.apiUrl}/${id_sala}`;
    return this.http.put(url, sala,{ headers });
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
}
