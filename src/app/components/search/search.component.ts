import { Component, OnInit } from '@angular/core';
import { TimeLineComponent } from '../timeline/timeline.component';
import { MonthPeriod, TimeLineSvc } from '../timeline/timeline.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor() {
  }

  currentSearch(term: string, years: MonthPeriod[]): void {

    console.log('Búsqueda ' + term + 'Años: ' + years);
  }

  ngOnInit(): void {
  }

}
