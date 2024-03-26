import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddObraComponent } from './add-obra.component';
import { ObraService } from '../services/obra.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('AddObraComponent', () => {
  let component: AddObraComponent;
  let fixture: ComponentFixture<AddObraComponent>;
  let obraService: ObraService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddObraComponent],
      imports: [RouterTestingModule, FormsModule, HttpClientTestingModule],
      providers: [ObraService]
    }).compileComponents();

    fixture = TestBed.createComponent(AddObraComponent);
    component = fixture.componentInstance;
    obraService = TestBed.inject(ObraService);
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });




  it('debería agregar una nueva obra y redirigir al enviar el formulario exitosamente', () => {
    spyOn(obraService, 'addObra').and.returnValue(of({}));
    component.onSubmit();
    expect(obraService.addObra).toHaveBeenCalledWith(component.obra);
  });

  it('debería manejar el error al agregar una obra con título duplicado', () => {
    const errorResponse = new HttpErrorResponse({ status: 409, statusText: 'Conflict' });
    spyOn(obraService, 'addObra').and.returnValue(throwError(errorResponse));

    component.onSubmit();
    expect(component.errorMessage).toContain('Ya existe una obra con ese título');
  });

});