import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TemasComponent } from 'src/app/components/temas/temas.component';
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

  constructor(public temasSvc: TemasService, public timelineSvc: TimeLineSvc, private _route: ActivatedRoute) { }

  @ViewChild(TemasComponent) selected: any;

  active: boolean = false;

  temas: any = [];
  temasSelected: any;
  temasUrl: any = [];
  temasUnicos: any;
  temasUnicosUrl: any;
  temp = undefined;
  filterResult = '';
  results = this.temp || [{ category: '', title: '' }];
  temasParsed = this.temp || [{ title: '', url: '' }];
  selectedUrl: any;
  queryUrlResultTemas!: string;
  queryTemasUrl!: string;
  items: any;
  pageOfItems!: Array<any>;
  sortByName: boolean = true;

  ngOnInit(): void {
    this.temasSelected = this._route.snapshot.paramMap.get('temas');

    this.queryTemasUrl = 'https://opendata.aragon.es/sparql?default-graph-uri=&query=select+sum%28%3Fcnt%29+%3Ftipo+%3FlabelTema+%3FuriTema+where%0D%0A%7B%0D%0A%3FuriTema+a+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23Concept%3E%3B%0D%0A++++%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23prefLabel%3E+%3FlabelTema%3B%0D%0A++++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fprov%23wasUsedBy%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fprocedencia%2FE2F7D8F3-6578-15FA-D429-F957DC7D61EF%3E.%0D%0A%7B%0D%0Aselect+distinct+count%28distinct+%3Fs%29+as+%3Fcnt+%3Ftipo++%3FlabelTema+%7B%0D%0A%3Fs+%3FpTema+%3Ftema.%0D%0A%3Fs+a+%3Ftipo.%0D%0A%3Ftema+skos%3AprefLabel+%3FlabelTema.%0D%0A%0D%0A+VALUES+%3FpTema+%7B+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23classification%3E+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%3E+%7D.%0D%0A%0D%0AVALUES+%3Ftipo+%7B+%0D%0A%3Chttp%3A%2F%2Fschema.org%2FCreativeWork%3E%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23Dataset%3E%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23Organization%3E%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23Location%3E%0D%0A%3Chttp%3A%2F%2Fschema.org%2FEvent%3E%0D%0A%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23dataSet%3E%0D%0A%7D%0D%0A%7D%0D%0Agroup+by+%3Ftipo+%3FlabelTema%0D%0A%7D%0D%0Aunion%0D%0A%7B%0D%0Aselect+distinct+count%28distinct+%3Fs%29+as+%3Fcnt+%3Ftipo++%3FlabelTema+%7B%0D%0A%3Fs+%3FpTema+%3FlabelTema.%0D%0A%3Fs+a+%3Ftipo.%0D%0A%0D%0A+VALUES+%3FpTema+%7B++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%3E+%7D.%0D%0A%0D%0AVALUES+%3Ftipo+%7B+%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23Dataset%3E%0D%0A%7D%0D%0A%7D%0D%0Agroup+by+%3Ftipo+%3FlabelTema%0D%0A%0D%0A%7D%0D%0AFILTER+%28regex%28%3FuriTema%2C+%22http%3A%2F%2Fdatos.gob.es%2Fkos%2Fsector-publico%2Fsector%2F%22%29%29.%0D%0A%7D%0D%0Agroup+by+%3Ftipo+%3FlabelTema+%3FuriTema%0D%0Aorder+by+%3FlabelTema&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';

    // this.timelineSvc.getCurrentYears();

    this.temasSvc.getResults(this.queryTemasUrl).subscribe(data => {
      const temasProv = data.results.bindings;
      temasProv.forEach((element: any) => {
        let tema = element.labelTema.value;
        let url = element.uriTema.value;
        this.temas.push(tema);
        this.temasUrl.push(url);
      });

      this.temasUnicos = [... new Set(this.temas)];
      this.temasUnicosUrl = [... new Set(this.temasUrl)];

      this.temasUnicos.forEach((element: any, i: any) => {
        this.temasParsed[i] = { title: element, url: this.temasUnicosUrl[i] }
      });

      const indexFound = this.temasParsed.findIndex(item => item.title.toLowerCase() === this.temasSelected.toLocaleLowerCase());
      this.selectedUrl = this.temasParsed[indexFound].url;

      this.queryUrlResultTemas = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+%3Fs+%3Ftipo+where%0D%0A%7B%0D%0A%7B%0D%0Aselect+distinct+%3Fs+%3Ftipo+%7B%0D%0A%3Fs+%3FpTema+%3C${this.selectedUrl}%3E.%0D%0A%3Fs+a+%3Ftipo.%0D%0A%3Ftema+skos%3AprefLabel+%3FlabelTema.%0D%0A%0D%0A+VALUES+%3FpTema+%7B+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23classification%3E+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%3E+%7D.%0D%0A%0D%0AVALUES+%3Ftipo+%7B+%0D%0A%3Chttp%3A%2F%2Fschema.org%2FCreativeWork%3E%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23Dataset%3E%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23Organization%3E%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23Location%3E%0D%0A%3Chttp%3A%2F%2Fschema.org%2FEvent%3E%0D%0A%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23dataSet%3E%0D%0A%7D%0D%0A%7D%0D%0A%0D%0A%7D%0D%0Aunion%0D%0A%7B%0D%0Aselect+distinct+%3Fs+%3Ftipo++%7B%0D%0A%0D%0A++%3C${this.selectedUrl}%3E+a+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23Concept%3E%3B%0D%0A++++++%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23prefLabel%3E+%3FlabelTema.%0D%0A%0D%0A%0D%0A%3Fs+%3FpTema+%3FlabelTema.%0D%0A%3Fs+a+%3Ftipo.%0D%0A%0D%0A+VALUES+%3FpTema+%7B++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%3E+%7D.%0D%0A%0D%0AVALUES+%3Ftipo+%7B+%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23Dataset%3E%0D%0A%7D%0D%0A%7D%0D%0A%0D%0A%0D%0A%7D%0D%0A%0D%0A%7D%0D%0A%0D%0Aorder+by+%3Ftipo+%3Fs&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

      this.temasSvc.getResults(this.queryUrlResultTemas).subscribe(data => {
        const results = data.results.bindings;
        results.forEach((element: any, i: any) => {
          const title = element.s.value
          this.results[i] = { category: element.tipo.value, title: title }
        });

      });
      console.log(this.results);

      this.items = this.results;

      console.log(this.items);


    });



  }

  sortResults(results: Result[]): Result[] {

    this.sortByName = !this.sortByName
    if (this.sortByName) {
      results.sort(function (a, b) {
        if (a.title > b.title)
          return 1;
        if (a.title < b.title)
          return -1;
        else
          return 0;
      });
    } else {
      results.sort(function (a, b) {
        if (a.title < b.title)
          return 1;
        if (a.title > b.title)
          return -1;
        else
          return 0;
      });
    }


    return results;
  }

  toggleSidebar(): void {
    this.active = !this.active;
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }

  filterByCategory(event: any) {
    this.temasSelected = event;
    window.location.reload();
  }

}
