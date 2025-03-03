import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrganisationComponent } from './admin-organisation.component';

describe('AdminOrganisationComponent', () => {
  let component: AdminOrganisationComponent;
  let fixture: ComponentFixture<AdminOrganisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminOrganisationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOrganisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
