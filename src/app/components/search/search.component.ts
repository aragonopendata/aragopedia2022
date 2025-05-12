import { Component } from '@angular/core';
import { YearsPeriod, TimeLineSvc } from '../timeline/timeline.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  currentYears: YearsPeriod[];
  formGroup;


  constructor(
    private formBuilder: FormBuilder,
    private timelineSvc: TimeLineSvc
  ) {
    this.currentYears = this.timelineSvc.getCurrentYears();
    this.currentSearch('');
    this.formGroup = this.formBuilder.group({
      text: this.currentSearch(''),
      years: this.currentYears,
    })
  };

  onSubmit(searchData: any) {
    // Process checkout data here
    this.currentSearch('');
    
    searchData.years = this.timelineSvc.getCurrentYears();
    this.formGroup.reset();
    console.warn('Búsqueda completa: ', searchData);
  }

  currentSearch(term: string): string {
    return term;
  }
}
