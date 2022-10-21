import { Component, OnInit } from '@angular/core';
import { MonthPeriod, TimeLineSvc } from '../timeline/timeline.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  years!: MonthPeriod[];
  provincia!: string;
  municipio!: string;
  comarca!: string;
  temas!: string[];

  constructor(private timelineSvc: TimeLineSvc) { }

  ngOnInit(): void {
  }

  search(): void {
    this.years = this.timelineSvc.getCurrentYears();
    this.provincia;
    this.municipio;
    this.comarca;
    this.temas;

  }

}
