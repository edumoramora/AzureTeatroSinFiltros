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
  
private apiUrl = 'https://dqpcisxtwsasxfdtqdwd.supabase.co/rest/v1/reservas_teatrales';
private apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxcGNpc3h0d3Nhc3hmZHRxZHdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE0NzQ3MDEsImV4cCI6MjAyNzA1MDcwMX0.ZTJGt2t6xTEP2QZCdkR6qjgRkGnUhkqtD_xzlKFO_6s';

  constructor(private http: HttpClient) { }

  crearReserva(reserva: any) {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl, reserva,{ headers });
  }


  getReservas(){
    const headers = new HttpHeaders({
      'apikey': this.apikey,
      'Authorization': `Bearer ${this.apikey}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any[]>(this.apiUrl + '?select=*', { headers });
  }

  getReservasObras() {
      const headers = new HttpHeaders({
      'apikey': this.apikey,
      'Authorization': `Bearer ${this.apikey}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any[]>(this.apiUrl + '?select=*', { headers });
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
