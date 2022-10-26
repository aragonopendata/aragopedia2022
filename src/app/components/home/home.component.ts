import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SelectLocationComponent } from '../select-location/select-location.component';
import { MonthPeriod, TimeLineSvc } from '../timeline/timeline.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild(SelectLocationComponent) location: any;

  years!: MonthPeriod[];
  provinciaSelected!: string;
  municipioSelected!: string;
  comarcaSelected!: string;
  temas!: string[];

  constructor(private timelineSvc: TimeLineSvc) { }

  ngOnInit(): void {
  }

  search(): void {
    this.years = this.timelineSvc.getCurrentYears();
    this.provinciaSelected = this.location.provincia.selected;
    this.municipioSelected = this.location.municipio.selected;
    this.comarcaSelected = this.location.comarca.selected;
    this.temas = ['Tema 1', 'Tema 2'];

    console.log(this.years, this.provinciaSelected, this.municipioSelected, this.comarcaSelected, this.temas);


  }

}
