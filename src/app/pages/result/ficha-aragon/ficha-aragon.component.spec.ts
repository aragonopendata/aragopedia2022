import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaAragonComponent } from './ficha-aragon.component';

describe('FichaAragonComponent', () => {
  let component: FichaAragonComponent;
  let fixture: ComponentFixture<FichaAragonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaAragonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaAragonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
