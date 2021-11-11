import { Component, OnInit, Input } from '@angular/core';
import config from '../../../../config.json';


@Component({
  selector: 'app-individual-chart-data-filter',
  templateUrl: './individual-chart-data-filter.component.html',
  styleUrls: ['./individual-chart-data-filter.component.css']
})
export class IndividualChartDataFilterComponent implements OnInit {
  public dataSource ;
  public type;
  public filter = "admitType";
  public hasData = true;
  public chart;
  @Input() containerData : object;
  @Input() data ;
  @Input() chartConfig : object;
  @Input() filteredData;


  constructor() { }

  ngOnInit() {
  }

  initialized($event){
    this.chart = $event.chart;
  }

  ngOnChanges(changes: any) {
    this.getIndividualChartData();
  }

  getIndividualChartData(){
    if(!this.filteredData) return false;
    this.hasData = false;
    let filteredKeyElemnts = [];
    let conatainerType = this.containerData['renderAt'];
    let chartData= '';

    this.type = this.containerData['type'];
    const filterKey = this.filter;
    if(conatainerType === "lwobsData"){

      for(let key in this.filteredData){
        let individualDataSet = this.filteredData[key];
        if(individualDataSet.encounterStatus === "Cancelled"){
          if(individualDataSet[filterKey] === ""){
            individualDataSet[filterKey] = "NA"
          }
          if(!filteredKeyElemnts.hasOwnProperty(individualDataSet[filterKey])){
            filteredKeyElemnts[individualDataSet[filterKey]] = 1;
          }else{
            filteredKeyElemnts[individualDataSet[filterKey]] += 1;
          }
        }
      }
      let eachJsonElm = '';
      let plotColor = "#04476C";
      for(let key in filteredKeyElemnts){
        if(this.filter === "cohort"){
          plotColor = config.colorPallet["Cohort"];
        }
        if(this.filter === "clinicalUnit"){
          plotColor = config.colorPallet["Clinic"];
        }
        if( this.filter === "admitType" && config.colorPallet[key]){
          plotColor = config.colorPallet[key];
        }
        eachJsonElm = eachJsonElm.concat(`{
          "label": "${key}",
          "value": "${filteredKeyElemnts[key]}",
          "color" : "${plotColor}"
        }`,",");
      }
      chartData = eachJsonElm.slice(0,-1);

    }
    this.createDataSource(chartData);
  }

  createDataSource(chartData){
    const dataElement = `[ ${chartData} ]`;
    const sortedDataElement = JSON.parse(dataElement);
    this.chart.setJSONData({
      chart: {
        "xAxisName": this.containerData['xAxisName'],
        "yAxisName": this.containerData['yAxisName'],
        ...this.containerData["chartConfig"]
      },
      "data": sortedDataElement
    });
    this.chart.chartType(this.containerData['type']);
    // this.dataSource =  {

    // };
  }

  onChange(newValue) {
    this.filter= newValue;
    this.getIndividualChartData();
  }
}
