import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiramidePoblacionComponent } from './piramide-poblacion.component';

describe('PiramidePoblacionComponent', () => {
  let component: PiramidePoblacionComponent;
  let fixture: ComponentFixture<PiramidePoblacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PiramidePoblacionComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PiramidePoblacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
