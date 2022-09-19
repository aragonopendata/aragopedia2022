import { Component, OnInit } from '@angular/core';
import { MonthPeriod, TimeLineSvc } from '../timeline/timeline.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  currentYears: MonthPeriod[] = [];

  textoBusqueda = new FormControl('');

  public formGroup!: FormGroup;

  constructor(private timelineSvc: TimeLineSvc, private formBuilder: FormBuilder) {
    this.currentYears = timelineSvc.getCurrentYears();
  };

  ngOnInit() {
    this.timelineSvc.getCurrentYears();
    this.buildForm;
  };

  private buildForm() {
    const years = this.timelineSvc.getCurrentYears();
    const dateLength = years[0] - years[1];
    const text = this.textoBusqueda;
    this.formGroup = this.formBuilder.group({
      years: years,
      dateLength: dateLength,
      text: text,
    });
    console.log(this.formGroup);

  }

  currentSearch(term: string): string {
    console.log('Búsqueda ' + term + ' Años: ' + this.timelineSvc.getCurrentYears());
    return term;
  }
}
