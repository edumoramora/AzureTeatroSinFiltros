import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ControlUsuariosComponent } from './control-usuarios.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ControlUsuariosComponent', () => {
  let component: ControlUsuariosComponent;
  let fixture: ComponentFixture<ControlUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ControlUsuariosComponent],
      imports: [FormsModule, HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlUsuariosComponent);
    component = fixture.componentInstance;
    component.usuarios = [
      { id_usuario: 1, nombre_usuario: 'Usuario 1', email: 'usuario1@example.com', rol: 'admin', contraseña: 'cifrada' },
     ];
    fixture.detectChanges();
  });

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar usuarios correctamente', () => {
    const filasUsuarios = fixture.debugElement.queryAll(By.css('.table tbody tr'));
    expect(filasUsuarios.length).toEqual(component.usuarios.length);
  });



  it('debería mostrar mensajes de error y éxito', () => {
    component.mensajeError = 'Error al cargar los usuarios';
    component.mensajeExito = 'Usuario creado con éxito';
    fixture.detectChanges();
    const mensajeError = fixture.debugElement.query(By.css('.alert-danger')).nativeElement.innerText;
    const mensajeExito = fixture.debugElement.query(By.css('.alert-success')).nativeElement.innerText;
    expect(mensajeError).toContain('Error al cargar los usuarios');
    expect(mensajeExito).toContain('Usuario creado con éxito');
  });

  it('debería llamar al método para eliminar un usuario', () => {
    const usuarioParaEliminar = component.usuarios[0];
    spyOn(component, 'eliminarUsuario').and.callThrough();
    component.eliminarUsuario(usuarioParaEliminar.id_usuario);
    expect(component.eliminarUsuario).toHaveBeenCalledWith(usuarioParaEliminar.id_usuario);
  });

  it('debería habilitar la edición para un usuario', async () => {
    component.habilitarEdicion(component.usuarios[0]);
    fixture.detectChanges();
    await fixture.whenStable();
    const inputNombreUsuario = fixture.debugElement.query(By.css(`input[type="text"]`)).nativeElement;
    expect(inputNombreUsuario.value).toEqual('Usuario 1');
  });
  

  });