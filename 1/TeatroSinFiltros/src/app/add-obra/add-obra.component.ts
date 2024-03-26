import { Component, OnInit } from '@angular/core';
import { ObraService } from '../services/obra.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-obra',
  templateUrl: './add-obra.component.html',
  styleUrls: ['./add-obra.component.css']
})
export class AddObraComponent  implements OnInit{
  obra = {
    titulo: '',
    imagen_url: '',
    descripcion: '',
    categoria: '',
    duracion: ''
  };
  isEditing = false;
  errorMessage: string = '';

  constructor(private obraService: ObraService,  private route: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const obraId = params.get('id');
      if (obraId) {
        this.isEditing = true;
        this.obraService.getObraById(obraId).subscribe((data) => {
          this.obra = data;
        }, error => {
          console.error('Error al obtener la obra', error);
        });
      }
    });
  }
  
  onSubmit() {
    if (this.isEditing) {
      this.obraService.updateObra(this.obra).subscribe(() => {
        this.router.navigate(['/']); 
      }, error => {
        if (error.status === 409) {
          this.errorMessage = 'Ya existe una obra con ese título. Por favor, elige otro título.';
        } else {
          console.error('Error al agregar obra', error);
        }
      });
    } else {
      this.obraService.addObra(this.obra).subscribe(() => {
        this.router.navigate(['/']); // Redirige al inicio después de añadir
      }, error => {
        if (error.status === 409) {
          this.errorMessage = 'Ya existe una obra con ese título. Por favor, elige otro título.';
        } else {
          console.error('Error al agregar obra', error);
        }
      });
    }
  }
}
