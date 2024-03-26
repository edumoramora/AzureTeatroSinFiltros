import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Entrada {
  id_reserva: null,
  nombre: null,
  num_entradas: null,
  id_reservas_teatrales: null,
  nombre_obra : null,
  fecha_hora: null
}

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

    private apiUrl = 'http://localhost:3000/api/reserva'; 

  constructor(private http: HttpClient) { }

  registrarReserva(reserva: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, reserva);
  }

  obtenerReservas(): Observable<any[]> {
    return this.http.get<Entrada[]>(`${this.apiUrl}`);
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  eliminarReserva(id: number): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/${id}`,{ headers });
  }
}