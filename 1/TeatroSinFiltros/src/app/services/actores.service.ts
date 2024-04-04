import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ActoresService {
private apiUrl = 'https://dqpcisxtwsasxfdtqdwd.supabase.co/rest/v1/actores';
  private apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxcGNpc3h0d3Nhc3hmZHRxZHdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE0NzQ3MDEsImV4cCI6MjAyNzA1MDcwMX0.ZTJGt2t6xTEP2QZCdkR6qjgRkGnUhkqtD_xzlKFO_6s';

  constructor(private http: HttpClient) { }
  
getActores(): Observable<any[]> {
    const headers = new HttpHeaders()
      .set('apikey', this.apikey)
      .set('Authorization', `Bearer ${this.apikey}`);

    return this.http.get<any[]>(this.apiUrl + '?select=*', { headers });
  }

  deleteActor(actorId: number): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/${actorId}`,{ headers });
  }
  
  addActor(actor: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}`, actor, { headers });
  }

  getActorById(actorId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${actorId}`);
  }

  updateActor(actor: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/${actor.id}`, actor,{ headers });
  }

  obtenerObrasPorActor(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/obras_actor/${id}`);
  }

  anadirActorObra(actorObra: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post('http://localhost:3000/api/obras_actor', actorObra, { headers });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
