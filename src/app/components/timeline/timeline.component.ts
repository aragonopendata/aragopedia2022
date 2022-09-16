import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxRangeSelectorModule } from 'devextreme-angular';
import { SearchService } from '../search/services/search.service';

import { TimeLineSvc, MonthPeriod } from './timeline.service';


@Component({
  selector: 'app-timeline',
  providers: [TimeLineSvc],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimeLineComponent {
  dataSource: MonthPeriod[];

  constructor(private timeLineSvc: TimeLineSvc) {
    this.dataSource = timeLineSvc.getPeriods();
    //timeLineSvc.currentYears = this.currentYears;
  }

  getData(value: MonthPeriod[]): void {
    console.log(this.timeLineSvc.getCurrentYears());
    this.timeLineSvc.setCurrentYears(value);
  }

}

@NgModule({
  imports: [
    BrowserModule,
    DxRangeSelectorModule,
  ],
  exports: [TimeLineComponent],
  declarations: [TimeLineComponent],
  bootstrap: [TimeLineComponent],
})
export class TimeLineModule { }

platformBrowserDynamic().bootstrapModule(TimeLineModule);
