import { Component , NgZone } from '@angular/core';
import config from '../../config.json';
import * as $ from 'jquery';
import * as moment from 'moment';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Pediatrics Center';
  selectedStartDate = '';
  selectedEndDate = '';
  completeDate = '';
  comparedWith = '';
  chartData = '';
  filteredtotalAdmissionData ;
  filteredlwobsCountData;
  avgadmissionDaysData;
  sameDayDischargeData;
  departmentFilteredData;
  ageWiseFilteredData;
  dailyFilteredData;
  filteredKeyElemntsData;
  dailylwobsFilteredData;
  departmentDischargeddData;
  ageLwobsData;
  fullResult;
  ageDischargedData;
  departmentLWOBSData;
  dailyldischrgedFilteredData;
  loader =  true;
  admission = true;
  lwobs = false;
  avgadmission = false;
  discharge= false;
  loaderChart;
  activeadv = "active";
  activedis = "";
  activelwo = "";
  activeavg ="";

  admissionStatConfig = {
    title: "Total Admission",
    icon: "fa-user",
    filterKey: "mrnNumber",
    statType: "totalAdmission"
  };
  lwobsStatConfig = {
      title: "Patient LWOBS",
      icon: "fa-user",
      filterKey: "mrnNumber",
      statType: "lwobsCount"
  };
  lwobsPercentageStatConfig = {
      title: "Patient LWOBS(%)",
      icon: "fa-user",
      filterKey: "mrnNumber",
      statType: "lwobsCountPercentage"
  };
  avgadmissinDaysStatConfig = {
      title: "Avg LOS Days",
      icon: "fa-clock-o",
      filterKey: "mrnNumber",
      statType: "avgadmissiondays"
  };
  sameDayDischargeStatConfig = {
      title: "Total Discharge",
      icon: "fa-user",
      filterKey: "mrnNumber",
      statType: "sameDayDischarge"
  };

  departmentContainerData = {
      containerTitle: "Admissions Count",
      renderAt: "departmentData",
      filterKey: "admitType",
      xAxisName: "",
      yAxisName: "",
      type: "doughnut2d",
      showChartType: "1",
      chartTypes: [
          {
              "name": "column2d",
              "icon": "column.svg"
          }, {
              "name": "doughnut2d",
              "icon": "doughnout-chart.svg"
          }
      ],
      chartConfig: {
          "plottooltext": "$label<span>: </span>$dataValue <span>patients</span>",
          "enableSlicing":"0",
          "plotspacepercent": "30",
          "labelpadding": "5",
          "yaxisvaluespadding": "10",
          "centerlabelfontsize": "18",
          "valuefontsize": "12",
          "baseFontSize": "12",
          "labelfontsize": "12",
          "animation": "1",
          "toolTipBgColor": "#FFF",
          "toolTipColor": "#000",
          "toolTipPadding": "10",
          "showToolTipShadow": "1",
          "startingAngle": "90",
          "numberSuffix": "",
          "theme": "ocean",
          "enablesmartlabels": "0",
          "rotateValues": "0",
          "placevaluesinside": "0",
          "valueFontColor": "#000",
          "exportEnabled" : "1"
      }
  };
  admissionDayWiseContainerData = {
      containerTitle: "Admissions by Date",
      renderAt: "admissionDayWise",
      filterKey: "admitType",
      xAxisName: "",
      yAxisName: "",
      type: "scrollstackedcolumn2d",
      showChartType: "1",
      chartTypes: [
          {
              "name": "msline",
              "icon": "line.svg"
          },
          {
              "name": "scrollstackedcolumn2d",
              "icon": "column.svg"
          }
      ],
      chartConfig: {
          "drawcustomlegendicon": "2",
          "plottooltext": "$seriesName<span>: </span>$dataValue <span>patients</span>",
          "drawcrossline": "1",
          "anchorAlpha": "0",
          "anchorHoverAlpha": "100",
          "legenditemfontsize": "12",
          "labelpadding": "5",
          "yaxisvaluespadding": "10",
          "valuefontsize": "12",
          "baseFontSize": "12",
          "labelfontsize": "10",
          "animation": "1",
          "toolTipBgColor": "#FFF",
          "toolTipColor": "#000",
          "toolTipPadding": "10",
          "showToolTipShadow": "1",
          "numberSuffix": "",
          "theme": "ocean",
          "flatScrollBars": "1",
          "scrollheight": "10",
          "numVisiblePlot": "30",
          "showHoverEffect": "1",
          "connectNullData": "1",
          "showValues": "0",
          "placevaluesinside": "0",
          "valueFontColor": "#000",
          "exportEnabled" : "1"
      }
  };
  cohortUnitContainerData = {
      containerTitle: "Admissions by Cohort",
      renderAt: "cohortData",
      filterKey: "cohort",
      xAxisName: "",
      yAxisName: "",
      type: "bar2D",
      showChartType: "0",
      chartConfig: {
          "plottooltext": "$label<span>: </span>$dataValue <span>patients</span>",
          "labelpadding": "10",
          "yaxisvaluespadding": "11",
          "baseFontSize": "12",
          "labelfontsize": "10",
          "animation": "1",
          "valuefontsize": "12",
          "toolTipBgColor": "#FFF",
          "toolTipColor": "#000",
          "toolTipPadding": "10",
          "showToolTipShadow": "1",
          "numberSuffix": "",
          "theme": "ocean",
          "enablesmartlabels": "0",
          "rotateValues": "0",
          "placevaluesinside": "0",
          "valueFontColor": "#000",
          "exportEnabled" : "1"
      }
  };
  clinitUnitContainerData = {
      containerTitle: "Admissions by Clinic",
      renderAt: "clinicData",
      filterKey: "clinicalUnit",
      xAxisName: "",
      yAxisName: "",
      type: "bar2D",
      showChartType: "0",
      chartConfig: {
          "plottooltext": "$label<span>: </span>$dataValue <span>patients</span>",
          "labelpadding": "10",
          "yaxisvaluespadding": "11",
          "baseFontSize": "12",
          "labelfontsize": "10",
          "animation": "1",
          "valuefontsize": "12",
          "toolTipBgColor": "#FFF",
          "toolTipColor": "#000",
          "toolTipPadding": "10",
          "showToolTipShadow": "1",
          "numberSuffix": "",
          "theme": "ocean",
          "enablesmartlabels": "0",
          "rotateValues": "0",
          "placevaluesinside": "0",
          "valueFontColor": "#000",
          "exportEnabled" : "1"
      }
  };
  ageWiseContainerData = {
      containerTitle: "Admissions by Age",
      renderAt: "ageWise",
      filterKey: "mrnNumber",
      xAxisName: "",
      yAxisName: "",
      type: "column2D",
      showChartType: "0",
      chartConfig: {
          "plottooltext": "$label<span>: </span>$dataValue <span>patients</span>",
          "labelpadding": "10",
          "yaxisvaluespadding": "10",
          "baseFontSize": "12",
          "labelfontsize": "12",
          "animation": "1",
          "valuefontsize": "12",
          "toolTipBgColor": "#FFF",
          "toolTipColor": "#000",
          "toolTipPadding": "10",
          "showToolTipShadow": "1",
          "numberSuffix": "",
          "theme": "ocean",
          "enablesmartlabels": "0",
          "rotateValues": "0",
          "placevaluesinside": "0",
          "valueFontColor": "#000",
          "exportEnabled" : "1"
      }
  };

  lwobsbyAdmitTypeData = {
      containerTitle: "LWOBS Count",
      renderAt: "departmentData",
      filterKey: "admitType",
      xAxisName: "",
      yAxisName: "",
      type: "doughnut2d",
      showChartType: "1",
      chartTypes: [
          {
              "name": "column2d",
              "icon": "column.svg"
          }, {
              "name": "doughnut2d",
              "icon": "doughnout-chart.svg"
          }
      ],
      chartConfig: {
          "plottooltext": "$label<span>: </span>$dataValue <span>patients</span>",
          "enableSlicing":"0",
          "plotspacepercent": "30",
          "labelpadding": "5",
          "yaxisvaluespadding": "10",
          "centerlabelfontsize": "18",
          "valuefontsize": "12",
          "baseFontSize": "12",
          "labelfontsize": "12",
          "animation": "1",
          "toolTipBgColor": "#FFF",
          "toolTipColor": "#000",
          "toolTipPadding": "10",
          "showToolTipShadow": "1",
          "startingAngle": "90",
          "numberSuffix": "",
          "theme": "ocean",
          "enablesmartlabels": "0",
          "rotateValues": "0",
          "placevaluesinside": "0",
          "valueFontColor": "#000",
          "exportEnabled" : "1"
      }
  };
  lwobsContainerbyReasonData = {
      containerTitle: "LWOBS by Reason",
      renderAt: "lwobsDatabyReason",
      filterKey: "clinicalUnit",
      xAxisName: "",
      yAxisName: "",
      type: "bar2D",
      showChartType: "0",
      chartConfig: {
          "plottooltext": "$label<span>: </span>$dataValue <span>patients</span>",
          "labelpadding": "10",
          "yaxisvaluespadding": "10",
          "baseFontSize": "12",
          "labelfontsize": "12",
          "animation": "1",
          "valuefontsize": "12",
          "toolTipBgColor": "#FFF",
          "toolTipColor": "#000",
          "toolTipPadding": "10",
          "showToolTipShadow": "1",
          "numberSuffix": "",
          "theme": "ocean",
          "enablesmartlabels": "0",
          "rotateValues": "0",
          "placevaluesinside": "0",
          "valueFontColor": "#000",
          "exportEnabled" : "1"
      }
  };
  ageWiseLwobsContainerData = {
      containerTitle: "LWOBS by Age",
      renderAt: "ageWise",
      filterKey: "mrnNumber",
      xAxisName: "",
      yAxisName: "",
      type: "column2d",
      showChartType: "0",
      chartConfig: {
          "plottooltext": "$label<span>: </span>$dataValue <span>patients</span>",
          "labelpadding": "10",
          "yaxisvaluespadding": "10",
          "baseFontSize": "12",
          "labelfontsize": "12",
          "animation": "1",
          "valuefontsize": "12",
          "toolTipBgColor": "#FFF",
          "toolTipColor": "#000",
          "toolTipPadding": "10",
          "showToolTipShadow": "1",
          "numberSuffix": "",
          "theme": "ocean",
          "enablesmartlabels": "0",
          "rotateValues": "0",
          "placevaluesinside": "0",
          "valueFontColor": "#000",
          "exportEnabled" : "1"
      }
  };
  lwobsbyCohortData = {
      containerTitle: "LWOBS by Cohort",
      renderAt: "cohortData",
      filterKey: "cohort",
      xAxisName: "",
      yAxisName: "",
      type: "bar2D",
      showChartType: "0",
      chartConfig: {
          "plottooltext": "$label<span>: </span>$dataValue <span>patients</span>",
          "labelpadding": "10",
          "yaxisvaluespadding": "10",
          "baseFontSize": "12",
          "labelfontsize": "12",
          "animation": "1",
          "valuefontsize": "12",
          "toolTipBgColor": "#FFF",
          "toolTipColor": "#000",
          "toolTipPadding": "10",
          "showToolTipShadow": "1",
          "numberSuffix": "",
          "theme": "ocean",
          "enablesmartlabels": "0",
          "rotateValues": "0",
          "placevaluesinside": "0",
          "valueFontColor": "#000",
          "exportEnabled" : "1"
      }
  };
  lwobsbyClinicData = {
      containerTitle: "LWOBS by Clinic",
      renderAt: "clinicData",
      filterKey: "clinicalUnit",
      xAxisName: "",
      yAxisName: "",
      type: "bar2D",
      showChartType: "0",
      chartConfig: {
          "plottooltext": "$label<span>: </span>$dataValue <span>patients</span>",
          "labelpadding": "10",
          "yaxisvaluespadding": "10",
          "baseFontSize": "12",
          "labelfontsize": "12",
          "animation": "1",
          "valuefontsize": "12",
          "toolTipBgColor": "#FFF",
          "toolTipColor": "#000",
          "toolTipPadding": "10",
          "showToolTipShadow": "1",
          "numberSuffix": "",
          "theme": "ocean",
          "enablesmartlabels": "0",
          "rotateValues": "0",
          "placevaluesinside": "0",
          "valueFontColor": "#000",
          "exportEnabled" : "1"
      }
  };
  lwobsDayWiseContainerData = {
      containerTitle: "LWOBS by Date",
      renderAt: "admissionDayWise",
      filterKey: "admitType",
      xAxisName: "",
      yAxisName: "",
      type: "scrollstackedcolumn2d",
      showChartType: "1",
      chartTypes: [
          {
              "name": "msline",
              "icon": "line.svg"
          },
          {
              "name": "scrollstackedcolumn2d",
              "icon": "column.svg"
          }
      ],
      chartConfig: {
          "drawcustomlegendicon": "2",
          "plottooltext": "$seriesName<span>: </span>$dataValue <span>patients</span>",
          "drawcrossline": "1",
          "anchorAlpha": "0",
          "anchorHoverAlpha": "100",
          "legenditemfontsize": "12",
          "labelpadding": "5",
          "yaxisvaluespadding": "10",
          "valuefontsize": "12",
          "baseFontSize": "12",
          "labelfontsize": "10",
          "animation": "1",
          "toolTipBgColor": "#FFF",
          "toolTipColor": "#000",
          "toolTipPadding": "10",
          "showToolTipShadow": "1",
          "numberSuffix": "",
          "theme": "ocean",
          "flatScrollBars": "1",
          "scrollheight": "10",
          "numVisiblePlot": "30",
          "showHoverEffect": "1",
          "connectNullData": "1",
          "showValues": "0",
          "placevaluesinside": "0",
          "valueFontColor": "#000",
          "exportEnabled" : "1"
      }
  };

  dischageDayWiseContainerData = {
      containerTitle: "Discharges by Date",
      renderAt: "admissionDayWise",
      filterKey: "admitType",
      xAxisName: "",
      yAxisName: "",
      type: "scrollstackedcolumn2d",
      showChartType: "1",
      chartTypes: [
          {
              "name": "msline",
              "icon": "line.svg"
          },
          {
              "name": "scrollstackedcolumn2d",
              "icon": "column.svg"
          }
      ],
      chartConfig: {
          "drawcustomlegendicon": "2",
          "plottooltext": "$seriesName<span>: </span>$dataValue <span>patients</span>",
          "drawcrossline": "1",
          "anchorAlpha": "0",
          "anchorHoverAlpha": "100",
          "legenditemfontsize": "12",
          "labelpadding": "5",
          "yaxisvaluespadding": "10",
          "valuefontsize": "12",
          "baseFontSize": "12",
          "labelfontsize": "10",
          "animation": "1",
          "toolTipBgColor": "#FFF",
          "toolTipColor": "#000",
          "toolTipPadding": "10",
          "showToolTipShadow": "1",
          "numberSuffix": "",
          "theme": "ocean",
          "flatScrollBars": "1",
          "scrollheight": "10",
          "numVisiblePlot": "30",
          "showHoverEffect": "1",
          "connectNullData": "1",
          "showValues": "0",
          "placevaluesinside": "0",
          "valueFontColor": "#000",
          "exportEnabled" : "1"
      }
  };
  dischargedepartmentContainerData = {
      containerTitle: "Discharges Count",
      renderAt: "departmentData",
      filterKey: "admitType",
      xAxisName: "",
      yAxisName: "",
      type: "doughnut2d",
      showChartType: "1",
      chartTypes: [
          {
              "name": "column2d",
              "icon": "column.svg"
          }, {
              "name": "doughnut2d",
              "icon": "doughnout-chart.svg"
          }
      ],
      chartConfig: {
          "plottooltext": "$label<span>: </span>$dataValue <span>patients</span>",
          "enableSlicing":"0",
          "plotspacepercent": "30",
          "labelpadding": "5",
          "yaxisvaluespadding": "10",
          "centerlabelfontsize": "18",
          "valuefontsize": "12",
          "baseFontSize": "12",
          "labelfontsize": "12",
          "animation": "1",
          "toolTipBgColor": "#FFF",
          "toolTipColor": "#000",
          "toolTipPadding": "10",
          "showToolTipShadow": "1",
          "startingAngle": "90",
          "numberSuffix": "",
          "theme": "ocean",
          "enablesmartlabels": "0",
          "rotateValues": "0",
          "placevaluesinside": "0",
          "valueFontColor": "#000",
          "exportEnabled" : "1"
      }
  };
  dischargebyCohortData = {
      containerTitle: "Discharges by Cohort",
      renderAt: "cohortData",
      filterKey: "cohort",
      xAxisName: "",
      yAxisName: "",
      type: "bar2D",
      showChartType: "0",
      chartConfig: {
          "plottooltext": "$label<span>: </span>$dataValue <span>patients</span>",
          "labelpadding": "10",
          "yaxisvaluespadding": "10",
          "baseFontSize": "12",
          "labelfontsize": "12",
          "animation": "1",
          "valuefontsize": "12",
          "toolTipBgColor": "#FFF",
          "toolTipColor": "#000",
          "toolTipPadding": "10",
          "showToolTipShadow": "1",
          "numberSuffix": "",
          "theme": "ocean",
          "enablesmartlabels": "0",
          "rotateValues": "0",
          "placevaluesinside": "0",
          "valueFontColor": "#000",
          "exportEnabled" : "1"
      }
  };
  ageWiseDischargedContainerData = {
      containerTitle: "Discharges by Age",
      renderAt: "ageWise",
      filterKey: "mrnNumber",
      xAxisName: "",
      yAxisName: "",
      type: "column2d",
      showChartType: "0",
      chartConfig: {
        "plottooltext": "$label<span>: </span>$dataValue <span>patients</span>",
          "labelpadding": "10",
          "yaxisvaluespadding": "10",
          "baseFontSize": "12",
          "labelfontsize": "12",
          "animation": "1",
          "valuefontsize": "12",
          "toolTipBgColor": "#FFF",
          "toolTipColor": "#000",
          "toolTipPadding": "10",
          "showToolTipShadow": "1",
          "numberSuffix": "",
          "theme": "ocean",
          "enablesmartlabels": "0",
          "rotateValues": "0",
          "placevaluesinside": "0",
          "valueFontColor": "#000",
          "exportEnabled" : "1"
      }
  };
  dischargedbyClinicData = {
      containerTitle: "Discharges by Clinic",
      renderAt: "clinicData",
      filterKey: "clinicalUnit",
      xAxisName: "",
      yAxisName: "",
      type: "bar2D",
      showChartType: "0",
      chartConfig: {
          "plottooltext": "$label<span>: </span>$dataValue <span>patients</span>",
          "labelpadding": "10",
          "yaxisvaluespadding": "10",
          "baseFontSize": "12",
          "labelfontsize": "12",
          "animation": "1",
          "valuefontsize": "12",
          "toolTipBgColor": "#FFF",
          "toolTipColor": "#000",
          "toolTipPadding": "10",
          "showToolTipShadow": "1",
          "numberSuffix": "",
          "theme": "ocean",
          "enablesmartlabels": "0",
          "rotateValues": "0",
          "placevaluesinside": "0",
          "valueFontColor": "#000",
          "exportEnabled" : "1"
      }
  };

  losContainerData = {
      containerTitle: "Avg Admission Count (in days)",
      renderAt: "losData",
      filterKey: "admitType",
      xAxisName: "",
      yAxisName: "",
      type: "column2d",
      showChartType: "0",
      chartTypes: [
          {
              "name": "column2d",
              "icon": "column.svg"
          }, {
              "name": "doughnut2d",
              "icon": "doughnout-chart.svg"
          }
      ],
      chartConfig: {
          "plottooltext": "$label<span>: </span>$dataValue <span>days</span>",
          "enableSlicing":"0",
          "plotspacepercent": "30",
          "labelpadding": "5",
          "yaxisvaluespadding": "10",
          "centerlabelfontsize": "18",
          "valuefontsize": "12",
          "baseFontSize": "12",
          "labelfontsize": "12",
          "animation": "1",
          "toolTipBgColor": "#FFF",
          "toolTipColor": "#000",
          "toolTipPadding": "10",
          "showToolTipShadow": "1",
          "startingAngle": "90",
          "numberSuffix": "",
          "theme": "ocean",
          "enablesmartlabels": "0",
          "rotateValues": "0",
          "placevaluesinside": "0",
          "valueFontColor": "#000",
          "exportEnabled" : "1"
      }
  };
  lostop10ContainerData = {
    containerTitle: "Top 10 Patient LOS (in days)",
    renderAt: "losDatatop10",
    filterKey: "admitType",
    xAxisName: "",
    yAxisName: "",
    type: "column2d",
    showChartType: "0",
    chartTypes: [
        {
            "name": "column2d",
            "icon": "column.svg"
        }, {
            "name": "doughnut2d",
            "icon": "doughnout-chart.svg"
        }
    ],
    chartConfig: {
        "plottooltext": "$label<span>: </span>$dataValue <span>days</span>",
        "enableSlicing":"0",
        "plotspacepercent": "30",
        "labelpadding": "5",
        "yaxisvaluespadding": "10",
        "centerlabelfontsize": "18",
        "valuefontsize": "12",
        "baseFontSize": "12",
        "labelfontsize": "12",
        "animation": "1",
        "toolTipBgColor": "#FFF",
        "toolTipColor": "#000",
        "toolTipPadding": "10",
        "showToolTipShadow": "1",
        "startingAngle": "90",
        "numberSuffix": "",
        "theme": "ocean",
        "enablesmartlabels": "0",
        "rotateValues": "0",
        "placevaluesinside": "0",
        "valueFontColor": "#000",
        "exportEnabled" : "1"
    }
  };
  loschorhotContainerData = {
    containerTitle: "Avg LOS by Cohort (in days)",
    renderAt: "losDatachort",
    filterKey: "cohort",
    xAxisName: "",
    yAxisName: "",
    type: "bar2d",
    showChartType: "0",
    chartTypes: [
        {
            "name": "column2d",
            "icon": "column.svg"
        }, {
            "name": "doughnut2d",
            "icon": "doughnout-chart.svg"
        }
    ],
    chartConfig: {
        "plottooltext": "$label<span>: </span>$dataValue <span>Days</span>",
        "enableSlicing":"0",
        "plotspacepercent": "30",
        "labelpadding": "5",
        "yaxisvaluespadding": "10",
        "centerlabelfontsize": "18",
        "valuefontsize": "12",
        "baseFontSize": "12",
        "labelfontsize": "12",
        "animation": "1",
        "toolTipBgColor": "#FFF",
        "toolTipColor": "#000",
        "toolTipPadding": "10",
        "showToolTipShadow": "1",
        "startingAngle": "90",
        "numberSuffix": "",
        "theme": "ocean",
        "enablesmartlabels": "0",
        "rotateValues": "0",
        "placevaluesinside": "0",
        "valueFontColor": "#000",
        "exportEnabled" : "1"
    }
  };
  losclinicContainerData = {
    containerTitle: "Avg LOS by Clinic (in days)",
    renderAt: "losDataclinic",
    filterKey: "clinicalUnit",
    xAxisName: "",
    yAxisName: "",
    type: "bar2d",
    showChartType: "0",
    chartTypes: [
        {
            "name": "column2d",
            "icon": "column.svg"
        }, {
            "name": "doughnut2d",
            "icon": "doughnout-chart.svg"
        }
    ],
    chartConfig: {
        "plottooltext": "$label<span>: </span>$dataValue <span>Days</span>",
        "enableSlicing":"0",
        "plotspacepercent": "30",
        "labelpadding": "5",
        "yaxisvaluespadding": "10",
        "centerlabelfontsize": "18",
        "valuefontsize": "12",
        "baseFontSize": "12",
        "labelfontsize": "12",
        "animation": "1",
        "toolTipBgColor": "#FFF",
        "toolTipColor": "#000",
        "toolTipPadding": "10",
        "showToolTipShadow": "1",
        "startingAngle": "90",
        "numberSuffix": "",
        "theme": "ocean",
        "enablesmartlabels": "0",
        "rotateValues": "0",
        "placevaluesinside": "0",
        "valueFontColor": "#000",
        "exportEnabled" : "1"
    }
  };
  losageWiseContainerData = {
    containerTitle: "Avg LOS by Age (in days)",
    renderAt: "losageWise",
    filterKey: "mrnNumber",
    xAxisName: "",
    yAxisName: "",
    type: "column2D",
    showChartType: "0",
    chartConfig: {
        "plottooltext": "$label<span>: </span>$dataValue <span>days</span>",
        "labelpadding": "10",
        "yaxisvaluespadding": "10",
        "baseFontSize": "12",
        "labelfontsize": "12",
        "animation": "1",
        "valuefontsize": "12",
        "toolTipBgColor": "#FFF",
        "toolTipColor": "#000",
        "toolTipPadding": "10",
        "showToolTipShadow": "1",
        "numberSuffix": "",
        "theme": "ocean",
        "enablesmartlabels": "0",
        "rotateValues": "0",
        "placevaluesinside": "0",
        "valueFontColor": "#000",
        "exportEnabled" : "1"
    }

  };

  losDayWiseContainerData = {
    containerTitle: "Admission Discharge LWOBS Count by Date",
    renderAt: "allCountDayWise",
    filterKey: "admitType",
    xAxisName: "",
    yAxisName: "",
    type: "scrollstackedcolumn2d",
    showChartType: "0",
    chartTypes: [
        {
            "name": "msline",
            "icon": "line.svg"
        },
        {
            "name": "scrollstackedcolumn2d",
            "icon": "column.svg"
        }
    ],
    chartConfig: {
        "plottooltext": "$seriesName<span>: </span>$dataValue <span>days</span>",
        "drawcrossline": "1",
        "anchorAlpha": "0",
        "anchorHoverAlpha": "100",
        "legenditemfontsize": "12",
        "labelpadding": "5",
        "yaxisvaluespadding": "10",
        "valuefontsize": "12",
        "baseFontSize": "12",
        "labelfontsize": "10",
        "animation": "1",
        "toolTipBgColor": "#FFF",
        "toolTipColor": "#000",
        "toolTipPadding": "10",
        "showToolTipShadow": "1",
        "numberSuffix": "",
        "theme": "ocean",
        "flatScrollBars": "1",
        "scrollheight": "10",
        "numVisiblePlot": "30",
        "showHoverEffect": "1",
        "connectNullData": "1",
        "showValues": "0",
        "placevaluesinside": "0",
        "valueFontColor": "#000",
        "exportEnabled" : "1"
    }
  };
constructor(private zone:NgZone){}

talkBack(e: string) {
    if(e==="admission"){
        this.admission=true;
        this.lwobs = false;
        this.avgadmission=false;
        this.discharge=false;
        this.activeadv = "active";
        this.activedis = "";
        this.activelwo = "";
        this.activeavg ="";
    }
    if(e==="lwobs"){
        this.admission=false;
        this.lwobs = true;
        this.avgadmission=false;
        this.discharge=false;
        this.activeadv = "";
        this.activedis = "";
        this.activelwo = "active";
        this.activeavg ="";
    }
    if(e==="avgadmission"){
        this.admission=false;
        this.lwobs = false;
        this.avgadmission=true;
        this.discharge=false;
        this.activeadv = "";
        this.activedis = "";
        this.activelwo = "";
        this.activeavg ="active";
    }
    if(e==="discharge"){
        this.admission=false;
        this.lwobs = false;
        this.avgadmission=false;
        this.discharge=true;
        this.activeadv = "";
        this.activedis = "active";
        this.activelwo = "";
        this.activeavg ="";
    }
    this.initServerReq();

}

ngOnInit() {
    this.init_daterangepicker();
    this.initServerReq();
};

init_daterangepicker() {

    if( typeof ($.fn.daterangepicker) === 'undefined'){ return; }

    let cb = (start, end) => {
        this.zone.run(() => {
        this.selectedStartDate = start.format('M/D/YY');
        this.selectedEndDate = end.format('M/D/YY');
        this.comparedWith = start.format('MMM D, YY') + ' - ' + end.format('MMM D, YY');
        this.completeDate = start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY');
        this.loader = true;
        this.initServerReq();
        });
    };
    let configStartDate;
    let configEndDate;
    if (config.startdate !== "") {
        configStartDate = config.startdate;
    }
    else {
        configStartDate = moment().subtract(29, 'days');
    }
    if (config.enddate !== "") {
        configEndDate = config.enddate;
    }
    else {
        configEndDate = moment();
    }
    var optionSet1 = {
        startDate: configStartDate,
        endDate: configEndDate,
        minDate: config.mindate,
        maxDate: config.maxdate,
        showDropdowns: false,
        showWeekNumbers: true,
        timePicker: false,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        opens: 'left',
        buttonClasses: ['btn btn-default'],
        applyClass: 'btn-small btn-primary',
        cancelClass: 'btn-small',
        format: 'MM/DD/YYYY',
        separator: ' to ',
        locale: {
            applyLabel: 'Submit',
            cancelLabel: 'Clear',
            fromLabel: 'From',
            toLabel: 'To',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            firstDay: 1,
        }
    };
    this.selectedStartDate = configStartDate;
    this.selectedEndDate = configEndDate;
    this.comparedWith = moment().subtract(29, 'days').format('MMM D, YY') + ' - ' + moment().format('MMM D, YY');
    this.completeDate = moment(configStartDate).format('MMMM D, YYYY') + ' - ' + moment(configEndDate).format('MMMM D, YYYY');
    $('#reportrange').daterangepicker(optionSet1, cb);
};

initServerReq () {
    this.getDateWiseDate();
};

async getDateWiseDate(){
    this.loaderChart = true;
    let finalFIltered = [];
    let filteredlwobsCount = [];
    let avgadmissionDays = [];
    let departmentContainerFilteredData = [];
    let departmentDischargedContainerFilteredData = [];
    let departmentLWOBSContainerFilteredData= [];
    let ageContainerFilteredData = [];
    let ageLwobsContainerFilteredData =[];
    let ageDischargedContainerFilteredData= [];
    let filteredDischaredData = [];
    let uniqueArray = [];
    let filteredKeyElemnts = [];
    let filteredLwobsData = [];
    let uniquelwobsArray = [];
    let uniqueDischargeArray =[];
    let finalDischargedFIltered =[];
    let result;

    result = await axios.get(config.apiurl, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      params: {
        startDate: this.selectedStartDate,
        endDate: this.selectedEndDate,
      }
    });
    result = result.data;
    result.forEach(function (element) {

      let episodeStartDatetime = element.episodeStartDatetime;
      let episodeStartDatetimeArray = episodeStartDatetime.split(" ");
      avgadmissionDays[element["mrnNumber"] + "-" + element.episodeStartDatetime.split(" ")[0]] = element.hospitalLOSBedDays * 1;
      if(element.encounterStatus === "Discharged"){
        finalDischargedFIltered.push(element);
        if (!filteredDischaredData.includes(element["admitType"])) {
        filteredDischaredData.push(element["admitType"]);
        }
        departmentDischargedContainerFilteredData[element["mrnNumber"] + "-" + element.episodeStartDatetime.split(" ")[0]] = element;
        ageDischargedContainerFilteredData[element["mrnNumber"] + "-" + element.episodeStartDatetime.split(" ")[0]] = element;
        if (!uniqueDischargeArray.hasOwnProperty(episodeStartDatetimeArray[0])) {
            uniqueDischargeArray[episodeStartDatetimeArray[0]] = JSON.parse("{ \"" + element["admitType"] + "\" : 1  }");
        }
        else {
            let admitType = element["admitType"];
            if (uniqueDischargeArray[episodeStartDatetimeArray[0]][admitType]) {
                uniqueDischargeArray[episodeStartDatetimeArray[0]][admitType] += 1;
            }
            else {
                uniqueDischargeArray[episodeStartDatetimeArray[0]][admitType] = 1;
            }
        }
      }

      //if((element.encounterStatus !== "Discharged")){
        finalFIltered.push(element);
        if (!filteredKeyElemnts.includes(element["admitType"])) {
         filteredKeyElemnts.push(element["admitType"]);
        }
        departmentContainerFilteredData[element["mrnNumber"] + "-" + element.episodeStartDatetime.split(" ")[0]] = element;
        ageContainerFilteredData[element["mrnNumber"] + "-" + element.episodeStartDatetime.split(" ")[0]] = element;
        if (!uniqueArray.hasOwnProperty(episodeStartDatetimeArray[0])) {
          uniqueArray[episodeStartDatetimeArray[0]] = JSON.parse("{ \"" + element["admitType"] + "\" : 1  }");
        }
        else {
            var admitType = element["admitType"];
            if (uniqueArray[episodeStartDatetimeArray[0]][admitType]) {
                uniqueArray[episodeStartDatetimeArray[0]][admitType] += 1;
            }
            else {
                uniqueArray[episodeStartDatetimeArray[0]][admitType] = 1;
            }
        }
      //}

      if(element.encounterStatus === "LWOBS"){
        if (!filteredLwobsData.includes(element["admitType"])) {
            filteredLwobsData.push(element["admitType"]);
        }
        departmentLWOBSContainerFilteredData[element["mrnNumber"] + "-" + element.episodeStartDatetime.split(" ")[0]] = element;
        ageLwobsContainerFilteredData[element["mrnNumber"] + "-" + element.episodeStartDatetime.split(" ")[0]] = element;
        filteredlwobsCount.push(element["mrnNumber"] + "-" + element.episodeStartDatetime.split(" ")[0]);
        if (!uniquelwobsArray.hasOwnProperty(episodeStartDatetimeArray[0])) {
            uniquelwobsArray[episodeStartDatetimeArray[0]] = JSON.parse("{ \"" + element["admitType"] + "\" : 1  }");
        }
        else {
            var admitType = element["admitType"];
            if (uniquelwobsArray[episodeStartDatetimeArray[0]][admitType]) {
                uniquelwobsArray[episodeStartDatetimeArray[0]][admitType] += 1;
            }
            else {
                uniquelwobsArray[episodeStartDatetimeArray[0]][admitType] = 1;
            }
        }
      }

      });
      this.fullResult = result;
      this.filteredtotalAdmissionData = finalFIltered;
      this.filteredlwobsCountData = filteredlwobsCount;
      this.avgadmissionDaysData = avgadmissionDays;
      this.sameDayDischargeData = finalDischargedFIltered;
      this.departmentFilteredData = departmentContainerFilteredData;
      this.departmentLWOBSData = departmentLWOBSContainerFilteredData;
      this.departmentDischargeddData = departmentDischargedContainerFilteredData;
      this.ageWiseFilteredData = ageContainerFilteredData;
      this.dailyFilteredData = uniqueArray;
      this.filteredKeyElemntsData = filteredKeyElemnts;
      this.dailylwobsFilteredData = uniquelwobsArray;
      this.dailyldischrgedFilteredData = uniqueDischargeArray;
      this.ageLwobsData = ageLwobsContainerFilteredData;
      this.ageDischargedData = ageDischargedContainerFilteredData;
      this.loader = false;
      this.loaderChart = false;
      return result;
    };
};

