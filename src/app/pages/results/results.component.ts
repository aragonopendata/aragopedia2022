import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TemasComponent } from 'src/app/components/temas/temas.component';
import { TemasService } from 'src/app/components/temas/temas.service';
import { TimeLineComponent } from 'src/app/components/timeline/timeline.component';
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

  constructor(public temasSvc: TemasService, public timelineSvc: TimeLineSvc, private _route: ActivatedRoute, private router: Router) { }

  @ViewChild(TemasComponent) selected: any;
  @ViewChild(TimeLineComponent) years: any;

  active: boolean = false;

  temas: any = [];
  temasSelected: any;
  temasUrl: any = [];
  temasUnicos: any;
  temasUnicosUrl: any;
  temp = undefined;
  filterResult = '';
  results = this.temp || [{ category: '', categoryURL: '', title: '', resultURL: '', year: '' }];
  temasParsed = this.temp || [{ title: '', url: '' }];
  selectedUrl: string[] = [];
  items: any;
  pageOfItems!: Array<any>;
  sortByName: boolean = true;
  selectedYears: any;
  firstYear!: string;
  lastYear!: string;
  yearsURL!: string;
  selectedUrlSplit: string = '';

  // Queries URL
  queryUrlResultTemas!: string;
  queryTemasUrl: any;


  ngOnInit(): void {

    this.selectedYears = this._route.snapshot.paramMap.get('years')?.split('-');
    this.yearsURL = `${this.firstYear}-${this.lastYear}`;

    this.firstYear = this.selectedYears[0];
    this.lastYear = this.selectedYears[1]
    this.temasSelected = this._route.snapshot.paramMap.get('temas')?.split(',');

    this.queryTemasUrl = 'https://opendata.aragon.es/sparql?default-graph-uri=&query=select+sum%28%3Fcnt%29+%3Ftipo+%3FlabelTema+%3FuriTema+where%0D%0A%7B%0D%0A%3FuriTema+a+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23Concept%3E%3B%0D%0A++++%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23prefLabel%3E+%3FlabelTema%3B%0D%0A++++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fprov%23wasUsedBy%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fprocedencia%2FE2F7D8F3-6578-15FA-D429-F957DC7D61EF%3E.%0D%0A%7B%0D%0Aselect+distinct+count%28distinct+%3Fs%29+as+%3Fcnt+%3Ftipo++%3FlabelTema+%7B%0D%0A%3Fs+%3FpTema+%3Ftema.%0D%0A%3Fs+a+%3Ftipo.%0D%0A%3Ftema+skos%3AprefLabel+%3FlabelTema.%0D%0A%0D%0A+VALUES+%3FpTema+%7B+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23classification%3E+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%3E+%7D.%0D%0A%0D%0AVALUES+%3Ftipo+%7B+%0D%0A%3Chttp%3A%2F%2Fschema.org%2FCreativeWork%3E%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23Dataset%3E%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23Organization%3E%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23Location%3E%0D%0A%3Chttp%3A%2F%2Fschema.org%2FEvent%3E%0D%0A%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23dataSet%3E%0D%0A%7D%0D%0A%7D%0D%0Agroup+by+%3Ftipo+%3FlabelTema%0D%0A%7D%0D%0Aunion%0D%0A%7B%0D%0Aselect+distinct+count%28distinct+%3Fs%29+as+%3Fcnt+%3Ftipo++%3FlabelTema+%7B%0D%0A%3Fs+%3FpTema+%3FlabelTema.%0D%0A%3Fs+a+%3Ftipo.%0D%0A%0D%0A+VALUES+%3FpTema+%7B++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%3E+%7D.%0D%0A%0D%0AVALUES+%3Ftipo+%7B+%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23Dataset%3E%0D%0A%7D%0D%0A%7D%0D%0Agroup+by+%3Ftipo+%3FlabelTema%0D%0A%0D%0A%7D%0D%0AFILTER+%28regex%28%3FuriTema%2C+%22http%3A%2F%2Fdatos.gob.es%2Fkos%2Fsector-publico%2Fsector%2F%22%29%29.%0D%0A%7D%0D%0Agroup+by+%3Ftipo+%3FlabelTema+%3FuriTema%0D%0Aorder+by+%3FlabelTema&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';


    //###### PARSEO DE TEMAS
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


      this.temasSelected.forEach((item: any) => {
        this.temasParsed.forEach((element: any, index: number) => {
          if (element.title === item) {
            this.selectedUrl.push(this.temasParsed[index].url)
          }
        })
      })

      this.selectedUrl.forEach(element => {
        this.selectedUrlSplit += `%3C${element}%3E+`
      });


      this.queryUrlResultTemas = `https://opendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+eli%3A+%3Chttp%3A%2F%2Fdata.europa.eu%2Feli%2Fontology%23%3E%0D%0Aselect+distinct+%3Fitem+%3Ftipo+%3Fyear+str%28%3FlabelItem%29+%3FlabelTema+where+%7B%0D%0A+++%7B+%0D%0A+++++select+distinct+%3FlabelItem+%3Fitem+%3Ftipo++concat%28xsd%3Aint%28substr%28str%28%3Fbegin%29%2C+1%2C+4%29%29%2C+%22+-+%22%2C+xsd%3Aint%28substr%28str%28%3Fend%29%2C+1%2C+4%29%29%29+as+%3Fyear+%3Ftema++from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E++where+%7B%0D%0A++++++++%3Fitem+a+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23Dataset%3E%3B%0D%0A+++++++++++++++++++dct%3Atemporal+%3Fx1.%0D%0A%3Fx1+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimeInterval%3E+%3Fx2.%0D%0AOPTIONAL+%7B%0D%0A++%3Fx2+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimehasBeginning%3E+%3Fx3.%0D%0A++%3Fx3+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimeInstant%3E+%3Fx4.%0D%0A++%3Fx4+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimeinXSDDate%3E+%3Fbegin.%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22Curso%22%29%29.%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22+de+%22%29%29.%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22+actual%22%29%29.%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22Temporada%22%29%29.%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22+Trim%22%29%29.%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22%2F%22%29%29.%0D%0A++FILTER%28%3Fbegin%21%3D%22*%22%5E%5E%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23date%3E%29.%0D%0A+%7D%0D%0A++FILTER+%28%21BOUND%28%3Fbegin%29%7C%7C+xsd%3Aint%28substr%28str%28%3Fbegin%29%2C+1%2C+4%29%29+%3E%3D+${this.firstYear}%29.%0D%0A%0D%0AOPTIONAL+%7B%0D%0A++%3Fx2+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimehasEnd%3E+%3Fx5.%0D%0A++%3Fx5+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimeInstant%3E+%3Fx6.%0D%0A++%3Fx6+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimeinXSDDate%3E+%3Fend.%0D%0A++FILTER%28%21+regex%28%3Fend%2C+%22Curso%22%29%29.%0D%0A++FILTER%28%21+regex%28%3Fend%2C+%22+de+%22%29%29.%0D%0A++FILTER%28%21+regex%28%3Fend%2C+%22+actual%22%29%29.%0D%0A++FILTER%28%21+regex%28%3Fend%2C+%22Temporada%22%29%29.%0D%0A++FILTER%28%21+regex%28%3Fend%2C+%22+Trim%22%29%29.%0D%0A++FILTER%28%21+regex%28%3Fend%2C+%22%2F%22%29%29.%0D%0A++FILTER%28%3Fend%21%3D%22*%22%5E%5E%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23date%3E%29.%0D%0A+%7D%0D%0A++FILTER+%28%21BOUND%28%3Fbegin%29%7C%7C+xsd%3Aint%28substr%28str%28%3Fend%29%2C+1%2C+4%29%29+%3C%3D+${this.lastYear}%29.%0D%0A%0D%0A++++++++%3Fitem+dct%3Atitle+%3FlabelItem.%0D%0A%0D%0A++++++++%3Ftema+a+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23Concept%3E%3B%0D%0A++++++++%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23prefLabel%3E+%3FlabelTema.%0D%0A%0D%0A++++++++%3Fitem+%3FpTema+%3FlabelTema.%0D%0A%0D%0A++++++++VALUES+%3FpTema+%7B++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%3E+%7D.%0D%0A%0D%0A++++++++bind+%28%22dataset_ckan%22+as+%3Ftipo%29.%0D%0A+++++%7D%0D%0A++%7D+union+%7B%0D%0A+++++select+distinct+%3FlabelItem+%3Fitem+%3Ftipo+%3Fyear+%3Ftema++from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A++++++++%3Fitem+%3Ftempo+%3Fo.%0D%0A++++++++%3Fitem+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fprov%23wasUsedBy%3E+%3Fproc.%0D%0A++++++++%3Fproc+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fprov%23wasAssociatedWith%3E+%3Fvista.%0D%0A++++++++values+%3Fvista+%7B+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F74%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F76%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F77%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F30%3E%7D.%0D%0A++++++++values+%3Ftempo+%7B+%3Chttp%3A%2F%2Fdata.europa.eu%2Feli%2Fontology%2Fdate_publication%3E++%7D.%0D%0A%0D%0A++++++++bind+%28xsd%3Aint%28substr%28%3Fo%2C+1%2C4%29%29+as+%3Fyear%29.%0D%0A++++++++filter+%28%3Fyear+%3E%3D+${this.firstYear}%29.%0D%0A++++++++filter+%28%3Fyear+%3C%3D+${this.lastYear}%29.%0D%0A%0D%0A%0D%0A+++++++%3Fitem+%3FpTema+%3Ftema.%0D%0A++++++++OPTIONAL+%7B+%3Fitem+%3FpredicadoLabel+%3FlabelItem.+%0D%0A++++++++++++VALUES+%3FpredicadoLabel+%7B+rdfs%3Alabel+dc%3Atitle+schema%3Atitle+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23fn%3E+%7D%0D%0A++++++++%7D.%0D%0A++++++++VALUES+%3FpTema+%7B+%3Chttp%3A%2F%2Fschema.org%2FadditionalType%3E+%7D.%0D%0A%0D%0A++++++++bind+%28%22archivoSIUa%22+as+%3Ftipo%29.%0D%0A++++%7D%0D%0A++%7D+union+%7B%0D%0A+++++select+distinct++%3Fitem+as+%3FlabelItem+%3Fitem+%3Ftipo+%3Fyear+%3Ftema+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A++++++++%3Fitem+%3Ftempo+%3Fo.%0D%0A++++++++values+%3Ftempo+%7B++eli%3Adate_publication%7D.%0D%0A++++++++bind+%28xsd%3Aint%28substr%28%3Fo%2C+1%2C4%29%29+as+%3Fyear%29.%0D%0A%0D%0A++++++FILTER+%28%3Fo+%3E%3D+%22${this.firstYear}-01-01TZ%22%5E%5Exsd%3AdateTime%29.%0D%0A++++++FILTER+%28%3Fo+%3C%3D+%22${this.lastYear}-01-01TZ%22%5E%5Exsd%3AdateTime%29.%0D%0A+++++++%3Fitem+%3FpTema+%3Ftema.%0D%0A++++++++OPTIONAL+%7B+%3Fitem+%3FpredicadoLabel+%3Flabel.+%0D%0A++++++++++++VALUES+%3FpredicadoLabel+%7B+rdfs%3Alabel+dc%3Atitle+schema%3Atitle+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23fn%3E+%7D%0D%0A++++++++%7D.%0D%0A++++++++VALUES+%3FpTema+%7B+%3Chttp%3A%2F%2Fdata.europa.eu%2Feli%2Fontology%23is_about%3E+%7D.%0D%0A++++++++bind+%28%22eli%22+as+%3Ftipo%29.%0D%0A++++%7D%0D%0A+%7D+union+%7B%0D%0A+++select+distinct+%3FlabelItem+%3Fitem+%3Ftipo+%3FrefPeriod+xsd%3Aint%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F%22%29%29+as+%3Fyear+%3Ftema++where+%7B%0D%0A++++++++select+distinct+%3FlabelItem+%3Fdsd+as+%3Fitem+%3FrefPeriod+%3Ftipo+%3Ftema+where+%7B%0D%0A++++++++++++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A++++++++++++%3Fdataset+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23structure%3E+%3Fdsd.+%0D%0A++++++++++++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A++++++++++++FILTER+%28%3FrefPeriod+IN+%28++%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F${this.firstYear}%3E%2C+%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F${this.lastYear}%3E+%29%29.%0D%0A%0D%0A++++++++++++%3Fdataset+%3FpTema+%3Ftema.%0D%0A%0D%0A++++++++++++%3Fdsd+rdfs%3Alabel+%3FlabelItem.%0D%0A++++++++++++VALUES+%3FpTema+%7B+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23classification%3E+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%3E+%7D.%0D%0A%0D%0A++++++++++++bind%28%22cubo_estadistico%22+as+%3Ftipo%29.%0D%0A++++++++%7D%0D%0A++++%7D%0D%0A+++%7D+union++%7B%0D%0A+++select+distinct+%3FlabelItem+%3Fitem+%3Ftipo+%3FrefPeriod+xsd%3Aint%28substr%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2Fmonth%2F%22%29%2C+1%2C+4%29%29+as+%3Fyear++%3Ftema+where+%7B%0D%0A++++++++select+distinct+%3FlabelItem+%3Fdsd+as+%3Fitem+%3FrefPeriod+%3Ftipo+%3Ftema+where+%7B%0D%0A++++++++++++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A++++++++++++%3Fdataset+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23structure%3E+%3Fdsd.+%0D%0A++++++++++++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+++++++++++++FILTER+%28%3FrefPeriod+IN+%28+%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fmonth%2F${this.lastYear}-01%3E%2C+%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fmonth%2F${this.firstYear}-01%3E+%29%29.%0D%0A%0D%0A++++++++++++%3Fdataset+%3FpTema+%3Ftema.%0D%0A%0D%0A++++++++++++%3Fdsd+rdfs%3Alabel+%3FlabelItem.%0D%0A%0D%0A++++++++++++VALUES+%3FpTema+%7B+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23classification%3E+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%3E+%7D.%0D%0A%0D%0A++++++++++++bind%28%22cubo_estadistico%22+as+%3Ftipo%29.%0D%0A++++++++%7D%0D%0A+++++%7D%0D%0A+++%7D%0D%0A++++++++VALUES+%3Ftema+%7B+${this.selectedUrlSplit}%7D%0D%0A++++++++%3Ftema+skos%3AprefLabel+%3FlabelTema.%0D%0A%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;


      this.temasSvc.getResults(this.queryUrlResultTemas).subscribe(data => {

        const results = data.results.bindings;
        results.forEach((element: any, i: any) => {
          const title = element['callret-3'].value
          this.results[i] = { categoryURL: element.item.value, title: title, category: element.labelTema.value, resultURL: element.item.value, year: element.year.value }
        });
      });
      this.items = this.results;
    });

    //### parseo de temas

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
    this.selectedYears = this.years.yearsSelected;
    this.yearsURL = `${this.selectedYears[0]}-${this.selectedYears[1]}`
    this.router.navigate([`results/${this.temasSelected}/${this.yearsURL}`]);
    setTimeout(function () {
      window.location.reload()
    }, 500)
  }

}
