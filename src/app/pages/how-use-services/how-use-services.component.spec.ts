import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowUseServicesComponent } from './how-use-services.component';

describe('HowUseServicesComponent', () => {
  let component: HowUseServicesComponent;
  let fixture: ComponentFixture<HowUseServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowUseServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowUseServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
