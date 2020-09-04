import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInvoiceItemComponent } from './edit-invoice-item.component';

describe('EditInvoiceItemComponent', () => {
  let component: EditInvoiceItemComponent;
  let fixture: ComponentFixture<EditInvoiceItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditInvoiceItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInvoiceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
