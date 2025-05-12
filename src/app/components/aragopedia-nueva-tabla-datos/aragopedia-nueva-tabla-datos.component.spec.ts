import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AragopediaNuevaTablaDatosComponent } from './aragopedia-nueva-tabla-datos.component';

describe('AragopediaNuevaTablaDatosComponent', () => {
  let component: AragopediaNuevaTablaDatosComponent;
  let fixture: ComponentFixture<AragopediaNuevaTablaDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AragopediaNuevaTablaDatosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AragopediaNuevaTablaDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
