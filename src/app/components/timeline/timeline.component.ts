import { NgModule, Component, OnInit, Input, HostListener } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxRangeSelectorModule } from 'devextreme-angular';
import { TimeLineSvc, YearsPeriod } from './timeline.service';


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
  currentYear: string = (new Date().getFullYear()).toString();

  @Input() yearsSelected: any;
  @Input() yearsURL: string = ``;

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
    this.queryUrlYears = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+sum%28%3Fcont%29+xsd%3Aint%28%3Fanyo%29+where+%7B%0D%0A+++%7B%0D%0A+++++select+count%28distinct+%3Fs%29+as+%3Fcont+%28str%28substr%28%3Fo%2C+1%2C4%29%29%29++as+%3Fanyo+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A++++++++%3Fs+a+%3Ftipo.%0D%0A++++++++%3Fs+%3Ftempo+%3Fo.%0D%0A++++++++values+%3Ftempo+%7B+%3Chttp%3A%2F%2Fdata.europa.eu%2Feli%2Fontology%2Ffirst_date_entry_in_force%3E+%3Chttp%3A%2F%2Fschema.org%2FdatePublished%3E%7D.%0D%0A++++%7D%0D%0A++++group+by+str%28substr%28%3Fo%2C+1%2C4%29%29+%3Ftempo%0D%0A%7D+union+%7B%0D%0A+++++select+count%28distinct+%3Fitem%29+as+%3Fcont+%3Fyear+as+%3Fanyo+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A++++++++%3Fitem+%3Ftempo+%3Fo.%0D%0A++++++++%3Fitem+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fprov%23wasUsedBy%3E+%3Fproc.%0D%0A++++++++%3Fproc+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fprov%23wasAssociatedWith%3E+%3Fvista.%0D%0A++++++++values+%3Fvista+%7B+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F74%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F76%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F77%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F30%3E%7D.%0D%0A++++++++values+%3Ftempo+%7B+%3Chttp%3A%2F%2Fdata.europa.eu%2Feli%2Fontology%2Fdate_publication%3E++%7D.%0D%0A%0D%0A++++++++bind+%28xsd%3Aint%28substr%28%3Fo%2C+1%2C4%29%29+as+%3Fyear%29.%0D%0A++++%7D%0D%0A++++group+by+%3Fyear%0D%0A+%7D+union+%7B%0D%0A++++select+count%28distinct+%3Fx%29+as+%3Fcont+str%28substr%28str%28%3Fbegin%29%2C1%2C4%29%29+as+%3Fanyo+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A++++++%3Fx+a+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23Dataset%3E%3B%0D%0A+++++++++++++++++dct%3Atemporal+%3Fx1.%0D%0A%3Fx1+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimeInterval%3E+%3Fx2.%0D%0A++%3Fx2+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimehasBeginning%3E+%3Fx3.%0D%0A++%3Fx3+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimeInstant%3E+%3Fx4.%0D%0A++%3Fx4+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2FtimeinXSDDate%3E+%3Fbegin.%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22Curso%22%29%29.%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22+de+%22%29%29.%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22+actual%22%29%29.%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22Temporada%22%29%29.%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22+Trim%22%29%29.%0D%0A++FILTER%28%21+regex%28%3Fbegin%2C+%22%2F%22%29%29.%0D%0A++FILTER%28%3Fbegin%21%3D%22*%22%5E%5E%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23date%3E%29.%0D%0A%0D%0A++++%7D%0D%0A++++group+by+substr%28str%28%3Fbegin%29%2C1%2C4%29%0D%0A+%7D+union+%7B%0D%0A+++++select+count%28distinct+%3Fdsd%29+as+%3Fcont+xsd%3Aint%28%3Fyear%29+as+%3Fanyo%0D%0A+++++where+%7B%0D%0A+++++++++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++++++++%3Fdataset+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23structure%3E+%3Fdsd.%0D%0A+++++++++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+++++++++%3FrefPeriod+time%3AinXSDgYear+%3Fyear%0D%0A++++++%7D%0D%0A+++++group+by+%3Fyear%0D%0A++%7D%0D%0A%7D%0D%0Agroup+by+xsd%3Aint%28%3Fanyo%29%0D%0Aorder+by+xsd%3Aint%28%3Fanyo%29%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

    this.timeLineSvc.getAllYears(this.queryUrlYears).subscribe(data => {
      const years = data.results.bindings;
      const firstYear = years.find((element: any) => element['callret-1'].value == '1978');
      const lastYear = years.find((element: any) => element['callret-1'].value == this.currentYear);
      const filteredData = years.slice(years.indexOf(firstYear), years.indexOf(lastYear + 1));
      filteredData.forEach((element: any, index: any) => {
        this.dataSource[index] = { date: element['callret-1'].value, dataQuantity: Number(element['callret-0'].value) }
      });
    });
  }

}

@NgModule({
  imports: [
    BrowserModule,
    DxRangeSelectorModule,
    MatProgressSpinnerModule
  ],
  exports: [TimeLineComponent],
  declarations: [TimeLineComponent],
  bootstrap: [TimeLineComponent],
})
export class TimeLineModule {
}

// platformBrowserDynamic().bootstrapModule(TimeLineModule);