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

  active: boolean = true;
  error: boolean = false;
  activeAll: boolean = true;
  activeDataset: boolean = false;
  activeCube: boolean = false;
  activeEli: boolean = false;
  activeSiua: boolean = false;

  yearAsc: boolean = true;
  yearDesc: boolean = false;
  currentYear: string = (new Date().getFullYear()).toString();

  totalDatasets: number = 0;
  totalCubes: number = 0;
  totalEli: number = 0;
  totalSiua: number = 0;

  temas: any = [];
  temasSelected: any;
  temasUrl: any = [];
  temasUnicos: any;
  temasUnicosUrl: any;
  temp = undefined;
  filterResult = '';
  results = this.temp || [{ category: '', categoryURL: '', title: '', resultURL: '', year: '', type: '' }];
  temasParsed = this.temp || [{ title: '', url: '', check: false }];
  resultsSinFecha: any;
  selectedUrl: string[] = [];
  items: any;
  pageOfItems!: Array<any>;
  sortByName: boolean = true;
  selectedYears: any;
  firstYear!: string;
  lastYear!: string;
  yearsURL!: string;
  initialData: any;
  selectedUrlSplit: string = '';
  numberOfResults!: number;

  // Queries URL
  queryUrlResultTemas!: string;
  queryTemasUrl!: string;
  queryDatasetsResults!: string;


  ngOnInit(): void {

    this.selectedYears = this._route.snapshot.paramMap.get('years')?.split('-');
    this.firstYear = this.selectedYears[0];
    this.lastYear = this.selectedYears[1]
    this.yearsURL = `${this.firstYear}-${this.lastYear}`;
    this.temasSelected = this._route.snapshot.paramMap.get('temas')?.split(',');
    this.queryTemasUrl = 'https://opendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0D%0A%0D%0ASELECT+DISTINCT+count%28%3FuriTema+as+%3Fcnt%29+%3Ftipo+%3FlabelTema+%3FuriTema+WHERE+%7B%0D%0A++%3FuriTema+a+skos%3AConcept.%0D%0A++%3FuriTema+skos%3AprefLabel+%3FlabelTema.%0D%0A++FILTER%28CONTAINS%28STR%28%3FuriTema%29%2C+%22datos.gob.es%22%29%29%0D%0A++BIND%28%22skos%3AConcept%22+AS+%3Ftipo%29.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on'


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
        this.temasParsed[i] = { title: element, url: this.temasUnicosUrl[i], check: false }
        this.temasSelected?.forEach((tema: any) => {
          this.temasParsed.forEach(temaParsed => {
            if (tema === temaParsed.title) {
              temaParsed.check = true;
            }
          })
        });
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

      this.queryDatasetsResults = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3Fitem+%3Ftipo+%22-%22+as+%3Fyear+str%28%3FlabelItem%29+%3FlabelTema+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3Ewhere+%7B%0D%0A%0D%0A+++++%3Fitem+a+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23Dataset%3E.%0D%0A+++++optional+%7B+%3Fitem++dct%3Atemporal+%3Fx1.+%7D.%0D%0A+++++FILTER+%28%21BOUND%28%3Fx1%29%29.%0D%0A+++++%3Fitem+dct%3Atitle+%3FlabelItem.%0D%0A+++++%3Ftema+a+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23Concept%3E%3B%0D%0A+++++%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23prefLabel%3E+%3FlabelTema.%0D%0A+++++%3Fitem+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%3E+%3Ftema.%0D%0A%0D%0A+++++bind+%28%22dataset_ckan%22+as+%3Ftipo%29.%0D%0A+++++VALUES+%3Ftema+%7B+${this.selectedUrlSplit}%7D%0D%0A+++++%3Ftema+skos%3AprefLabel+%3FlabelTema.+%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
      this.queryUrlResultTemas = `https://opendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+eli%3A+%3Chttp%3A%2F%2Fdata.europa.eu%2Feli%2Fontology%23%3E+%0D%0A%0D%0Aselect+distinct+%3Fitem+%3Ftipo+%3Fyear+str%28%3FlabelItem%29+%3FlabelTema+where+%7B+%0D%0A%0D%0A+++%7B++%0D%0A%0D%0A+++++select+distinct+%3FlabelItem+%3Fitem+%3Ftipo++concat%28xsd%3Aint%28substr%28str%28%3Fbegin%29%2C+1%2C+4%29%29%2C+%22+-+%22%2C+xsd%3Aint%28substr%28str%28%3Fend%29%2C+1%2C+4%29%29%29+as+%3Fyear+%3Ftema++from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E++where+%7B+%0D%0A%0D%0A++++++++%3Fitem+a+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23Dataset%3E%3B+%0D%0A%0D%0A+++++++++++++++++++dct%3Atemporal+%3Fx1.+%0D%0A%0D%0A%3Fx1+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimeInterval%3E+%3Fx2.+%0D%0A%0D%0AOPTIONAL+%7B+%0D%0A%0D%0A++%3Fx2+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimehasBeginning%3E+%3Fx3.+%0D%0A%0D%0A++%3Fx3+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimeInstant%3E+%3Fx4.+%0D%0A%0D%0A++%3Fx4+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimeinXSDDate%3E+%3Fbegin.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22Curso%22%29%29.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22+de+%22%29%29.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22+actual%22%29%29.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22Temporada%22%29%29.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22+Trim%22%29%29.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22%2F%22%29%29.+%0D%0A%0D%0A++FILTER%28%3Fbegin%21%3D%22*%22%5E%5E%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23date%3E%29.+%0D%0A%0D%0A%7D+%0D%0A%0D%0A++FILTER+%28%21BOUND%28%3Fbegin%29%7C%7C+xsd%3Aint%28substr%28str%28%3Fbegin%29%2C+1%2C+4%29%29+%3E%3D+${this.firstYear}%29.+%0D%0A%0D%0AOPTIONAL+%7B+%0D%0A%0D%0A++%3Fx2+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimehasEnd%3E+%3Fx5.+%0D%0A%0D%0A++%3Fx5+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimeInstant%3E+%3Fx6.+%0D%0A%0D%0A++%3Fx6+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimeinXSDDate%3E+%3Fend.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fend%2C+%22Curso%22%29%29.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fend%2C+%22+de+%22%29%29.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fend%2C+%22+actual%22%29%29.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fend%2C+%22Temporada%22%29%29.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fend%2C+%22+Trim%22%29%29.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fend%2C+%22%2F%22%29%29.+%0D%0A%0D%0A++FILTER%28%3Fend%21%3D%22*%22%5E%5E%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23date%3E%29.+%0D%0A%0D%0A%7D+%0D%0A%0D%0A++FILTER+%28%21BOUND%28%3Fbegin%29%7C%7C+xsd%3Aint%28substr%28str%28%3Fend%29%2C+1%2C+4%29%29+%3C%3D+${this.lastYear}%29.+%0D%0A%0D%0A++++++++%3Fitem+dct%3Atitle+%3FlabelItem.+%0D%0A%0D%0A++++++++%3Ftema+a+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23Concept%3E%3B+%0D%0A%0D%0A++++++++%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23prefLabel%3E+%3FlabelTema.+%0D%0A%0D%0A++++++++%3Fitem+%3FpTema+%3Ftema.+%0D%0A%0D%0A++++++++VALUES+%3FpTema+%7B++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%3E+%7D.+%0D%0A%0D%0A++++++++bind+%28%22dataset_ckan%22+as+%3Ftipo%29.+%0D%0A%0D%0A+++++%7D+%0D%0A%0D%0A++%7D+union+%7B+%0D%0A%0D%0A+++++select+distinct+%3FlabelItem+%3Fitem+%3Ftipo+%3Fyear+%3Ftema++from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B+%0D%0A%0D%0A++++++++%3Fitem+%3Ftempo+%3Fo.+%0D%0A%0D%0A+%0D%0A%0D%0A+++++++filter%28regex%28%3Fitem%2C+%22%5Ehttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Furbanismo-infraestructuras%2Fdocumento%2F%22%29%29.+%0D%0A%0D%0A+++++++filter%28regex%28%3Fitem%2C+%22planeamiento%22%29%29.+%0D%0A%0D%0A++++++++++++++++values+%3Ftempo+%7B+%3Chttp%3A%2F%2Fdata.europa.eu%2Feli%2Fontology%2Fdate_publication%3E++%7D.+%0D%0A%0D%0A++++++++bind+%28xsd%3Aint%28substr%28%3Fo%2C+1%2C4%29%29+as+%3Fyear%29.+%0D%0A%0D%0A++++++++filter+%28%3Fyear+%3E%3D+${this.firstYear}%29.+%0D%0A%0D%0A++++++++filter+%28%3Fyear+%3C%3D+${this.lastYear}%29.+%0D%0A%0D%0A+++++++%3Fitem+%3FpTema+%3Ftema.+%0D%0A%0D%0A++++++++OPTIONAL+%7B+%3Fitem+%3FpredicadoLabel+%3FlabelItem.++%0D%0A%0D%0A++++++++++++VALUES+%3FpredicadoLabel+%7B+rdfs%3Alabel+dc%3Atitle+schema%3Atitle+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23fn%3E+%7D+%0D%0A%0D%0A++++++++%7D.+%0D%0A%0D%0A++++++++VALUES+%3FpTema+%7B+%3Chttp%3A%2F%2Fschema.org%2FadditionalType%3E+%7D.+%0D%0A%0D%0A++++++++bind+%28%22archivoSIUa%22+as+%3Ftipo%29.+%0D%0A%0D%0A++++%7D+%0D%0A%0D%0A++%7D+union+%7B+%0D%0A%0D%0A+++++select+distinct++%3Fitem3+as+%3Fitem+++%3FlabelItem+%3Ftipo+%3Fyear+%3Ftema+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B+%0D%0A%0D%0A++++++++%3Fitem+%3Ftempo+%3Fo.+%0D%0A%0D%0A++++++++%3Fitem+eli%3Ais_realized_by+%3Fitem2.++%0D%0A%0D%0A++++++++%3Fitem2+eli%3Atitle+%3FlabelItem.++%0D%0A%0D%0A++++++++%3Fitem2+eli%3Ais_embodied_by+%3Fitem3.++%0D%0A%0D%0A++++++++values+%3Ftempo+%7B++eli%3Adate_publication%7D.+%0D%0A%0D%0A++++++++bind+%28xsd%3Aint%28substr%28%3Fo%2C+1%2C4%29%29+as+%3Fyear%29.+%0D%0A%0D%0A++++++FILTER+%28%3Fo+%3E%3D+%22${this.firstYear}-01-01TZ%22%5E%5Exsd%3AdateTime%29.+%0D%0A%0D%0A++++++FILTER+%28%3Fo+%3C%3D+%22${this.lastYear}-01-01TZ%22%5E%5Exsd%3AdateTime%29.+%0D%0A%0D%0A+++++++%3Fitem+%3FpTema+%3Ftema.+%0D%0A%0D%0A++++++++OPTIONAL+%7B+%3Fitem+%3FpredicadoLabel+%3Flabel.++%0D%0A%0D%0A++++++++++++VALUES+%3FpredicadoLabel+%7B+rdfs%3Alabel+dc%3Atitle+schema%3Atitle+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23fn%3E+%7D+%0D%0A%0D%0A++++++++%7D.+%0D%0A%0D%0A++++++++VALUES+%3FpTema+%7B+%3Chttp%3A%2F%2Fdata.europa.eu%2Feli%2Fontology%23is_about%3E+%7D.+%0D%0A%0D%0A++++++++bind+%28%22eli%22+as+%3Ftipo%29.+%0D%0A%0D%0A++++%7D+%0D%0A%0D%0A%7D+union+%7B+%0D%0A%0D%0A+++select+distinct+%3FlabelItem+%3Fitem+%3Ftipo+concat%28str%28%3Fminimo%29%2C+%22+-+%22%2C+str%28%3Fmaximo%29%29+as+%3Fyear+%3Ftema++where+%7B+%0D%0A%0D%0A++++++++select+distinct+%3FlabelItem+%3Fdsd+as+%3Fitem+%3Ftipo+%3Ftema+min%28%3Fyear%29+as+%3Fminimo+max%28%3Fyear%29+as+%3Fmaximo+where+%7B+%0D%0A%0D%0A++++++++++++%3Fobs+qb%3AdataSet+%3Fdataset.+%0D%0A%0D%0A++++++++++++%3Fdataset+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23structure%3E+%3Fdsd.++%0D%0A%0D%0A++++++++++++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.+%0D%0A%0D%0A++++++++++++%3FrefPeriod+time%3AinXSDgYear+%3Fyear.+%0D%0A%0D%0A++++++++++++filter%28xsd%3Aint%28%3Fyear%29+%3E%3D++${this.firstYear}%29.+%0D%0A%0D%0A++++++++++++filter%28xsd%3Aint%28%3Fyear%29+%3C%3D+${this.lastYear}%29.+%0D%0A%0D%0A++++++++++++%3Fdataset+%3FpTema+%3Ftema.+%0D%0A%0D%0A++++++++++++%3Fdsd+dc%3Atitle+%3FlabelItem.+%0D%0A%0D%0A++++++++++++VALUES+%3FpTema+%7B+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23classification%3E+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%3E+%7D.+%0D%0A%0D%0A++++++++++++bind%28%22cubo_estadistico%22+as+%3Ftipo%29.+%0D%0A%0D%0A++++++++%7D+%0D%0A%0D%0A++++%7D+%0D%0A%0D%0A+++%7D++%0D%0A%0D%0A++++VALUES+%3Ftema+%7B+${this.selectedUrlSplit}%7D+%0D%0A%0D%0A++++++++%3Ftema+skos%3AprefLabel+%3FlabelTema.+%0D%0A%0D%0A++%0D%0A%0D%0A%7D+&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

      this.temasSvc.getResults(this.queryDatasetsResults).subscribe(data => {
        this.resultsSinFecha = data?.results.bindings;
      });

      this.temasSvc.getResults(this.queryUrlResultTemas).subscribe(data => {
        const results = data.results.bindings;
        results.forEach((element: any, i: any) => {
          if (element.tipo.value === 'cubo_estadistico') {
            this.results[i] = { categoryURL: element.item.value, title: element['callret-3'].value, category: element.labelTema.value, resultURL: element.item.value, year: element.year.value, type: 'Cubo estadístico' }
          } else if (element.tipo.value === 'dataset_ckan') {
            this.results[i] = {
              categoryURL: element.item.value, title: element['callret-3'].value, category: element.labelTema.value, resultURL: element.item.value, year: element.year.value, type: 'Dataset'
            }
          } else if (element.tipo.value === 'eli') {
            this.results[i] = { categoryURL: element.item.value, title: element['callret-3'].value, category: element.labelTema.value, resultURL: element.item.value, year: element.year.value, type: 'ELI' }
          }
          else { this.results[i] = { categoryURL: element.item.value, title: element['callret-3'].value, category: element.labelTema.value, resultURL: element.item.value, year: element.year.value, type: 'SIUa' } }
        });

        let i: number = this.results.length;

        if (this.firstYear === '1978' && this.lastYear === this.currentYear) {
          this.resultsSinFecha.forEach((element: any) => {
            if (element.tipo.value === 'cubo_estadistico') {
              this.results[i] = { categoryURL: element.item.value, title: element['callret-3'].value, category: element.labelTema.value, resultURL: element.item.value, year: element.year.value, type: 'Cubo estadístico' }
            } else if (element.tipo.value === 'dataset_ckan') {
              this.results[i] = {
                categoryURL: element.item.value, title: element['callret-3'].value, category: element.labelTema.value, resultURL: element.item.value, year: element.year.value, type: 'Dataset'
              }
            } else if (element.tipo.value === 'eli') {
              this.results[i] = { categoryURL: element.item.value, title: element['callret-3'].value, category: element.labelTema.value, resultURL: element.item.value, year: element.year.value, type: 'ELI' }
            }
            else { this.results[i] = { categoryURL: element.item.value, title: element['callret-3'].value, category: element.labelTema.value, resultURL: element.item.value, year: element.year.value, type: 'SIUa' } }
            i++;
          });
        }

        if (this.results[0].title === '') {
          this.results.shift();
        }

        this.results.forEach((element: any, i: number) => {
          if (element.type === 'Dataset') {
            this.totalDatasets += 1;
          } else if (element.type === 'Cubo estadístico') {
            this.totalCubes += 1;
          } else if (element.type === 'ELI') {
            this.totalEli += 1;
          } else if (element.type === 'SIUa') {
            this.totalSiua += 1;
          }
        });

        this.items = this.results;
        this.numberOfResults = this.items.length;

      });

      this.showAll();
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

  sortByYearAsc() {
    const resultsByYear = this.results.sort((a: any, b: any) => {
      return Number(a.year.substring(0, 4)) - Number(b.year.substring(0, 4));
    });
    this.yearAsc = true;
    this.yearDesc = false;
    this.items = resultsByYear;
    this.pageOfItems = resultsByYear.slice(0, 9);
  }

  sortByYearDesc() {
    const resultsByYear = this.results.sort((a: any, b: any) => {
      return Number(b.year.substring(0, 4)) - Number(a.year.substring(0, 4));
    });
    this.yearAsc = false;
    this.yearDesc = true;
    this.items = resultsByYear;
    this.pageOfItems = resultsByYear.slice(0, 9);
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

  filterByYears() {
    let temasFiltered: string[] = [];

    this.temasParsed.forEach(tema => {
      if (tema.check) {
        temasFiltered.push(tema.title)
      } else {
        temasFiltered.filter((temaFiltered) => temaFiltered !== tema.title)
      }
    });

    this.selectedYears = this.years.yearsSelected;
    this.yearsURL = `${this.selectedYears[0]}-${this.selectedYears[1]}`

    if (temasFiltered.length >= 1 && temasFiltered.length <= 5) {
      this.router.navigate([`results/${temasFiltered}/${this.yearsURL}`]);
      setTimeout(function () {
        window.location.reload()
      }, 500)
    } else {
      this.error = true;
    }
  }

  showAll() {
    this.items = this.results;
    this.activeAll = true;
    this.activeDataset = false;
    this.activeCube = false;
    this.activeEli = false;
    this.activeSiua = false;
  }

  filterByDataset() {
    const datasetResults = this.results.filter(element => element.type === 'Dataset');
    this.activeDataset = true;
    this.activeAll = false;
    this.activeCube = false;
    this.activeSiua = false;
    this.activeEli = false;
    this.items = datasetResults;
    this.pageOfItems = datasetResults.slice(0, 9)
  }

  filterByCube() {
    
    const cubeResults = this.results.filter(element => element.type === 'Cubo estadístico');
    this.activeCube = true;
    this.activeAll = false;
    this.activeDataset = false;
    this.activeSiua = false;
    this.activeEli = false;
    
    this.items = cubeResults;
    this.pageOfItems = cubeResults.slice(0, 9)
  }

  filterByEli() {
    const eliResults = this.results.filter(element => element.type === 'ELI');
    this.activeEli = true;
    this.activeCube = false;
    this.activeAll = false;
    this.activeSiua = false;
    this.activeDataset = false;
    
    this.items = eliResults;
    this.pageOfItems = eliResults.slice(0, 9);
  }

  filterBySiua() {
    const siuaResults = this.results.filter(element => element.type === 'SIUa');
    this.activeSiua = true;
    this.activeEli = false;
    this.activeCube = false;
    this.activeAll = false;
    this.activeDataset = false;
    this.items = siuaResults;
    this.pageOfItems = siuaResults.slice(0, 9);
  }

  uncheckTemas(event: Event) {
    event.preventDefault();
    this.temasParsed.forEach(tema => {
      if (tema.check) {
        tema.check = false;
      }
      
    })
  }

  navigateAragopedia(cubo: string) {
    const index = cubo.lastIndexOf('/') + 1;
    const cuboId = cubo.substring(index);
    this.router.navigate(['aragopedia'], { queryParams: { tipo: 'provincia', id: '7823', datos: `${cuboId}TP` } })
  }
}
