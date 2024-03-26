import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AddObraComponent } from './add-obra/add-obra.component';
import { RegistrarUsuarioComponent } from './registrar-usuario/registrar-usuario.component';
import { SalaComponent } from './sala/sala.component';
import { CrearSalaComponent } from './crear-sala/crear-sala.component';
import { ModificacionSalaComponent } from './modificacion-sala/modificacion-sala.component';
import { ModificarReservaComponent } from './modificar-reserva/modificar-reserva.component';
import { MostrarSalasComponent } from './mostrar-salas/mostrar-salas.component';
import { CrearReservaComponent } from './crear-reserva/crear-reserva.component';
import { MostrarReservasComponent } from './mostrar-reservas/mostrar-reservas.component';
import { ControlUsuariosComponent } from './control-usuarios/control-usuarios.component';
import { ActoresComponent } from './actores/actores.component';
import { ComprobarEntradasComponent } from './comprobar-entradas/comprobar-entradas.component';
import { AddActoresComponent } from './add-actores/add-actores.component';
import { ActoresInfoComponent } from './actores-info/actores-info.component';
import { ObrasInfoComponent } from './obras-info/obras-info.component';
import { ObrasComponent } from './obras/obras.component';
import { ContactoComponent } from './contacto/contacto.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'actores-info/:id', component: ActoresInfoComponent },
  { path: 'obras-info/:id', component: ObrasInfoComponent },
  { path: 'obras', component: ObrasComponent },
  { path: 'add-actores', component: AddActoresComponent },
  { path: 'add-obra', component: AddObraComponent },
  { path: 'modificar-obra/:id', component: AddObraComponent },
  { path: 'registrar-usuario', component: RegistrarUsuarioComponent },
  { path: 'sala/:id', component: SalaComponent },
  { path: 'add-actores/:id', component: AddActoresComponent },
  { path: 'crear-sala', component: CrearSalaComponent },
  { path: 'mostrar-salas', component: MostrarSalasComponent },
  { path: 'actores', component: ActoresComponent },
  { path: 'modificacion-sala/:id', component: ModificacionSalaComponent },
  { path: 'crear-reserva', component: CrearReservaComponent },
  { path: 'modificar-reserva/:id', component: ModificarReservaComponent },
  { path: 'mostrar-reservas', component: MostrarReservasComponent },
  { path: 'comprobar-entradas', component: ComprobarEntradasComponent },
  { path: 'control-usuarios', component: ControlUsuariosComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
