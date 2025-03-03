import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnomalieComponent } from './anomalie.component';

describe('AnomalieComponent', () => {
  let component: AnomalieComponent;
  let fixture: ComponentFixture<AnomalieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnomalieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnomalieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
