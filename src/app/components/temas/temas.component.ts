import { Component, OnInit } from '@angular/core';
import { TemasService } from './temas.service';

@Component({
  selector: 'app-temas',
  templateUrl: './temas.component.html',
  styleUrls: ['./temas.component.scss']
})
export class TemasComponent implements OnInit {

  constructor(public temasSvc: TemasService) { }

  temas: any = [];

  ngOnInit(): void {
    this.temasSvc.getTemas().subscribe(data => {

      const temasProv = data.results.bindings;

      for (let i = 0; i < temasProv.length; i++) {
        let tema = temasProv[i].tema.value;
        this.temas.push(tema);
      }
    });
  }
}
