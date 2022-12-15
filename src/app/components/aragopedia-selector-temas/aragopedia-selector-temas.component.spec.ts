import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AragopediaSelectorTemasComponent } from './aragopedia-selector-temas.component';

describe('AragopediaSelectorTemasComponent', () => {
  let component: AragopediaSelectorTemasComponent;
  let fixture: ComponentFixture<AragopediaSelectorTemasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AragopediaSelectorTemasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AragopediaSelectorTemasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
