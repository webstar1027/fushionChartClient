import { Component, OnInit, Input } from '@angular/core';
import config from '../../../../config.json';

@Component({
  selector: 'app-individual-chart-data',
  templateUrl: './individual-chart-data.component.html',
  styleUrls: ['./individual-chart-data.component.css']
})
export class IndividualChartDataComponent implements OnInit {
  public dataSource = {};
  public type = "doughnut2d";
  public show = false;
  public chart;
  public dynamicliItems;
  public hasData;

  @Input() containerData : object;
  @Input() data ;
  @Input() filteredData;
  @Input() uniqueKeys;
  @Input() loaderChart;


  constructor() { }

  ngOnInit() {
  }

  initialized($event){
    this.chart = $event.chart;
  }

  onClick(newValue) {
    this.chart.chartType(newValue[0]);
  }

  ngOnChanges(changes: any) {

    if(this.containerData["showChartType"] === "1"){
      this.show = true;
      this.dynamicliItems = this.containerData["chartTypes"];
    }
    this.getIndividualChartData();


  }

  getIndividualChartData(){
    this.hasData = this.loaderChart;
    if(!this.filteredData) {
      return false;
    }
    this.hasData = this.loaderChart;
    let conatainerType = this.containerData['renderAt'];
    let chartData= '';


    const filterKey = this.containerData['filterKey'];

    if((conatainerType === "departmentData") || (conatainerType === "cohortData") || (conatainerType === "clinicData" ) || (conatainerType === "departmentDatalwo")){
      let filteredKeyElemnts= [];
      for(let key in this.filteredData){
        let individualDataSet = this.filteredData[key];
        if(individualDataSet[filterKey] === ""){
          individualDataSet[filterKey] = "NA"
        }
        if(!filteredKeyElemnts.hasOwnProperty(individualDataSet[filterKey])){
          filteredKeyElemnts[individualDataSet[filterKey]] = 1;
        }else{
          filteredKeyElemnts[individualDataSet[filterKey]] += 1;
        }
      }
      let eachJsonElm = '';
      for(let key in filteredKeyElemnts){
        let plotColor = "#ea9949";
        if(conatainerType === "cohortData"){
          plotColor = config.colorPallet["Cohort"];
        }
        if(conatainerType === "clinicData"){
          plotColor = config.colorPallet["Clinic"];
        }
        if((conatainerType === "departmentData") && config.colorPallet[key]){
          plotColor = config.colorPallet[key];
        }
        eachJsonElm = eachJsonElm.concat(`{
          "label": "${key}",
          "value": "${filteredKeyElemnts[key]}",
          "color": "${plotColor}"
        }`,",");
      }
      chartData = eachJsonElm.slice(0,-1);

      this.createDataSourceAndRenderChart(chartData);
    }

    if(conatainerType === "admissionDayWise"){
      let getdataSetStructure = this.getdataSetStructure(this.uniqueKeys);
      let eachLabelElm = '';


      for(let key in this.filteredData){
        eachLabelElm = eachLabelElm.concat(`{
          "label": "${key}"
        }`,",");
        this.uniqueKeys.forEach(eachKey=>{
          let eachdataValueJson = this.filteredData[key][eachKey];
          getdataSetStructure.forEach((eachDataSetElement,index)=>{
            if(eachDataSetElement.seriesname === eachKey){
              if(eachdataValueJson){
                eachDataSetElement["data"].push(JSON.parse(`{ "value" : "${eachdataValueJson}" } `));
              }else{
                eachDataSetElement["data"].push(JSON.parse(`{ "value" : "0" ,"showvalue" : "0" } `));
              }
            }
          })
        })
      };
      this.createDataSourceDateWiseAndRenderChart(eachLabelElm,getdataSetStructure);
    }

    if(conatainerType === "ageWise"){
      let eachJsonElm = '';

      for(let each in config.ageGroups){
        let count = 0;
        for(let key in this.filteredData){
          if((this.filteredData[key]["age"] >= config.ageGroups[each]["min"])&&(this.filteredData[key]["age"] <= config.ageGroups[each]["max"])){
            count = count + 1;
          }
        }
        eachJsonElm = eachJsonElm.concat(`{
          "label": "${each}",
          "value": "${count}",
          "color":"#ea9949"
        }`,",");
      }
      chartData = eachJsonElm.slice(0,-1);
      this.createDataSourceAndRenderChart(chartData);
    }

    if((conatainerType === "lwobsDatabyReason")){

      let eachJsonElm = '';
      for(let each in config.reasons){
        let count = 0;
        for(let key in this.filteredData){
          let individualDataSet = this.filteredData[key];
            if(individualDataSet.encounterStatus === "LWOBS"){
              if(each === individualDataSet.lwobsReason){
                count = count +1;
              }
          }
        }

        eachJsonElm = eachJsonElm.concat(`{
          "label": "${config.reasons[each]}",
          "value": "${count}",
          "color" : "#ea9949"
        }`,",");
      }
      chartData = eachJsonElm.slice(0,-1);

      this.createDataSourceAndRenderChart(chartData);
    }

    if(conatainerType === "losData"){
      let filteredKeyElemnts = [];
      let eachLabelElm= '';
        this.filteredData.forEach(element=>{
          if(!filteredKeyElemnts.hasOwnProperty(element[filterKey])){
            filteredKeyElemnts[element[filterKey]] = JSON.parse(`{ "count" : 1 ,"value" : ${element.hospitalLOSBedDays * 1 } }`);
          }else{
            filteredKeyElemnts[element[filterKey]].count += 1;
            filteredKeyElemnts[element[filterKey]].value += element.hospitalLOSBedDays*1;
          }
        });
        for(let eachelm in filteredKeyElemnts){
          let plotColor='';
          if(config.colorPallet[eachelm]){
            plotColor = config.colorPallet[eachelm];
          }
          eachLabelElm = eachLabelElm.concat(`{
            "label": "${eachelm}",
            "value": "${(filteredKeyElemnts[eachelm].value / filteredKeyElemnts[eachelm].count).toFixed(2) }",
            "color": "${plotColor}"
          }`,",");
        }
        chartData = eachLabelElm.slice(0,-1);
       this.createDataSourceAndRenderChart(chartData);
    }
    if(conatainerType === "losDatatop10"){
      let filteredKeyElemnts = [];
      let eachLabelElm= '';
      let filteredjson =[];
        this.filteredData.forEach(element=>{
          filteredjson.push(JSON.parse(`{ "mrn" : "${element.mrnNumber}" , "value" : "${element.hospitalLOSBedDays*1}" }`)) ;
        });
       const filterdedvaluewise = filteredjson.sort((a,b)=>{
         return b.value - a.value;
       });

       const slicedArray = filterdedvaluewise.slice(0,10);
       for(let eachelm in slicedArray){
         eachLabelElm = eachLabelElm.concat(`{
            "label": "${slicedArray[eachelm].mrn}",
            "value": "${slicedArray[eachelm].value }",
            "color":"#ea9949"
          }`,",");
        }
        chartData = eachLabelElm.slice(0,-1);
       this.createDataSourceAndRenderChart(chartData);
    }
    if(conatainerType === "losDatachort"){
      let filteredKeyElemnts = [];
      let eachLabelElm= '';
        this.filteredData.forEach(element=>{
          if(!filteredKeyElemnts.hasOwnProperty(element[filterKey])){
            filteredKeyElemnts[element[filterKey]] = JSON.parse(`{ "count" : 1 ,"value" : ${element.hospitalLOSBedDays * 1 } }`);
          }else{
            filteredKeyElemnts[element[filterKey]].count += 1;
            filteredKeyElemnts[element[filterKey]].value += element.hospitalLOSBedDays*1;
          }
        });
        for(let eachelm in filteredKeyElemnts){
          let plotColor='';
          plotColor = config.colorPallet["Cohort"];

          eachLabelElm = eachLabelElm.concat(`{
            "label": "${eachelm}",
            "value": "${(filteredKeyElemnts[eachelm].value / filteredKeyElemnts[eachelm].count).toFixed(2) }",
            "color": "${plotColor}"
          }`,",");
        }
        chartData = eachLabelElm.slice(0,-1);
       this.createDataSourceAndRenderChart(chartData);
    }
    if(conatainerType === "losDataclinic"){
      let filteredKeyElemnts = [];
      let eachLabelElm= '';
        this.filteredData.forEach(element=>{
          if(!filteredKeyElemnts.hasOwnProperty(element[filterKey])){
            filteredKeyElemnts[element[filterKey]] = JSON.parse(`{ "count" : 1 ,"value" : ${element.hospitalLOSBedDays * 1 } }`);
          }else{
            filteredKeyElemnts[element[filterKey]].count += 1;
            filteredKeyElemnts[element[filterKey]].value += element.hospitalLOSBedDays*1;
          }
        });
        for(let eachelm in filteredKeyElemnts){
          let value = filteredKeyElemnts[eachelm];
          if(eachelm === ""){
            eachelm = "NA"
          }
          let plotColor='';
          plotColor = config.colorPallet["Clinic"];

          eachLabelElm = eachLabelElm.concat(`{
            "label": "${eachelm}",
            "value": "${(value.value / value.count).toFixed(2) }",
            "color": "${plotColor}"
          }`,",");
        }
        chartData = eachLabelElm.slice(0,-1);
       this.createDataSourceAndRenderChart(chartData);
    }

    if(conatainerType === "allCountDayWise"){
      let eachLabelElm = '';
      let uniqueDischargeArray= [];
      for(let key in this.filteredData){
       let typeName;
       let episodeStartDatetime = this.filteredData[key].episodeStartDatetime;
       let episodeStartDatetimeArray = episodeStartDatetime.split(" ");
       if(this.filteredData[key].encounterStatus === "Discharged"){
         typeName = "Discharged";
       }
       if((this.filteredData[key].encounterStatus !== "Cancelled") && (this.filteredData[key].encounterStatus !== "Discharged")){
         typeName = "Admission";
       }
       if(this.filteredData[key].encounterStatus === "Cancelled"){
         typeName = "LWOBS";
       }
       if (!uniqueDischargeArray.hasOwnProperty(episodeStartDatetimeArray[0])) {

            uniqueDischargeArray[episodeStartDatetimeArray[0]] = JSON.parse("{ \"" + typeName + "\" : 1  }");
        }
        else {
            if (uniqueDischargeArray[episodeStartDatetimeArray[0]][typeName]) {
                uniqueDischargeArray[episodeStartDatetimeArray[0]][typeName] += 1;
            }
            else {
                uniqueDischargeArray[episodeStartDatetimeArray[0]][typeName] = 1;
            }
        }
      };
      const uniqueKeys = ["Admission", "Discharged", "LWOBS"];
      let getdataSetStructure = this.getdataSetStructure(uniqueKeys);


      for(let key in uniqueDischargeArray){
        eachLabelElm = eachLabelElm.concat(`{
          "label": "${key}"
        }`,",");
        uniqueKeys.forEach(eachKey => {
          let eachdataValueJson = uniqueDischargeArray[key][eachKey];
           getdataSetStructure.forEach((eachDataSetElement,index)=>{
            if(eachDataSetElement.seriesname === eachKey){
              if(eachdataValueJson){
                eachDataSetElement["data"].push(JSON.parse(`{ "value" : "${eachdataValueJson}" } `));
              }else{
                eachDataSetElement["data"].push(JSON.parse(`{ "value" : "0" ,"showvalue" : "0" } `));
              }
            }
          });
        });
      };
      this.createDataSourceDateWiseAndRenderChart(eachLabelElm,getdataSetStructure);
    }

    if(conatainerType === "losageWise"){
      let eachJsonElm = '';

      for(let each in config.ageGroups){
        let count = 0;
        let avgDays = 0;
        let avg = 0;
        for(let key in this.filteredData){
          if((this.filteredData[key]["age"] >= config.ageGroups[each]["min"])&&(this.filteredData[key]["age"] <= config.ageGroups[each]["max"])){
            avgDays +=  this.filteredData[key]["hospitalLOSBedDays"] * 1;
            count = count + 1;
          }
        }
        avg = parseFloat((avgDays/count).toFixed(2));
        eachJsonElm = eachJsonElm.concat(`{
          "label": "${each}",
          "value": "${avg}",
          "color":"#ea9949"
        }`,",");
      }
      chartData = eachJsonElm.slice(0,-1);
      this.createDataSourceAndRenderChart(chartData);
    }
  }

  getUniqueTypesOFdataFilterWise(filterKey){
    let filteredKeyElemnts = [];
    for(let key in this.data){
      let individualDataSet = this.data[key];
      if(!filteredKeyElemnts.includes(individualDataSet[filterKey])){
        filteredKeyElemnts.push(individualDataSet[filterKey]);
      }
    }
    return filteredKeyElemnts;
  }

  getdataSetStructure(filteredKeyElemnts){
    let dataSet = [];
    let data = [];
    filteredKeyElemnts.forEach(each=>{
      let plotColor = "#ea9949";
      if( config.colorPallet[each]){
        plotColor = config.colorPallet[each];
      }
      dataSet.push(JSON.parse(`{ "seriesname" : "${each}" ,"color" : "${plotColor}", "data" : [] }`));
    });
    return dataSet;
  }

  createDataSourceDateWiseAndRenderChart(eachLabelElm,getdataSetStructure){
    const label = `[ ${eachLabelElm.slice(0,-1)} ]`;
    if(this.chart){
      this.chart.setJSONData({
        "chart": {
          "xAxisName": this.containerData['xAxisName'],
          "yAxisName": this.containerData['yAxisName'],
          ...this.containerData["chartConfig"]
      },
      "categories": [
        {
          "category": JSON.parse(label)
        }
      ],
      "dataset": getdataSetStructure
      });
      this.chart.chartType(this.containerData['type']);
    }
  }

  createDataSourceAndRenderChart(chartData){
    const dataElement = `[ ${chartData} ]`;
    const sortedDataElement = JSON.parse(dataElement).sort((a,b)=>{
      if(this.containerData["type"] === "pie2d" || this.containerData["type"] === "doughnut2d"){
        return a.value - b.value;
      }else{
        return b.value - a.value;
      }
    });
    const defaultcenterlabelvalue = JSON.parse(dataElement).reduce((acc,elem)=>{
      let elmvalue = elem.value * 1 ;
      acc = acc + elmvalue;
      return acc;
    }, 0);
    if(this.chart){
      this.chart.setJSONData({
        chart: {
            "xAxisName": this.containerData['xAxisName'],
            "yAxisName": this.containerData['yAxisName'],
            "defaultcenterlabel" : defaultcenterlabelvalue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            ...this.containerData["chartConfig"]
        },
        "data": sortedDataElement
        });
      this.chart.chartType(this.containerData['type']);
    }
  }

}
