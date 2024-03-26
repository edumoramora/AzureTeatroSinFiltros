import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface SalaResponse {
  id_sala_funciones: number;
  id_reservas_teatrales: number;
}

@Injectable({
  providedIn: 'root'
})

export class AsientosService {
  private apiUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) { }

 
  getAsientos(idSala: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/asientos/${idSala}`);
  }

  
  getAsientosFunciones(idSala: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/asientosFunciones/${idSala}`);
  }

  getIdSalaPorIdObra(idObra: any):  Observable<SalaResponse> {
    return this.http.get<SalaResponse>(`${this.apiUrl}/obra/${idObra}/sala`);
  }
}