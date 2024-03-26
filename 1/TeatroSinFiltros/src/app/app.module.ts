import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ShowCardComponent } from './show-card/show-card.component';
import { LoginComponent } from './login/login.component';
import { AddObraComponent } from './add-obra/add-obra.component';
import { HomeComponent } from './home/home.component';
import { RegistrarUsuarioComponent } from './registrar-usuario/registrar-usuario.component';
import { AuthenticationService } from './services/authentication.service';
import { SalaComponent } from './sala/sala.component';
import { CrearSalaComponent } from './crear-sala/crear-sala.component';
import { ControlUsuariosComponent } from './control-usuarios/control-usuarios.component';
import { ModificacionSalaComponent } from './modificacion-sala/modificacion-sala.component';
import { MostrarSalasComponent } from './mostrar-salas/mostrar-salas.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { CrearReservaComponent } from './crear-reserva/crear-reserva.component';
import { MostrarReservasComponent } from './mostrar-reservas/mostrar-reservas.component';
import { ModificarReservaComponent } from './modificar-reserva/modificar-reserva.component';
import { ComprobarEntradasComponent } from './comprobar-entradas/comprobar-entradas.component';
import { ActoresComponent } from './actores/actores.component';
import { AddActoresComponent } from './add-actores/add-actores.component';
import { ActoresInfoComponent } from './actores-info/actores-info.component';
import { ObrasComponent } from './obras/obras.component';
import { ObrasInfoComponent } from './obras-info/obras-info.component';
import { ContactoComponent } from './contacto/contacto.component';



@NgModule({
  declarations: [
    AppComponent,
    ShowCardComponent,
    LoginComponent,
    HomeComponent,
    AddObraComponent,
    RegistrarUsuarioComponent,
    SalaComponent,
    CrearSalaComponent,
    ControlUsuariosComponent,
    ModificacionSalaComponent,
    MostrarSalasComponent,
    CrearReservaComponent,
    MostrarReservasComponent,
    ModificarReservaComponent,
    ComprobarEntradasComponent,
    ActoresComponent,
    AddActoresComponent,
    ActoresInfoComponent,
    ObrasComponent,
    ObrasInfoComponent,
    ContactoComponent,
   
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    GoogleMapsModule,
  ],
  providers: [AuthenticationService, 
    { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
