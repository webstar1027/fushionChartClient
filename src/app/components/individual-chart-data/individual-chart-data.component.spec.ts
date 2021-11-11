import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualChartDataComponent } from './individual-chart-data.component';

describe('IndividualChartDataComponent', () => {
  let component: IndividualChartDataComponent;
  let fixture: ComponentFixture<IndividualChartDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualChartDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualChartDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
