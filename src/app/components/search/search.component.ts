import { Component, OnInit } from '@angular/core';
import { TimeLineComponent } from '../timeline/timeline.component';
import { MonthPeriod, TimeLineSvc } from '../timeline/timeline.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  currentYears: MonthPeriod[] = [];

  constructor(private timelineSvc: TimeLineSvc) {
    this.currentYears = timelineSvc.getCurrentYears();
  };
  ngOnInit() {
    this.timelineSvc.getCurrentYears();
  };
  currentSearch(): void {
    var term = "test";
    console.log('Búsqueda ' + term + 'Años: ' + this.timelineSvc.getCurrentYears());
  }

  myHello(): void {
    console.log("myhello")
  }
}
