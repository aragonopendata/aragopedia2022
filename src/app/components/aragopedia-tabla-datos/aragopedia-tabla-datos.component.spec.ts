import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AragopediaTablaDatosComponent } from './aragopedia-tabla-datos.component';

describe('AragopediaTablaDatosComponent', () => {
  let component: AragopediaTablaDatosComponent;
  let fixture: ComponentFixture<AragopediaTablaDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AragopediaTablaDatosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AragopediaTablaDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
