import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable,throwError, Subject, tap  } from 'rxjs';
import { AuthenticationService } from './authentication.service';


@Injectable({
  providedIn: 'root'
})
export class ObraService {
  private apiUrl = 'https://azure-teatro-sin-filtros-k7nf-edumoramoras-projects.vercel.app/api/obras'; 
  private apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxcGNpc3h0d3Nhc3hmZHRxZHdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE0NzQ3MDEsImV4cCI6MjAyNzA1MDcwMX0.ZTJGt2t6xTEP2QZCdkR6qjgRkGnUhkqtD_xzlKFO_6s';

  private obrasActualizadas = new Subject<void>();
  constructor(private http: HttpClient,private authService: AuthenticationService) { }

getObras(): Observable<any[]> {
    const headers = new HttpHeaders({
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any[]>(this.apiUrl + '?select=*', { headers });
  }
  
  deleteObra(id: number): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.delete(`${this.apiUrl}/${id}`,{ headers });
  }

  get obrasActualizadasObservable() {
    return this.obrasActualizadas.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  addObra(obra: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl, obra,{ headers });
  }


  getObraById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  
  obtenerActoresPorObra(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/actores_obra/${id}`);
  }

  updateObra(obra: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/${obra.id}`, obra,{ headers });
  }

  anadirActorObra(actorObra: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post('http://localhost:3000/api/actores_obra', actorObra, { headers });
}
  
  eliminarActorDeObra( actorId: number): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.api}/actores_obra/${actorId}`,{ headers });
  }

}
