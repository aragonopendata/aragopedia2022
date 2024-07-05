import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectLocationComponent } from '../select-location/select-location.component';
import { TemasComponent } from '../temas/temas.component';
import { YearsPeriod, TimeLineSvc } from '../timeline/timeline.service';
import { TimeLineComponent } from '../timeline/timeline.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private timelineSvc: TimeLineSvc, private router: Router) {
  }

  @ViewChild(SelectLocationComponent) location: any;
  @ViewChild(TemasComponent) temas: any;
  @ViewChild(TimeLineComponent) years: any;
  @ViewChild(TimeLineComponent) yearsSelectedURL: any;

  // selectedYears: any[] = [];
  firstYearSelected: any;
  lastYearSelected: any;
  currentYear: string = (new Date().getFullYear()).toString();
  selectedYears: any = ['1978', this.currentYear];
  yearsURL: string = ``;
  provinciaSelected!: string;
  municipioSelected!: string;
  comarcaSelected!: string;
  temasSelected!: string[];
  error: boolean = false;

  ngOnInit(): void {
  }

  submit(): void {
    this.temasSelected = this.temas.temasSeleccionados;
    this.selectedYears = this.years.yearsSelected;
    this.yearsURL = this.yearsSelectedURL.yearsURL;

    if ((this.temasSelected.length > 0 && this.temasSelected.length < 6) && Number(this.selectedYears[1]) - Number(this.selectedYears[0]) >= 2) {
      this.router.navigate([`results/${this.temasSelected}/${this.yearsURL}`]);
    } else {
      this.error = true;
    }
  }

}
