import { NgModule, Component, OnInit } from '@angular/core';
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
  temp = undefined;
  allYearsData: any;
  queryUrlYears!: string;
  firstYear: any;
  lastYear: any;
  // dataSource!: YearsPeriod[]
  dataSource = this.temp || [{}]

  getData(value: YearsPeriod[]): void {
    this.timeLineSvc.setCurrentYears(value);
  }

  ngOnInit(): void {
    this.queryUrlYears = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+sum%28%3Fcont%29+xsd%3Aint%28%3Fanyo%29+where+%7B%0D%0A+++%7B+%0D%0A+++++select+count%28+%3Fs%29+as+%3Fcont+%28str%28substr%28%3Fo%2C+1%2C4%29%29%29++as+%3Fanyo+where+%7B%0D%0A++++++++%3Fs+a+%3Ftipo.%0D%0A++++++++%3Fs+%3Ftempo+%3Fo.%0D%0A++++++++values+%3Ftempo+%7B+%3Chttp%3A%2F%2Fdata.europa.eu%2Feli%2Fontology%2Ffirst_date_entry_in_force%3E+%3Chttp%3A%2F%2Fschema.org%2FdatePublished%3E%7D.%0D%0A++++%7D%0D%0A++++group+by+str%28substr%28%3Fo%2C+1%2C4%29%29+%3Ftempo%0D%0A+%7D+union+%7B%0D%0A++++select+count%28%3Fx%29+as+%3Fcont+str%28substr%28str%28%3Ffecha%29%2C1%2C4%29%29+as+%3Fanyo+where+%7B%0D%0A++++++%3Fx+a+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23Dataset%3E%3B%0D%0A++++++%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Fmodified%3E+%3Ffecha%0D%0A++++%7D%0D%0A++++group+by+substr%28str%28%3Ffecha%29%2C1%2C4%29%0D%0A+%7D+union+%7B%0D%0A+++select+sum%28%3Fcnt%29+as+%3Fcont+substr%28replace%28replace%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2F%22%29%2C+%22month%2F%22%2C+%22%22%29%2C+%22year%2F%22%2C+%22%22%29%2C+1%2C+4%29+as+%3Fanyo++++%0D%0A+++where+%7B%0D%0A+++++select+count%28distinct+%3Fdsd%29+as+%3Fcnt+%3FrefPeriod%0D%0A++++++where+%7B%0D%0A+++++++++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++++++++%3Fdataset+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23structure%3E+%3Fdsd.+%0D%0A+++++++++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A++++++%7D+%0D%0A+++++group+by+%3FrefPeriod%0D%0A++++%7D%0D%0A++++group+by+substr%28replace%28replace%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2F%22%29%2C+%22month%2F%22%2C+%22%22%29%2C+%22year%2F%22%2C+%22%22%29%2C+1%2C+4%29%0D%0A++%7D%0D%0A%7D%0D%0Agroup+by+xsd%3Aint%28%3Fanyo%29%0D%0Aorder+by+xsd%3Aint%28%3Fanyo%29&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

    this.timeLineSvc.getAllYears(this.queryUrlYears).subscribe(data => {
      const years = data.results.bindings;
      const firstYear = years.find((element: any) => element['callret-1'].value == '1978');
      const lastYear = years.find((element: any) => element['callret-1'].value == '2022');
      const filteredData = years.slice(years.indexOf(firstYear), years.indexOf(lastYear + 1));
      filteredData.forEach((element: any, index: any) => {
        this.dataSource[index] = { date: element['callret-1'].value, dataQuantity: element['callret-0'].value }
      });
    });


  }

  constructor(private timeLineSvc: TimeLineSvc) {
  }


}

@NgModule({
  imports: [
    BrowserModule,
    DxRangeSelectorModule,
  ],
  exports: [TimeLineComponent],
  declarations: [TimeLineComponent],
  bootstrap: [TimeLineComponent],
})
export class TimeLineModule {
}



platformBrowserDynamic().bootstrapModule(TimeLineModule);