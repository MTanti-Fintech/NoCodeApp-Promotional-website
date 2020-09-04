import { TestBed } from '@angular/core/testing';

import { PurchasePaidPlanService } from './purchase-paid-plan.service';

describe('PurchasePaidPlanService', () => {
  let service: PurchasePaidPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchasePaidPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
