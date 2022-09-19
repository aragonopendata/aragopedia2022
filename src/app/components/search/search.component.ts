import { Component, OnInit } from '@angular/core';
import { MonthPeriod, TimeLineSvc } from '../timeline/timeline.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  currentYears: MonthPeriod[] = [];

  textoBusqueda = new FormControl('');

  constructor(private timelineSvc: TimeLineSvc) {
    this.currentYears = timelineSvc.getCurrentYears();
  };

  ngOnInit() {
    this.timelineSvc.getCurrentYears();
  };

  currentSearch(term: string): void {
    console.log('Búsqueda ' + term + ' Años: ' + this.timelineSvc.getCurrentYears());
  }

  myHello(): void {
    console.log("myhello")
  }

}
