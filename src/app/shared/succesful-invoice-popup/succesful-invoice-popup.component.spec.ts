import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccesfulInvoicePopupComponent } from './succesful-invoice-popup.component';

describe('SuccesfulInvoicePopupComponent', () => {
  let component: SuccesfulInvoicePopupComponent;
  let fixture: ComponentFixture<SuccesfulInvoicePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccesfulInvoicePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccesfulInvoicePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
