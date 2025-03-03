import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvanceContractuelControlesComponent } from './avance-contractuel-controles.component';

describe('AvanceContractuelControlesComponent', () => {
  let component: AvanceContractuelControlesComponent;
  let fixture: ComponentFixture<AvanceContractuelControlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvanceContractuelControlesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvanceContractuelControlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
