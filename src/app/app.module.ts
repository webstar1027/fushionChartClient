import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { SelectModule } from 'ng-select';
import { StatsComponent } from './components/stats/stats.component';
import { IndividualChartDataComponent } from './components/individual-chart-data/individual-chart-data.component';
import { FusionChartsModule } from 'angular-fusioncharts';
import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import { Daterangepicker } from 'ng2-daterangepicker';
import * as Zune from 'fusioncharts/themes/fusioncharts.theme.zune.js';
import * as Ocean from 'fusioncharts/themes/fusioncharts.theme.ocean.js';
import { IndividualChartDataFilterComponent } from './components/individual-chart-data-filter/individual-chart-data-filter.component';
import { Safe } from './pipes/safeHtml.pipe';


FusionChartsModule.fcRoot(FusionCharts, Charts,  Zune, Ocean);

@NgModule({
  declarations: [
    AppComponent,
    StatsComponent,
    IndividualChartDataComponent,
    IndividualChartDataFilterComponent,
    Safe
  ],
  imports: [
    BrowserModule,
    FusionChartsModule,
    Daterangepicker,
    FormsModule,
    SelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
