import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  active: boolean = false;
  toggleSidebar(): void {
    this.active = !this.active;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
