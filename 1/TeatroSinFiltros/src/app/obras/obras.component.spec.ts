import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObrasComponent } from './obras.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ObraService } from '../services/obra.service';
import { Router } from '@angular/router';


describe('ObrasComponent', () => {
  let component: ObrasComponent;
  let fixture: ComponentFixture<ObrasComponent>;
  let routerSpy: jasmine.Spy;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObrasComponent ],
      imports: [
        HttpClientTestingModule, 
        RouterTestingModule 
      ],
      providers: [
        ObraService 
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(ObrasComponent);
    component = fixture.componentInstance;
    routerSpy = spyOn(TestBed.inject(Router), 'navigate');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

 

  it('deberia de crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería renderizar las obras correctamente', () => {
    component.shows = [
      { id: 1, titulo: 'Obra A', imagen_url: 'url-a-imagen-a.jpg', descripcion: 'Descripción A' },
      { id: 2, titulo: 'Obra B', imagen_url: 'url-a-imagen-b.jpg', descripcion: 'Descripción B' }
    ];
    fixture.detectChanges();
    const showCards = fixture.debugElement.queryAll(By.css('.show-card'));
    expect(showCards.length).toEqual(2); 
  });

  
  it('debería llamar al método verInformacionObra y navegar a la ruta correcta', () => {
    component.verInformacionObra(1);
    expect(routerSpy).toHaveBeenCalledWith(['/obras-info', 1]);
  });
});
