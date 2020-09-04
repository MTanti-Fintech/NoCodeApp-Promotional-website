import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeBcpHeaderComponent } from './office-bcp-header.component';

describe('OfficeBcpHeaderComponent', () => {
  let component: OfficeBcpHeaderComponent;
  let fixture: ComponentFixture<OfficeBcpHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficeBcpHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeBcpHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
