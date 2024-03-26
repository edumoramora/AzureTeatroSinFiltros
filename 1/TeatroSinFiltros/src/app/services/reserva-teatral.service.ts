import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

interface Reserva {
  id_obra: number | null,
  id_sala: number | null,
  fecha_hora: string | null,
  id_reservas_teatrales: number | null
}

@Injectable({
  providedIn: 'root'
})


export class ReservaService {

  private apiUrl = 'http://localhost:3000/api/reservas_teatrales'; 

  constructor(private http: HttpClient) { }

  crearReserva(reserva: any) {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl, reserva,{ headers });
  }

  getReservas() {
    return this.http.get<any[]>(this.apiUrl);
  }

  getReservasObras() {
    return this.http.get<any[]>('http://localhost:3000/api/reservas_teatrales_obras');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  modificarReserva(id: number, reserva: any) {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/${id}`, reserva,{ headers });
  }

  eliminarReserva(id: number) {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/${id}`,{ headers });
  }

  getReservaPorId(id: number) {
    return this.http.get<Reserva>(`${this.apiUrl}/${id}`);
  }
}