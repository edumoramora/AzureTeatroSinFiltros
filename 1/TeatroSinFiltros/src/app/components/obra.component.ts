// src/app/components/obra/obra.component.ts
import { Component, OnInit } from '@angular/core';
import { ObraService } from '../services/obra.service';


@Component({
  selector: 'app-obra',
  templateUrl: './obra.component.html',
  styleUrls: ['./obra.component.css']
  
})
export class ObraComponent implements OnInit {
  obras: any[] = [];
  isAdmin: boolean = true;

  constructor(private obraService: ObraService) { }

  ngOnInit() {
    this.obraService.getObras().subscribe(
      (data) => {
        this.obras = data;
      },
      (error) => {
        console.error('Error al obtener obras', error);
      }
    );
  }

}
