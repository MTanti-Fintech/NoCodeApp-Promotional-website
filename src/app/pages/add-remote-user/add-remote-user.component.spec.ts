import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRemoteUserComponent } from './add-remote-user.component';

describe('AddRemoteUserComponent', () => {
  let component: AddRemoteUserComponent;
  let fixture: ComponentFixture<AddRemoteUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRemoteUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoteUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
