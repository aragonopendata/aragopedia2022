import { Component, OnInit } from '@angular/core';
import { TemasService } from 'src/app/components/temas/temas.service';
import { TimeLineSvc } from 'src/app/components/timeline/timeline.service';

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

  constructor(public temasSvc: TemasService, public timelineSvc: TimeLineSvc) { }


  queryUrlResultTemas: string = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+%3Fs+%3Ftipo+where%0D%0A%7B%0D%0A%7B%0D%0Aselect+distinct+%3Fs+%3Ftipo+%7B%0D%0A%3Fs+%3FpTema+%3Chttp%3A%2F%2Fdatos.gob.es%2Fkos%2Fsector-publico%2Fsector%2Fcultura-ocio%3E.%0D%0A%3Fs+a+%3Ftipo.%0D%0A%3Ftema+skos%3AprefLabel+%3FlabelTema.%0D%0A%0D%0A+VALUES+%3FpTema+%7B+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23classification%3E+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%3E+%7D.%0D%0A%0D%0AVALUES+%3Ftipo+%7B+%0D%0A%3Chttp%3A%2F%2Fschema.org%2FCreativeWork%3E%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23Dataset%3E%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23Organization%3E%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23Location%3E%0D%0A%3Chttp%3A%2F%2Fschema.org%2FEvent%3E%0D%0A%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23dataSet%3E%0D%0A%7D%0D%0A%7D%0D%0A%0D%0A%7D%0D%0Aunion%0D%0A%7B%0D%0Aselect+distinct+%3Fs+%3Ftipo++%7B%0D%0A%0D%0A++%3Chttp%3A%2F%2Fdatos.gob.es%2Fkos%2Fsector-publico%2Fsector%2Fcultura-ocio%3E+a+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23Concept%3E%3B%0D%0A++++++%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23prefLabel%3E+%3FlabelTema.%0D%0A%0D%0A%0D%0A%3Fs+%3FpTema+%3FlabelTema.%0D%0A%3Fs+a+%3Ftipo.%0D%0A%0D%0A+VALUES+%3FpTema+%7B++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%3E+%7D.%0D%0A%0D%0AVALUES+%3Ftipo+%7B+%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23Dataset%3E%0D%0A%7D%0D%0A%7D%0D%0A%0D%0A%0D%0A%7D%0D%0A%0D%0A%7D%0D%0A%0D%0Aorder+by+%3Ftipo+%3Fs&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`

  active: boolean = false;
  toggleSidebar(): void {
    this.active = !this.active;
  }

  temas: any = [];
  temasUnicos: any;

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
        let tema = temasProv[i].labelTema.value;
        this.temas.push(tema)
      }
      this.temasUnicos = [... new Set(this.temas)];
    });

    this.timelineSvc.getCurrentYears();

    this.temasSvc.getResults(this.queryUrlResultTemas).subscribe(data => {
      console.log(data.results.bindings);

    })

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
