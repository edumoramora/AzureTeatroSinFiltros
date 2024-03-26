import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ObraService } from '../services/obra.service';
import { AuthenticationService } from '../services/authentication.service';
import { ActoresService } from '../services/actores.service';
import { Router } from '@angular/router';

interface Actor {
  id: number;
  nombre: string;
  imagen_url: string;
  descripcion: string;
}

@Component({
  selector: 'app-obra-detalle',
  templateUrl: './obras-info.component.html',
  styleUrls: ['./obras-info.component.css']
})



export class ObrasInfoComponent implements OnInit {
  obra = { titulo: '', descripcion: '', imagen_url: '', duracion: '', categoria: '' };
  actores: any[] = [];
  selectedActorId: string = '';
  obraId: any='';
  actoresSelect: any[] = [];
  isLoggedIn: boolean = false;
  constructor(
    private obraService: ObraService,
    private route: ActivatedRoute,
    public authService: AuthenticationService,
    private actoresService: ActoresService,
    private router: Router
  ) {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
   }

  ngOnInit(): void {
     this.obraId = this.route.snapshot.paramMap.get('id');
    if (this.obraId) {
      this.obraService.getObraById(this.obraId).subscribe(obra => {
        this.obra = obra;
        this.cargarActoresObra(this.obraId);
      });
    }
  
    this.cargarActores();
   
  }

  cargarActores(): void {
    this.actoresService.getActores().subscribe(
      data => {
        this.actoresSelect = data;
      },
      error => {
        console.error('Error al cargar actores', error);
      }
    );
  }

  get isUserAdmin(): boolean {
    return this.authService.getUserRole === 'admin';
  }

  cargarActoresObra(id: number): void {
    console.log(id);
    this.obraService.obtenerActoresPorObra(id).subscribe(
      (actores) => {
        console.log(actores); 
        this.actores = actores;
      },
      (error) => {
        console.error('Error al obtener actores por obra:', error);
      }
    );
  }

  anadirActor(): void {
    if(this.selectedActorId) {
      const actorObra = {
        actor_id: this.selectedActorId,
        obra_id: this.obraId
      };
      
      this.obraService.anadirActorObra(actorObra).subscribe({
        next: (response) =>    window.location.reload(),
        error: (error) => console.error('Error al añadir actor', error)
      });
    } else {
      console.error('No se ha seleccionado un actor');
    }
  }
  eliminarActor(actorId: number): void {
    if(confirm("¿Estás seguro de que deseas eliminar este actor?")) {
        this.obraService.eliminarActorDeObra(actorId).subscribe({
            next: (res) => {
              window.location.reload();
            },
            error: (err) => {
                console.error("Error al eliminar el actor", err);
            }
        });
    }
  }

  navegarActorInfo(actor_id: number): void{
    this.router.navigate(['/actores-info', actor_id]);
  }
}
