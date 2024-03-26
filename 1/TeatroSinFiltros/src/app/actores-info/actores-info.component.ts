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
  templateUrl: './actores-info.component.html',
  styleUrls: ['./actores-info.component.css']
})



export class ActoresInfoComponent implements OnInit {
  actor = { nombre: '', descripcion: '', imagen_url: '' };
  actores: any[] = [];
  selectedObraId: string = '';
  actorId: any='';
  obrasSelect: any[] = [];
  obras: any[] = [];
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
     this.actorId = this.route.snapshot.paramMap.get('id');
    if (this.actorId) {
      this.actoresService.getActorById(this.actorId).subscribe(actor => {
        this.actor = actor;
        console.log(actor);
        this.cargarActoresObra(this.actorId);
      });
    }
  
    this.cargarObras();
   
  }

  cargarObras(): void {
    this.obraService.getObras().subscribe(
      data => {
        this.obrasSelect = data;
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
    this.actoresService.obtenerObrasPorActor(this.actorId).subscribe(
      (obras) => {
        console.log(obras); 
        this.obras = obras;
      },
      (error) => {
        console.error('Error al obtener actores por obra:', error);
      }
    );
  }

  anadirObra(): void {
    if(this.selectedObraId) {
      const actorObra = {
        actor_id: this.actorId,
        obra_id: this.selectedObraId
      };
      
      this.obraService.anadirActorObra(actorObra).subscribe({
        next: (response) =>     window.location.reload(),
        error: (error) => console.error('Error al añadir actor', error)
      });
    } else {
      console.error('No se ha seleccionado un actor');
    }
  }

  eliminarObra(actorId: number): void {
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

  navegarAObraInfo(obraId: number): void{
    this.router.navigate(['/obras-info', obraId]);
  }

}
