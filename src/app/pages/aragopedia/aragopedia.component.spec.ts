import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AragopediaComponent } from './aragopedia.component';

describe('AragopediaComponent', () => {
  let component: AragopediaComponent;
  let fixture: ComponentFixture<AragopediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AragopediaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AragopediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
