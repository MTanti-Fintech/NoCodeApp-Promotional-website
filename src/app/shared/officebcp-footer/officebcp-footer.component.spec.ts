import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficebcpFooterComponent } from './officebcp-footer.component';

describe('OfficebcpFooterComponent', () => {
  let component: OfficebcpFooterComponent;
  let fixture: ComponentFixture<OfficebcpFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficebcpFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficebcpFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
