import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosDossierComponent } from './infos-dossier.component';

describe('InfosDossierComponent', () => {
  let component: InfosDossierComponent;
  let fixture: ComponentFixture<InfosDossierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfosDossierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfosDossierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
