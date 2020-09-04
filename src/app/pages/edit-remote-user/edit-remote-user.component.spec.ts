import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRemoteUserComponent } from './edit-remote-user.component';

describe('EditRemoteUserComponent', () => {
  let component: EditRemoteUserComponent;
  let fixture: ComponentFixture<EditRemoteUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRemoteUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRemoteUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
