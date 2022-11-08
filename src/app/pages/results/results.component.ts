import { Component, OnInit } from '@angular/core';
import { TemasService } from 'src/app/components/temas/temas.service';

export interface Result {
  category: String;
  title: String;
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})


export class ResultsComponent implements OnInit {

  constructor(public temasSvc: TemasService) { }

  active: boolean = false;
  toggleSidebar(): void {
    this.active = !this.active;
  }
  temas: any = [];

  filterResult = '';
  results: Result[] = [
    {
      category: 'Industria',
      title: 'Zlorem ipsum dolor sit'
    },
    {
      category: 'Industria',
      title: 'Blorem ipsum dolor sit'
    },
    {
      category: 'Industria',
      title: 'Hlorem ipsum dolor sit'
    },
    {
      category: 'Industria',
      title: 'Jorem ipsum dolor sit'
    },
    {
      category: 'Industria',
      title: 'Alorem ipsum dolor sit'
    }
  ];




  ngOnInit(): void {
    this.temasSvc.getTemas().subscribe(data => {

      const temasProv = data.results.bindings;

      for (let i = 0; i < temasProv.length; i++) {
        let tema = temasProv[i].tema.value;
        this.temas.push(tema);
      }
    });
  }

  sortResults(results: Result[]): Result[] {
    results.sort(function (a, b) {
      if (a.title > b.title)
        return 1;
      if (a.title < b.title)
        return -1;
      else
        return 0;
    });
    return results;
  }


}
