import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GenerarsalaService {
    private apiUrl = 'https://dqpcisxtwsasxfdtqdwd.supabase.co/rest/v1/salas';
    private apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxcGNpc3h0d3Nhc3hmZHRxZHdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE0NzQ3MDEsImV4cCI6MjAyNzA1MDcwMX0.ZTJGt2t6xTEP2QZCdkR6qjgRkGnUhkqtD_xzlKFO_6s';

  constructor(private http: HttpClient) { }

  subirConfiguracionSala(sala: any) {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl, sala,{ headers });
  }
  
 getSalas(): Observable<any[]> {
    const headers = new HttpHeaders({
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any[]>(this.apiUrl + '?select=*', { headers });
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
