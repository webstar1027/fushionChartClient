import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
 } from '@angular/core';

 @Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
 })

 export class StatsComponent implements OnInit {
  public count;
  public extension;
  public hasData;


  @Input() statConfig: object;
  @Input() filteredData;
  @Input() loader;
  @Input() class;
  @Input() id;
  @Output() talk: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit() {}

  ngOnChanges(changes: any) {
   this.getCount();
  }

  talkBack(say: string) {
    this.talk.emit(say);
  }


  getCount() {
    this.hasData = this.loader;
    if (!this.filteredData)
        return false;
    this.hasData = this.loader;
    var statType = this.statConfig['statType'];
    if ((statType === "totalAdmission") || (statType === "lwobsCount")) {
        this.count = (this.filteredData.length).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    if (statType === "avgadmissiondays") {
        var days = 0;
        var count = 0;
        for (var element in this.filteredData) {
            count = count + 1;
            days += this.filteredData[element];
        }
        var avg = ((days / count) + 2).toFixed(2);
        this.count = avg;
    }
    if (statType === "sameDayDischarge") {
        this.count = (this.filteredData.length).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }

 }
