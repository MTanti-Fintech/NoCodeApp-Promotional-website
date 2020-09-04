import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeWorkingModalPopupComponent } from './change-working-modal-popup.component';

describe('ChangeWorkingModalPopupComponent', () => {
  let component: ChangeWorkingModalPopupComponent;
  let fixture: ComponentFixture<ChangeWorkingModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeWorkingModalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeWorkingModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
