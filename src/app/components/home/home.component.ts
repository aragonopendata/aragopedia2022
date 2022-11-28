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
  selectedYears: any = ['2010', '2022'];
  yearsURL: string = ``;
  provinciaSelected!: string;
  municipioSelected!: string;
  comarcaSelected!: string;
  temasSelected!: string[];

  ngOnInit(): void {
  }

  search(): void {
    this.selectedYears = this.years.yearsSelected;
    this.yearsURL = this.yearsSelectedURL.yearsURL;
    // this.provinciaSelected = this.location.provincia.selected;
    // this.municipioSelected = this.location.municipio.selected;
    // this.comarcaSelected = this.location.comarca.selected;
    this.temasSelected = this.temas.temasSeleccionados;

    // this.router.navigate([`results/${this.temasSelected}`]);
    this.router.navigate([`results/${this.temasSelected}/${this.yearsURL}`]);


  }

  submit(): void {
    this.temasSelected = this.temas.temasSeleccionados;
    this.selectedYears = this.years.yearsSelected;
    this.yearsURL = this.yearsSelectedURL.yearsURL;
    this.router.navigate([`results/${this.temasSelected}/${this.yearsURL}`]);
  }

}
