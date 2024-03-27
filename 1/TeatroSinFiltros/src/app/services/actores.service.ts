import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ActoresService {
 private apiUrl = 'https://azure-teatro-sin-filtros.vercel.app/api/actores';

  constructor(private http: HttpClient) { }
  
getActores(): Observable<any[]> {
  return this.http.get<any[]>(this.apiUrl);
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
