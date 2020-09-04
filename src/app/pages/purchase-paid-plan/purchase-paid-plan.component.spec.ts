import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasePaidPlanComponent } from './purchase-paid-plan.component';

describe('PurchasePaidPlanComponent', () => {
  let component: PurchasePaidPlanComponent;
  let fixture: ComponentFixture<PurchasePaidPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasePaidPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasePaidPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
