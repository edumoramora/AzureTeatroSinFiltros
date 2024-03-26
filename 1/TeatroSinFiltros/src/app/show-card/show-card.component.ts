import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-card',
  templateUrl: './show-card.component.html',
  styleUrls: ['./show-card.component.css']
})
export class ShowCardComponent {
    @Input() id: string = '';
    @Input() id_sala: string = '';
    @Input() showImageUrl: string = '';
    @Input() bookingUrl: string = '';
    @Input() showDescription: string = '';

    constructor(private router: Router) { }

 comprarEntradas(id:string,id_reservas_teatrales:string): void {
    this.router.navigate(['/sala',id_reservas_teatrales]); 
  }
  showButton: boolean = false;
}