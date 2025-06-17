import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TemasComponent } from 'src/app/components/temas/temas.component';
import { TemasService } from 'src/app/components/temas/temas.service';
import { TimeLineComponent } from 'src/app/components/timeline/timeline.component';
import { TimeLineSvc } from 'src/app/components/timeline/timeline.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface Result {
  category: String;
  title: String;
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})

export class ResultsComponent implements OnInit, AfterViewInit  {

  constructor(public temasSvc: TemasService, public timelineSvc: TimeLineSvc, private _route: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef) { }
  @ViewChild(TemasComponent) selected: any;
  @ViewChild(TimeLineComponent) years: any;
  pageSize: number = 10;
  currentPage: number = 1;

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
  firstYear: string = '1978'; // Valor por defecto
  lastYear: string = this.currentYear; // Valor por defecto
  yearsURL!: string;
  initialData: any;
  selectedUrlSplit: string = '';
  numberOfResults!: number;

  // Queries URL
  queryUrlResultTemas!: string;
  queryTemasUrl!: string;
  queryDatasetsResults!: string;

  allResults: any[] = [];
  ngOnInit(): void {
    // Extract years from URL and parse them properly
    const yearsParam = this._route.snapshot.paramMap.get('years');
    
    // Log raw years parameter for debugging
    console.log("Years parameter from URL:", yearsParam);
    
    if (yearsParam) {
      // Split only if the parameter exists and isn't empty
      this.selectedYears = yearsParam.split('-').map(y => y.trim());
      
      // Make sure we have valid year values
      if (this.selectedYears && this.selectedYears.length >= 2 && 
          this.selectedYears[0] && this.selectedYears[1]) {
        this.firstYear = this.selectedYears[0];
        this.lastYear = this.selectedYears[1];
      } else {
        console.warn("Years parameter exists but couldn't be properly parsed:", yearsParam);
        // Default to full range if parsing fails
        this.firstYear = '1978';
        this.lastYear = this.currentYear;
      }
    } else {
      console.warn("No years parameter in URL, using default range");
      this.firstYear = '1978';
      this.lastYear = this.currentYear;
    }
    
    // Log the parsed years to verify they're correct
    console.log("Parsed years - first:", this.firstYear, "last:", this.lastYear);
    
    // Force change detection to ensure bindings update
    this.cdr.detectChanges();
  
    // Set the years URL parameter for API calls
    this.yearsURL = `${this.firstYear}-${this.lastYear}`;
  
    // Process themes from URL parameter
    this.temasSelected = this._route.snapshot.paramMap.get('temas')?.split(',') || [];
    
    this.queryTemasUrl = 'https://opendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0D%0A%0D%0ASELECT+DISTINCT+count%28%3FuriTema+as+%3Fcnt%29+%3Ftipo+%3FlabelTema+%3FuriTema+WHERE+%7B%0D%0A++%3FuriTema+a+skos%3AConcept.%0D%0A++%3FuriTema+skos%3AprefLabel+%3FlabelTema.%0D%0A++FILTER%28CONTAINS%28STR%28%3FuriTema%29%2C+%22datos.gob.es%22%29%29%0D%0A++BIND%28%22skos%3AConcept%22+AS+%3Ftipo%29.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';
  
    //###### PARSEO DE TEMAS
    this.temasSvc.getResults(this.queryTemasUrl)
      .pipe(
        catchError(error => {
          console.error('Error obteniendo temas:', error);
          this.error = true;
          return of(null);
        })
      )
      .subscribe(data => {
        if (!data) return;
        
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
        });
  
        this.selectedUrl.forEach(element => {
          this.selectedUrlSplit += `%3C${element}%3E+`
        });
  
        // Make sure years are valid and available for API calls
        console.log('Using years for API calls - firstYear:', this.firstYear, 'lastYear:', this.lastYear);
        
        // Always use safe values for API calls
        const safeFirstYear = this.firstYear || '1978';
        const safeLastYear = this.lastYear || this.currentYear;
        
        this.queryDatasetsResults = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3Fitem+%3Ftipo+%22-%22+as+%3Fyear+str%28%3FlabelItem%29+%3FlabelTema+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3Ewhere+%7B%0D%0A%0D%0A+++++%3Fitem+a+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23Dataset%3E.%0D%0A+++++optional+%7B+%3Fitem++dct%3Atemporal+%3Fx1.+%7D.%0D%0A+++++FILTER+%28%21BOUND%28%3Fx1%29%29.%0D%0A+++++%3Fitem+dct%3Atitle+%3FlabelItem.%0D%0A+++++%3Ftema+a+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23Concept%3E%3B%0D%0A+++++%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23prefLabel%3E+%3FlabelTema.%0D%0A+++++%3Fitem+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%3E+%3Ftema.%0D%0A%0D%0A+++++bind+%28%22dataset_ckan%22+as+%3Ftipo%29.%0D%0A+++++VALUES+%3Ftema+%7B+${this.selectedUrlSplit}%7D%0D%0A+++++%3Ftema+skos%3AprefLabel+%3FlabelTema.+%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
  
        this.queryUrlResultTemas = `https://opendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+eli%3A+%3Chttp%3A%2F%2Fdata.europa.eu%2Feli%2Fontology%23%3E+%0D%0A%0D%0Aselect+distinct+%3Fitem+%3Ftipo+%3Fyear+str%28%3FlabelItem%29+%3FlabelTema+where+%7B+%0D%0A%0D%0A+++%7B++%0D%0A%0D%0A+++++select+distinct+%3FlabelItem+%3Fitem+%3Ftipo++concat%28xsd%3Aint%28substr%28str%28%3Fbegin%29%2C+1%2C+4%29%29%2C+%22+-+%22%2C+xsd%3Aint%28substr%28str%28%3Fend%29%2C+1%2C+4%29%29%29+as+%3Fyear+%3Ftema++from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E++where+%7B+%0D%0A%0D%0A++++++++%3Fitem+a+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23Dataset%3E%3B+%0D%0A%0D%0A+++++++++++++++++++dct%3Atemporal+%3Fx1.+%0D%0A%0D%0A%3Fx1+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimeInterval%3E+%3Fx2.+%0D%0A%0D%0AOPTIONAL+%7B+%0D%0A%0D%0A++%3Fx2+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimehasBeginning%3E+%3Fx3.+%0D%0A%0D%0A++%3Fx3+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimeInstant%3E+%3Fx4.+%0D%0A%0D%0A++%3Fx4+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimeinXSDDate%3E+%3Fbegin.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22Curso%22%29%29.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22+de+%22%29%29.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22+actual%22%29%29.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22Temporada%22%29%29.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22+Trim%22%29%29.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22%2F%22%29%29.+%0D%0A%0D%0A++FILTER%28%3Fbegin%21%3D%22*%22%5E%5E%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23date%3E%29.+%0D%0A%0D%0A%7D+%0D%0A%0D%0A++FILTER+%28%21BOUND%28%3Fbegin%29%7C%7C+xsd%3Aint%28substr%28str%28%3Fbegin%29%2C+1%2C+4%29%29+%3E%3D+${safeFirstYear}+%29.+%0D%0A%0D%0AOPTIONAL+%7B+%0D%0A%0D%0A++%3Fx2+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimehasEnd%3E+%3Fx5.+%0D%0A%0D%0A++%3Fx5+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimeInstant%3E+%3Fx6.+%0D%0A%0D%0A++%3Fx6+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimeinXSDDate%3E+%3Fend.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fend%2C+%22Curso%22%29%29.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fend%2C+%22+de+%22%29%29.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fend%2C+%22+actual%22%29%29.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fend%2C+%22Temporada%22%29%29.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fend%2C+%22+Trim%22%29%29.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fend%2C+%22%2F%22%29%29.+%0D%0A%0D%0A++FILTER%28%3Fend%21%3D%22*%22%5E%5E%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23date%3E%29.+%0D%0A%0D%0A%7D+%0D%0A%0D%0A++FILTER+%28%21BOUND%28%3Fbegin%29%7C%7C+xsd%3Aint%28substr%28str%28%3Fend%29%2C+1%2C+4%29%29+%3C%3D+${safeLastYear}%29.+%0D%0A%0D%0A++++++++%3Fitem+dct%3Atitle+%3FlabelItem.+%0D%0A%0D%0A++++++++%3Ftema+a+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23Concept%3E%3B+%0D%0A%0D%0A++++++++%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23prefLabel%3E+%3FlabelTema.+%0D%0A%0D%0A++++++++%3Fitem+%3FpTema+%3Ftema.+%0D%0A%0D%0A++++++++VALUES+%3FpTema+%7B++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%3E+%7D.+%0D%0A%0D%0A++++++++bind+%28%22dataset_ckan%22+as+%3Ftipo%29.+%0D%0A%0D%0A+++++%7D+%0D%0A%0D%0A++%7D+union+%7B+%0D%0A%0D%0A+++++select+distinct+%3FlabelItem+%3Fitem+%3Ftipo+%3Fyear+%3Ftema++from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B+%0D%0A%0D%0A++++++++%3Fitem+%3Ftempo+%3Fo.+%0D%0A%0D%0A+%0D%0A%0D%0A+++++++filter%28regex%28%3Fitem%2C+%22%5Ehttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Furbanismo-infraestructuras%2Fdocumento%2F%22%29%29.+%0D%0A%0D%0A+++++++filter%28regex%28%3Fitem%2C+%22planeamiento%22%29%29.+%0D%0A%0D%0A++++++++++++++++values+%3Ftempo+%7B+%3Chttp%3A%2F%2Fdata.europa.eu%2Feli%2Fontology%2Fdate_publication%3E++%7D.+%0D%0A%0D%0A++++++++bind+%28xsd%3Aint%28substr%28%3Fo%2C+1%2C4%29%29+as+%3Fyear%29.+%0D%0A%0D%0A++++++++filter+%28%3Fyear+%3E%3D+${safeFirstYear}+%29.+%0D%0A%0D%0A++++++++filter+%28%3Fyear+%3C%3D+${safeLastYear}%29.+%0D%0A%0D%0A+++++++%3Fitem+%3FpTema+%3Ftema.+%0D%0A%0D%0A++++++++OPTIONAL+%7B+%3Fitem+%3FpredicadoLabel+%3FlabelItem.++%0D%0A%0D%0A++++++++++++VALUES+%3FpredicadoLabel+%7B+rdfs%3Alabel+dc%3Atitle+schema%3Atitle+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23fn%3E+%7D+%0D%0A%0D%0A++++++++%7D.+%0D%0A%0D%0A++++++++VALUES+%3FpTema+%7B+%3Chttp%3A%2F%2Fschema.org%2FadditionalType%3E+%7D.+%0D%0A%0D%0A++++++++bind+%28%22archivoSIUa%22+as+%3Ftipo%29.+%0D%0A%0D%0A++++%7D+%0D%0A%0D%0A++%7D+union+%7B+%0D%0A%0D%0A+++++select+distinct++%3Fitem3+as+%3Fitem+++%3FlabelItem+%3Ftipo+%3Fyear+%3Ftema+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B+%0D%0A%0D%0A++++++++%3Fitem+%3Ftempo+%3Fo.+%0D%0A%0D%0A++++++++%3Fitem+eli%3Ais_realized_by+%3Fitem2.++%0D%0A%0D%0A++++++++%3Fitem2+eli%3Atitle+%3FlabelItem.++%0D%0A%0D%0A++++++++%3Fitem2+eli%3Ais_embodied_by+%3Fitem3.++%0D%0A%0D%0A++++++++values+%3Ftempo+%7B++eli%3Adate_publication%7D.+%0D%0A%0D%0A++++++++bind+%28xsd%3Aint%28substr%28%3Fo%2C+1%2C4%29%29+as+%3Fyear%29.+%0D%0A%0D%0A++++++FILTER+%28%3Fo+%3E%3D+%22${safeFirstYear}-01-01TZ%22%5E%5Exsd%3AdateTime%29.+%0D%0A%0D%0A++++++FILTER+%28%3Fo+%3C%3D+%22${safeLastYear}-01-01TZ%22%5E%5Exsd%3AdateTime%29.+%0D%0A%0D%0A+++++++%3Fitem+%3FpTema+%3Ftema.+%0D%0A%0D%0A++++++++OPTIONAL+%7B+%3Fitem+%3FpredicadoLabel+%3Flabel.++%0D%0A%0D%0A++++++++++++VALUES+%3FpredicadoLabel+%7B+rdfs%3Alabel+dc%3Atitle+schema%3Atitle+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23fn%3E+%7D+%0D%0A%0D%0A++++++++%7D.+%0D%0A%0D%0A++++++++VALUES+%3FpTema+%7B+%3Chttp%3A%2F%2Fdata.europa.eu%2Feli%2Fontology%23is_about%3E+%7D.+%0D%0A%0D%0A++++++++bind+%28%22eli%22+as+%3Ftipo%29.+%0D%0A%0D%0A++++%7D+%0D%0A%0D%0A%7D+union+%7B+%0D%0A%0D%0A+++select+distinct+%3FlabelItem+%3Fitem+%3Ftipo+concat%28str%28%3Fminimo%29%2C+%22+-+%22%2C+str%28%3Fmaximo%29%29+as+%3Fyear+%3Ftema++where+%7B+%0D%0A%0D%0A++++++++select+distinct+%3FlabelItem+%3Fdsd+as+%3Fitem+%3Ftipo+%3Ftema+min%28%3Fyear%29+as+%3Fminimo+max%28%3Fyear%29+as+%3Fmaximo+where+%7B+%0D%0A%0D%0A++++++++++++%3Fobs+qb%3AdataSet+%3Fdataset.+%0D%0A%0D%0A++++++++++++%3Fdataset+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23structure%3E+%3Fdsd.++%0D%0A%0D%0A++++++++++++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.+%0D%0A%0D%0A++++++++++++%3FrefPeriod+time%3AinXSDgYear+%3Fyear.+%0D%0A%0D%0A++++++++++++filter%28xsd%3Aint%28%3Fyear%29+%3E%3D++${safeFirstYear}+%29.+%0D%0A%0D%0A++++++++++++filter%28xsd%3Aint%28%3Fyear%29+%3C%3D+${safeLastYear}%29.+%0D%0A%0D%0A++++++++++++%3Fdataset+%3FpTema+%3Ftema.+%0D%0A%0D%0A++++++++++++%3Fdsd+dc%3Atitle+%3FlabelItem.+%0D%0A%0D%0A++++++++++++VALUES+%3FpTema+%7B+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23classification%3E+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%3E+%7D.+%0D%0A%0D%0A++++++++++++bind%28%22cubo_estadistico%22+as+%3Ftipo%29.+%0D%0A%0D%0A++++++++%7D+%0D%0A%0D%0A++++%7D+%0D%0A%0D%0A+++%7D++%0D%0A%0D%0A++++VALUES+%3Ftema+%7B+${this.selectedUrlSplit}+%7D+%0D%0A%0D%0A++++++++%3Ftema+skos%3AprefLabel+%3FlabelTema.+%0D%0A%0D%0A++%0D%0A%0D%0A%7D+&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
  
        this.temasSvc.getResults(this.queryDatasetsResults)
          .pipe(
            catchError(error => {
              console.error('Error obteniendo datasets sin fecha:', error);
              return of({ results: { bindings: [] } });
            })
          )
          .subscribe(data => {
            this.resultsSinFecha = data?.results.bindings || [];
          });

        this.temasSvc.getResults(this.queryUrlResultTemas)
          .pipe(
            catchError(error => {
              console.error('Error obteniendo resultados por temas:', error);
              this.error = true;
              return of({ results: { bindings: [] } });
            })
          )
          .subscribe({
            next: (data) => {
              const results = data.results.bindings || [];
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
              this.allResults = [...this.results];
              // inicializa la página
              this.applyYearFilter(this.firstYear, this.lastYear);
            },
            error: (error) => {
              console.error('Error en la suscripción a queryUrlResultTemas:', error);
              this.error = true;
            }
          });

        this.showAll();
      });
    //### parseo de temas
  }

  // recibe el array de temas marcados
onTemasChanged(temasSeleccionados: string[]) {
  this.temasSelected = temasSeleccionados;
}

// cuando el usuario pulsa "Aplicar filtros"
applyFilters() {
  // 1) filtramos por años (ya lo tienes en applyYearFilter)
  this.applyYearFilter(this.firstYear, this.lastYear);
  // 2) filtramos por categoría/tema
  if (this.temasSelected && this.temasSelected.length > 0) {
    this.items = this.items.filter((item: { category: any; }) =>
      this.temasSelected.includes(item.category)
    );
  }
  // 3) reajustamos paginación
  this.currentPage = 1;
  this.pageOfItems = this.items.slice(0, this.pageSize);
}


  ngAfterViewInit() {
    // Dar tiempo para que el componente timeline se inicialice
    setTimeout(() => {
      this.initializeTimelineComponent();
    }, 500);
  }

    initializeTimelineComponent() {
    // Verificar si el componente timeline está disponible
    if (this.years) {
      // Establecer los años seleccionados en el timeline
      if (this.selectedYears && this.selectedYears.length >= 2) {
        this.years.firstYearSelected = this.selectedYears[0];
        this.years.lastYearSelected = this.selectedYears[1];
        this.years.yearsSelected = this.selectedYears;
        
        // Limpiar los índices guardados para forzar una reinicialización completa
        this.years.savedLeftIndex = -1;
        this.years.savedRightIndex = -1;
        
        // Reinicializar el timeline
        if (this.years.chartLoaded) {
          this.years.reinitializeChart();
        } else if (this.years.dataSource && this.years.dataSource.length > 0) {
          // Si los datos están disponibles pero el gráfico no está cargado
          this.years.initChart();
        }
      }
    } else {
      // Si el componente timeline aún no está disponible, intentarlo de nuevo
      setTimeout(() => {
        this.initializeTimelineComponent();
      }, 300);
    }
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
    this.pageOfItems = resultsByYear.slice(0, this.pageSize);
  }

  sortByYearDesc() {
    const resultsByYear = this.results.sort((a: any, b: any) => {
      return Number(b.year.substring(0, 4)) - Number(a.year.substring(0, 4));
    });
    this.yearAsc = false;
    this.yearDesc = true;
    this.items = resultsByYear;
    this.pageOfItems = resultsByYear.slice(0, this.pageSize);
  }

  toggleSidebar(): void {
    this.active = !this.active;
  }

  onChangePage(newPage: number): void {
    this.currentPage = newPage;
    const start = (newPage - 1) * this.pageSize;
    this.pageOfItems = this.items.slice(start, start + this.pageSize);
  }
  
  // Asegúrate de que cuando filtramos los resultados, se mantenga la paginación correcta

  onYearsChanged(event: {value: [string,string]}) {
    const [start, end] = event.value;
    if (!start || !end) { return; }
    this.firstYear = start;
    this.lastYear  = end;
    this.applyYearFilter(start, end);
  }

  /**
   * Filtra los resultados por año y recalcula paginación
   */
  private applyYearFilter(start: string, end: string) {
    const from = parseInt(start, 10);
    const to   = parseInt(end,   10);

    // Filtrar a partir del array completo
    this.items = this.allResults.filter(r => {
      // Si no tiene año o es un formato inválido, incluirlo siempre
      if (!r.year || r.year === '-') return true;
      
      const y = parseInt(r.year.substring(0,4), 10) || 0;
      return y >= from && y <= to;
    });

    // Recalcular número total y primera página
    this.numberOfResults = this.items.length;
    this.currentPage     = 1;
    this.pageOfItems     = this.items.slice(0, this.pageSize);
  }

  

  filterByCategory(event: any) {
    this.temasSelected = event;
    this.selectedYears = this.years?.yearsSelected || [this.firstYear, this.lastYear];
    this.yearsURL = `${this.selectedYears[0]}-${this.selectedYears[1]}`
    this.router.navigate([`results/${this.temasSelected}/${this.yearsURL}`]);
    setTimeout(function () {
      window.location.reload()
    }, 500)
  }



  showAll() {
    this.items = this.results;
    this.activeAll = true;
    this.activeDataset = false;
    this.activeCube = false;
    this.activeEli = false;
    this.activeSiua = false;
    
    // Actualizar paginación
    this.currentPage = 1;
    this.pageOfItems = this.items.slice(0, this.pageSize);
  }

  filterByDataset() {
    const datasetResults = this.results.filter(element => element.type === 'Dataset');
    this.activeDataset = true;
    this.activeAll = false;
    this.activeCube = false;
    this.activeSiua = false;
    this.activeEli = false;
    this.items = datasetResults;
    
    // Resetear la página actual a 1 cuando se cambia el filtro
    this.currentPage = 1;
    // Actualizar los elementos de la página actual
    this.pageOfItems = datasetResults.slice(0, this.pageSize);
  }

  filterByCube() {
    const cubeResults = this.results.filter(element => element.type === 'Cubo estadístico');
    this.activeCube = true;
    this.activeAll = false;
    this.activeDataset = false;
    this.activeSiua = false;
    this.activeEli = false;
    
    this.items = cubeResults;
    
    // Actualizar paginación
    this.currentPage = 1;
    this.pageOfItems = cubeResults.slice(0, this.pageSize);
  }

  filterByEli() {
    const eliResults = this.results.filter(element => element.type === 'ELI');
    this.activeEli = true;
    this.activeCube = false;
    this.activeAll = false;
    this.activeSiua = false;
    this.activeDataset = false;
    
    this.items = eliResults;
    
    // Actualizar paginación
    this.currentPage = 1;
    this.pageOfItems = eliResults.slice(0, this.pageSize);
  }

  filterBySiua() {
    const siuaResults = this.results.filter(element => element.type === 'SIUa');
    this.activeSiua = true;
    this.activeEli = false;
    this.activeCube = false;
    this.activeAll = false;
    this.activeDataset = false;
    this.items = siuaResults;
    
    // Actualizar paginación
    this.currentPage = 1;
    this.pageOfItems = siuaResults.slice(0, this.pageSize);
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