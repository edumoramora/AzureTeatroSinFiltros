import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable,throwError, Subject, tap  } from 'rxjs';
import { AuthenticationService } from './authentication.service';


@Injectable({
  providedIn: 'root'
})
export class ObraService {
  private apiUrl = 'http://localhost:3000/api/obras'; 
  private api = 'http://localhost:3000/api';
  private obrasActualizadas = new Subject<void>();
  constructor(private http: HttpClient,private authService: AuthenticationService) { }

  getObras(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
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
