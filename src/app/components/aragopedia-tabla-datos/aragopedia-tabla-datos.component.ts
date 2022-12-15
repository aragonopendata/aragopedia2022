import { Component, NgModule, OnInit, Sanitizer } from '@angular/core';
import { AragopediaService } from './aragopediaService';
import { DomSanitizer } from '@angular/platform-browser';

interface DatosTabla {
  [key: string]: string;
}

@Component({
  selector: 'app-aragopedia-tabla-datos',
  templateUrl: './aragopedia-tabla-datos.component.html',
  styleUrls: ['./aragopedia-tabla-datos.component.scss'],

})
export class AragopediaTablaDatosComponent {

  constructor(public aragopediaSvc: AragopediaService, private sanitizer: DomSanitizer) { }

  displayedColumns!: string[];
  queryAragopedia!: string;
  queryAragopediaCSV!: string;
  linkDescargaJSON!: any;
  linkDescargaCSV!: any;
  tablaConsulta!: Array<any>;
  tablaDibujable!: any;
  stringelementonameref!: any;

  ngOnInit() {
    this.queryAragopedia = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FrefArea+%3FnameRefArea+%3FrefPeriod+%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F%22%29+AS+%3FnameRefPeriod%29+sum+%28%3Fpoblacion+%29+as+%3Fpoblacion++++where+%7B%0D%0A+%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001A%3E.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0AFILTER+%28%3FrefPeriod+IN+%28%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F1996%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F1997%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F1998%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F1999%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2000%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2001%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2002%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2003%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2004%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2005%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2006%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2007%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2008%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2009%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2010%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2011%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2012%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2013%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2014%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2015%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2016%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2017%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2018%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2019%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2020%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23poblacion%3E+%3Fpoblacion++%7D+.%0D%0A%7D+%0D%0A+GROUP+by+%3FrefArea+%3FnameRefArea+%3FrefPeriod+ORDER+BY+ASC%28%3FrefArea%29+DESC%28%3FrefPeriod%29%0D%0ALIMIT+300&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
    this.queryAragopediaCSV = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FrefArea+%3FnameRefArea+%3FrefPeriod+%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F%22%29+AS+%3FnameRefPeriod%29+sum+%28%3Fpoblacion+%29+as+%3Fpoblacion++++where+%7B%0D%0A+%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001A%3E.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0AFILTER+%28%3FrefPeriod+IN+%28%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F1996%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F1997%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F1998%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F1999%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2000%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2001%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2002%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2003%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2004%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2005%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2006%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2007%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2008%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2009%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2010%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2011%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2012%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2013%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2014%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2015%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2016%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2017%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2018%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2019%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2020%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23poblacion%3E+%3Fpoblacion++%7D+.%0D%0A%7D+%0D%0A+GROUP+by+%3FrefArea+%3FnameRefArea+%3FrefPeriod+ORDER+BY+ASC%28%3FrefArea%29+DESC%28%3FrefPeriod%29%0D%0ALIMIT+300&format=application%2Fsparql-results%csv&timeout=0&signal_void=on`;

    this.linkDescargaCSV = this.sanitizer.bypassSecurityTrustUrl(this.queryAragopediaCSV);

    this.aragopediaSvc.getData(this.queryAragopedia).subscribe((data: any) => {

      var tipodato: any = data.results.bindings;
      var dato = data.results.bindings[0]

      Object.keys(dato).forEach(key => {
        if (dato[key].value.startsWith("http")) {
          delete dato[key];
        }
      })

      this.displayedColumns = Object.keys(dato);

      const blobConfigJSON = new Blob(
        [JSON.stringify(data.results.bindings)],
        { type: 'text/json;charset=utf-8' }
      )

      this.linkDescargaJSON = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blobConfigJSON));
      this.tablaConsulta = data.results.bindings;
    })

  }

  getKeys(element: any, columna: string): string {

    let value: string = element?.[columna].value;

    if (value.startsWith("http")) {
      value = "-1";
    }

    return value;
  }

  showColumn(columna: string): object {
    if (this.tablaConsulta[0]?.[columna].value.startsWith("http")) {
      return { 'display': "none" };
    } else {
      return {};
    }

  }

  setColumnName(columna: string): string {
    return "columna" + columna;
  }

}


