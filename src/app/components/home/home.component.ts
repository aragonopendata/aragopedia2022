import { Component, Input, ViewChild } from '@angular/core';
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
export class HomeComponent  {
  constructor(private timelineSvc: TimeLineSvc, private router: Router) {
  }

  @ViewChild(SelectLocationComponent) location: any;
  @ViewChild(TemasComponent) temas: any;

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

  submit(): void {
    this.temasSelected = this.temas.temasSeleccionados;
  
    if (this.temasSelected.length &&
        this.temasSelected.length < 6 &&
        Number(this.selectedYears[1]) - Number(this.selectedYears[0]) >= 2) {
  
      const years = `${this.selectedYears[0]}-${this.selectedYears[1]}`;   // 👈
      this.router.navigate([`results/${this.temasSelected}/${years}`]);
    } else {
      this.error = true;
    }
  }

}
