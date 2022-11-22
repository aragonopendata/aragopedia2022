import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectLocationComponent } from '../select-location/select-location.component';
import { TemasComponent } from '../temas/temas.component';
import { YearsPeriod, TimeLineSvc } from '../timeline/timeline.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild(SelectLocationComponent) location: any;
  @ViewChild(TemasComponent) temas: any;

  years!: YearsPeriod[];
  firstYearSelected: any;
  lastYearSelected: any;
  provinciaSelected!: string;
  municipioSelected!: string;
  comarcaSelected!: string;
  temasSelected!: string[];

  constructor(private timelineSvc: TimeLineSvc, private router: Router) { }


  ngOnInit(): void {

  }

  search(): void {
    // this.years = this.timelineSvc.getCurrentYears();
    // this.firstYearSelected = this.years[0];
    // this.lastYearSelected = this.years[1];
    // this.provinciaSelected = this.location.provincia.selected;
    // this.municipioSelected = this.location.municipio.selected;
    // this.comarcaSelected = this.location.comarca.selected;
    this.temasSelected = this.temas.temasSeleccionados;

    this.router.navigate([`results/${this.temasSelected}`]);

    console.log(this.years, this.provinciaSelected, this.municipioSelected, this.comarcaSelected, this.temasSelected);


  }

}
