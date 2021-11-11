import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualChartDataFilterComponent } from './individual-chart-data-filter.component';

describe('IndividualChartDataFilterComponent', () => {
  let component: IndividualChartDataFilterComponent;
  let fixture: ComponentFixture<IndividualChartDataFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualChartDataFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualChartDataFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
