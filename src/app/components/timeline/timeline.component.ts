import { NgModule, Component, OnInit, Input, HostListener } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxRangeSelectorModule } from 'devextreme-angular';
import { TimeLineSvc, YearsPeriod } from './timeline.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-timeline',
  providers: [TimeLineSvc],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})


export class TimeLineComponent implements OnInit {
  constructor(private timeLineSvc: TimeLineSvc) {
  }
  temp = undefined;
  allYearsData: any;
  queryUrlYears!: string;
  firstYear: any;
  lastYear: any;
  dataSource = this.temp || [{}];
  accessibleMode: boolean = false;
  accessibleError: boolean = true;

  firstYearSelected: string = '';
  lastYearSelected: string = '';

  currentYear: string = (new Date().getFullYear()).toString();

  @Input() yearsSelected: any;
  @Input() yearsURL: string = ``;

  staticDataSource = [
    {
      year: '1978',
      datos: '10',
    }, {
      year: '1979',
      datos: '15',
    }, {
      year: '1980',
      datos: '7',
    }, {
      year: '1981',
      datos: '11',
    }, {
      year: '1982',
      datos: '44',
    }, {
      year: '1983',
      datos: '84',
    }, {
      year: '1984',
      datos: '106',
    }, {
      year: '1985',
      datos: '132',
    }, {
      year: '1986',
      datos: '131',
    }, {
      year: '1987',
      datos: '161',
    }, {
      year: '1988',
      datos: '169',
    }, {
      year: '1989',
      datos: '158',
    }, {
      year: '1990',
      datos: '166',
    }, {
      year: '1991',
      datos: '195',
    }, {
      year: '1992',
      datos: '288',
    }, {
      year: '1993',
      datos: '160',
    }, {
      year: '1994',
      datos: '206',
    }, {
      year: '1995',
      datos: '183',
    }, {
      year: '1996',
      datos: '156',
    }, {
      year: '1997',
      datos: '130',
    }, {
      year: '1998',
      datos: '141',
    }, {
      year: '1999',
      datos: '138',
    }, {
      year: '2000',
      datos: '182',
    }, {
      year: '2001',
      datos: '199',
    }, {
      year: '2002',
      datos: '299',
    }, {
      year: '2003',
      datos: '344',
    }, {
      year: '2004',
      datos: '173',
    }, {
      year: '2005',
      datos: '319',
    }, {
      year: '2006',
      datos: '245',
    }, {
      year: '2007',
      datos: '253',
    }, {
      year: '2008',
      datos: '397',
    }, {
      year: '2009',
      datos: '254',
    }, {
      year: '2010',
      datos: '226',
    }, {
      year: '2011',
      datos: '167',
    }, {
      year: '2012',
      datos: '366',
    }, {
      year: '2013',
      datos: '478',
    }, {
      year: '2014',
      datos: '442',
    }, {
      year: '2015',
      datos: '449',
    }, {
      year: '2016',
      datos: '370',
    }, {
      year: '2017',
      datos: '379',
    }, {
      year: '2018',
      datos: '383',
    }, {
      year: '2019',
      datos: '368',
    }, {
      year: '2020',
      datos: '631',
    }, {
      year: '2021',
      datos: '433',
    }, {
      year: '2022',
      datos: '274',
    }, {
      year: '2023',
      datos: '36',
    }, {
      year: '2024',
      datos: '151',
    }
  ];
  newStaticDataSource: any = [];

  getData(value: YearsPeriod[]): void {
    if (value) {
      this.yearsSelected = value;
      this.yearsURL = `${this.yearsSelected[0]}-${this.yearsSelected[1]}`;
    } else {
      this.yearsSelected = ['1978', this.currentYear];
      this.yearsURL = `${this.yearsSelected[0]}-${this.yearsSelected[1]}`;
    }
  }

  ngOnInit(): void {
    this.getData(this.yearsSelected);

    //Usar esta query para comprobar la cantidad de datos antes de actualizarla
    //this.queryUrlYears = `https://opendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+eli%3A+%3Chttp%3A%2F%2Fdata.europa.eu%2Feli%2Fontology%23%3E+%0D%0A%0D%0Aselect+sum%28%3Fcnt%29++%3Fyear+where+%7B+%0D%0A%0D%0A+++%7B++%0D%0A%0D%0A+++++select+count%28distinct+%3Fitem%29+as+%3Fcnt+%3Ftipo++xsd%3Aint%28substr%28str%28%3Fbegin%29%2C+1%2C+4%29%29+as+%3Fyear+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E++where+%7B+%0D%0A%0D%0A++++++++%3Fitem+a+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23Dataset%3E%3B+%0D%0A%0D%0A+++++++++++++++++++dct%3Atemporal+%3Fx1.+%0D%0A%0D%0A%3Fx1+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimeInterval%3E+%3Fx2.+%0D%0A%0D%0AOPTIONAL+%7B+%0D%0A%0D%0A++%3Fx2+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimehasBeginning%3E+%3Fx3.+%0D%0A%0D%0A++%3Fx3+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimeInstant%3E+%3Fx4.+%0D%0A%0D%0A++%3Fx4+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimeinXSDDate%3E+%3Fbegin.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22Curso%22%29%29.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22+de+%22%29%29.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22+actual%22%29%29.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22Temporada%22%29%29.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22+Trim%22%29%29.+%0D%0A%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22%2F%22%29%29.+%0D%0A%0D%0A++FILTER%28%3Fbegin%21%3D%22*%22%5E%5E%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23date%3E%29.+%0D%0A%0D%0A%7D+%0D%0A%0D%0A++FILTER+%28%21BOUND%28%3Fbegin%29%7C%7C+xsd%3Aint%28substr%28str%28%3Fbegin%29%2C+1%2C+4%29%29+%3E%3D+1978%29.+%0D%0A%0D%0A++%0D%0A%0D%0A++++++++bind+%28%22dataset_ckan%22+as+%3Ftipo%29.+%0D%0A%0D%0A+++++%7D+%0D%0A%0D%0A++%7D+union+%7B+%0D%0A%0D%0A+++++select+count%28distinct+%3Fitem%29+as+%3Fcnt+%3Ftipo+%3Fyear+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B+%0D%0A%0D%0A++++++++%3Fitem+%3Chttp%3A%2F%2Fdata.europa.eu%2Feli%2Fontology%2Fdate_publication%3E+%3Fo%3B+%0D%0A%0D%0A++++++++++++++a+%3Chttp%3A%2F%2Fschema.org%2FCreativeWork%3E%3B+%0D%0A%0D%0A++++++++++++++dc%3Asource+%3Fvista.+%0D%0A%0D%0A++++++++values+%3Fvista+%7B+%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2Fb24502b9-6eea-4ac3-8cda-5d818008a6f5%2Fresource%2Fc46837eb-1093-40e1-9b3c-5f316e6a4f09%3E++%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2Faad6f487-fd9c-4339-9cae-f97f98b461ac%2Fresource%2F266cda84-1f2f-4971-8e60-1aa96bf31fb4%3E+%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2F46f113d7-9e72-437d-b5ad-5acb8cc00683%2Fresource%2Fb1eed8fd-2a89-4073-b2f0-dd6e07e214ee%3E%7D.+%0D%0A%0D%0A++%0D%0A%0D%0A++++++++bind+%28xsd%3Aint%28substr%28%3Fo%2C+1%2C4%29%29+as+%3Fyear%29.+%0D%0A%0D%0A++%0D%0A%0D%0A++++++++bind+%28%22archivoSIUa%22+as+%3Ftipo%29.+%0D%0A%0D%0A++++%7D+%0D%0A%0D%0A++%7D+union+%7B+%0D%0A%0D%0A+++++select+count%28distinct+%3Fitem%29+as+%3Fcnt+%3Ftipo+%3Fyear+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B+%0D%0A%0D%0A++++++++%3Fitem+%3Chttp%3A%2F%2Fdata.europa.eu%2Feli%2Fontology%2Fdate_publication%3E+%3Fo.+%0D%0A%0D%0A++++++++%3Fitem+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fprov%23wasUsedBy%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fprocedencia%2F84717AFC-5D08-7925-1181-FAE3DB3049F7%3E.+%0D%0A%0D%0A++%0D%0A%0D%0A++++++++bind+%28xsd%3Aint%28substr%28%3Fo%2C+1%2C4%29%29+as+%3Fyear%29.+%0D%0A%0D%0A++%0D%0A%0D%0A++++++++bind+%28%22archivoSIUa%22+as+%3Ftipo%29.+%0D%0A%0D%0A++++%7D+%0D%0A%0D%0A++%7D+union+%7B+%0D%0A%0D%0A+++++select+count%28distinct+%3Fitem3%29+as+%3Fcnt+%3Ftipo+%3Fyear+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B+%0D%0A%0D%0A++++++++%3Fitem+eli%3Adate_publication+%3Fo.+%0D%0A%0D%0A++++++++%3Fitem+eli%3Ais_realized_by+%3Fitem2.+%0D%0A%0D%0A++++++++%3Fitem2+eli%3Ais_embodied_by+%3Fitem3.++%0D%0A%0D%0A+++++++++%0D%0A%0D%0A++++++++FILTER+%28%3Fo+%3E%3D+%221978-01-01TZ%22%5E%5Exsd%3AdateTime%29.+%0D%0A%0D%0A++++++++bind+%28xsd%3Aint%28substr%28%3Fo%2C+1%2C4%29%29+as+%3Fyear%29.+%0D%0A%0D%0A++++++++bind+%28%22eli%22+as+%3Ftipo%29.+%0D%0A%0D%0A++++%7D+%0D%0A%0D%0A%7D+union+%7B+%0D%0A%0D%0A++++select+count%28distinct+%3Fdsd%29+as+%3Fcnt+%3Ftipo+xsd%3Aint%28%3Fyear%29+where+%7B+%0D%0A%0D%0A+++++++++%3Fobs+qb%3AdataSet+%3Fdataset.+%0D%0A%0D%0A+++++++++%3Fdataset+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23structure%3E+%3Fdsd.++%0D%0A%0D%0A+++++++++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.+%0D%0A%0D%0A+++++++++%3FrefPeriod+time%3AinXSDgYear+%3Fyear.+%0D%0A%0D%0A++%0D%0A%0D%0A+++++++++bind%28%22cubo_estadistico%22+as+%3Ftipo%29.+%0D%0A%0D%0A++++%7D+%0D%0A%0D%0A+++%7D+%0D%0A%0D%0A%7D+%0D%0A%0D%0Aorder+by+%3Fyear+&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
    
    
    this.queryUrlYears = 'https://opendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+eli%3A+%3Chttp%3A%2F%2Fdata.europa.eu%2Feli%2Fontology%23%3E%0D%0APREFIX+dct%3A+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%3E%0D%0A%0D%0Aselect+%3Fyear+%28count%28distinct+%3Fitem%29+as+%3Fcount%29+where+%7B%0D%0A++++%7B%0D%0A++++++++select+distinct+%3Fitem+xsd%3Aint%28substr%28str%28%3Fbegin%29%2C+1%2C+4%29%29+as+%3Fyear+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A++++++++++++%3Fitem+a+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23Dataset%3E%3B%0D%0A++++++++++++++++++dct%3Atemporal+%3Fx1.%0D%0A++++++++++++%3Fx1+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimeInterval%3E+%3Fx2.%0D%0A++++++++++++OPTIONAL+%7B%0D%0A++++++++++++++++%3Fx2+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimehasBeginning%3E+%3Fx3.%0D%0A++++++++++++++++%3Fx3+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimeInstant%3E+%3Fx4.%0D%0A++++++++++++++++%3Fx4+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimeinXSDDate%3E+%3Fbegin.%0D%0A++++++++++++++++FILTER%28%21regex%28%3Fbegin%2C+%22Curso%22%29%29.%0D%0A++++++++++++++++FILTER%28%21regex%28%3Fbegin%2C+%22+de+%22%29%29.%0D%0A++++++++++++++++FILTER%28%21regex%28%3Fbegin%2C+%22+actual%22%29%29.%0D%0A++++++++++++++++FILTER%28%21regex%28%3Fbegin%2C+%22Temporada%22%29%29.%0D%0A++++++++++++++++FILTER%28%21regex%28%3Fbegin%2C+%22+Trim%22%29%29.%0D%0A++++++++++++++++FILTER%28%21regex%28%3Fbegin%2C+%22%2F%22%29%29.%0D%0A++++++++++++++++FILTER%28%3Fbegin%21%3D%22*%22%5E%5E%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23date%3E%29.%0D%0A++++++++++++%7D%0D%0A++++++++++++FILTER+%28%21BOUND%28%3Fbegin%29+%7C%7C+%28xsd%3Aint%28substr%28str%28%3Fbegin%29%2C+1%2C+4%29%29+%3E%3D+1978+%26%26+xsd%3Aint%28substr%28str%28%3Fbegin%29%2C+1%2C+4%29%29+%3C%3D+2024%29%29.%0D%0A++++++++%7D%0D%0A++++%7D+union+%7B%0D%0A++++++++select+distinct+%3Fitem+xsd%3Aint%28substr%28%3Fo%2C+1%2C+4%29%29+as+%3Fyear+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A++++++++++++%3Fitem+%3Chttp%3A%2F%2Fdata.europa.eu%2Feli%2Fontology%2Fdate_publication%3E+%3Fo%3B%0D%0A++++++++++++++++++a+%3Chttp%3A%2F%2Fschema.org%2FCreativeWork%3E%3B%0D%0A++++++++++++++++++dc%3Asource+%3Fvista.%0D%0A++++++++++++values+%3Fvista+%7B+%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2Fb24502b9-6eea-4ac3-8cda-5d818008a6f5%2Fresource%2Fc46837eb-1093-40e1-9b3c-5f316e6a4f09%3E%0D%0A++++++++++++++++++++++++++++%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2Faad6f487-fd9c-4339-9cae-f97f98b461ac%2Fresource%2F266cda84-1f2f-4971-8e60-1aa96bf31fb4%3E%0D%0A++++++++++++++++++++++++++++%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2F46f113d7-9e72-437d-b5ad-5acb8cc00683%2Fresource%2Fb1eed8fd-2a89-4073-b2f0-dd6e07e214ee%3E%7D.%0D%0A++++++++++++FILTER+%28xsd%3Aint%28substr%28%3Fo%2C+1%2C+4%29%29+%3E%3D+1978+%26%26+xsd%3Aint%28substr%28%3Fo%2C+1%2C+4%29%29+%3C%3D+2024%29.%0D%0A++++++++%7D%0D%0A++++%7D+union+%7B%0D%0A++++++++select+distinct+%3Fitem+xsd%3Aint%28substr%28%3Fo%2C+1%2C+4%29%29+as+%3Fyear+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A++++++++++++%3Fitem+%3Chttp%3A%2F%2Fdata.europa.eu%2Feli%2Fontology%2Fdate_publication%3E+%3Fo.%0D%0A++++++++++++%3Fitem+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fprov%23wasUsedBy%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fprocedencia%2F84717AFC-5D08-7925-1181-FAE3DB3049F7%3E.%0D%0A++++++++++++FILTER+%28xsd%3Aint%28substr%28%3Fo%2C+1%2C+4%29%29+%3E%3D+1978+%26%26+xsd%3Aint%28substr%28%3Fo%2C+1%2C+4%29%29+%3C%3D+2024%29.%0D%0A++++++++%7D%0D%0A++++%7D+union+%7B%0D%0A++++++++select+distinct+%3Fitem3+as+%3Fitem+xsd%3Aint%28substr%28%3Fo%2C+1%2C+4%29%29+as+%3Fyear+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A++++++++++++%3Fitem+eli%3Adate_publication+%3Fo.%0D%0A++++++++++++%3Fitem+eli%3Ais_realized_by+%3Fitem2.%0D%0A++++++++++++%3Fitem2+eli%3Ais_embodied_by+%3Fitem3.%0D%0A++++++++++++FILTER+%28%3Fo+%3E%3D+%221978-01-01TZ%22%5E%5Exsd%3AdateTime+%26%26+xsd%3Aint%28substr%28%3Fo%2C+1%2C+4%29%29+%3C%3D+2024%29.%0D%0A++++++++%7D%0D%0A++++%7D+union+%7B%0D%0A++++++++select+distinct+%3Fdsd+as+%3Fitem+xsd%3Aint%28%3Fyear%29+as+%3Fyear+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A++++++++++++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A++++++++++++%3Fdataset+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23structure%3E+%3Fdsd.%0D%0A++++++++++++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A++++++++++++%3FrefPeriod+time%3AinXSDgYear+%3Fyear.%0D%0A++++++++++++FILTER+%28xsd%3Aint%28%3Fyear%29+%3E%3D+1978+%26%26+xsd%3Aint%28%3Fyear%29+%3C%3D+2024%29.%0D%0A++++++++%7D%0D%0A++++%7D%0D%0A%7D%0D%0Agroup+by+%3Fyear%0D%0Aorder+by+%3Fyear%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on'
    
    //Esta función tarda demasiado, si se puede agilizar, reutilizar
    this.timeLineSvc.getAllYears(this.queryUrlYears).subscribe(data => {
      const years = data?.results.bindings;
    
      // Filtra los elementos que tienen un año definido
      const filteredYears = years.filter((element: any) => element.year && element.year.value);
    
      const firstYear = filteredYears.find((element: any) => element?.year.value == '1978');
      const lastYear = filteredYears.find((element: any) => element?.year.value == this.currentYear);
      const filteredData = filteredYears.slice(filteredYears.indexOf(firstYear));
    
      filteredData.forEach((element: any, index: any) => {
        this.dataSource[index] = { date: element.year.value, dataQuantity: Number(element['count'].value) }
      });
    });
    /*
    this.staticDataSource.forEach((element: any, index: any) => {
      this.dataSource[index] = { date: element.year, dataQuantity: Number(element.datos) }
    });*/
  }

  accessibleSelect() {
    this.firstYear = this.firstYearSelected;
    if (this.firstYear) {
      const index = this.staticDataSource.findIndex(element => element.year === this.firstYear);
      this.newStaticDataSource = this.staticDataSource.slice(index);
      console.log(this.newStaticDataSource);
      this.accessibleError = false;
    }
    this.lastYear = this.lastYearSelected;
    this.yearsSelected = [this.firstYear, this.lastYear];
    this.yearsURL = `${this.yearsSelected[0]}-${this.yearsSelected[1]}`;

  }

}

@NgModule({
  imports: [
    BrowserModule,
    DxRangeSelectorModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  exports: [TimeLineComponent],
  declarations: [TimeLineComponent],
  bootstrap: [TimeLineComponent],
})
export class TimeLineModule {
}

// platformBrowserDynamic().bootstrapModule(TimeLineModule);