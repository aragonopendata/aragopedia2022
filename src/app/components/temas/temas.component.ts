import { Component, OnInit } from '@angular/core';
import { TemasService } from './temas.service';

@Component({
  selector: 'app-temas',
  templateUrl: './temas.component.html',
  styleUrls: ['./temas.component.scss']
})
export class TemasComponent implements OnInit {

  constructor(public temasSvc: TemasService) { }

  temas!: object[];

  ngOnInit(): void {
    this.temasSvc.getTemas().subscribe(data => {
      this.temas = data.results.bindings;
      console.log(this.temas)
    });

    this.mappedTemas(this.temas);

  }

  mappedTemas(temas: object[]): void {
    temas.map(val => {
      console.log(val)
    })
  }
}
