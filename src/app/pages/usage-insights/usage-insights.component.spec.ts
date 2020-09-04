import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageInsightsComponent } from './usage-insights.component';

describe('UsageInsightsComponent', () => {
  let component: UsageInsightsComponent;
  let fixture: ComponentFixture<UsageInsightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsageInsightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsageInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
