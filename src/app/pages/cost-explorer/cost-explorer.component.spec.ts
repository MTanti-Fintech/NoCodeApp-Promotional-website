import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostExplorerComponent } from './cost-explorer.component';

describe('CostExplorerComponent', () => {
  let component: CostExplorerComponent;
  let fixture: ComponentFixture<CostExplorerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostExplorerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
