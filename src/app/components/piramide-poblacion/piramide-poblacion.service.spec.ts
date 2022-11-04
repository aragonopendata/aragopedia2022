import { Injectable } from "@angular/core";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

const headers = new HttpHeaders()
  .set('content-type', 'image/png')
  .set('Access-Control-Allow-Origin', '*');


@Injectable({
  providedIn: "root"
})

export class PiramidePoblacionService {

  queryPiramidePoblacion: string = "https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FrefArea+%3FnameRefArea+%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F%22%29+AS+%3FnameRefPeriod%29+%3Fgrupo+%3Fsexo+xsd%3Aint%28%3Fvalor%29+as+%3Fpersonas+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++FILTER%28%3Fdataset+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030018TM%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+FILTER+%28%3FrefPeriod+IN+%28%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2011%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+%0D%0A+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0A+BIND+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FMunicipio%2FAbabuj%3E+AS+%3Fmuni%29.%0D%0A+FILTER+%28%3FrefArea+IN+%28%3Fmuni%29%29.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fdimension%23sexo%3E+%3FsexoVal++%7D+.%0D%0A+%3FsexoVal+skos%3AprefLabel+%3Fsexo.%0D%0AFILTER+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Fkos%2Fiaest%2Fsexo%2Fmujeres%3E+AS+%3FsexoVal%29.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fdimension%23edad-grupos-quinquenales%3E+%3FgrupoVal++%7D+.%0D%0A+%3FgrupoVal+skos%3AprefLabel+%3Fgrupo.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23personas%3E+%3Fvalor+%7D+.%0D%0A%7D%0D%0AORDER+BY++desc%28%3FrefPeriod%29%2Cdesc%28%3Fgrupo%29%2C+%3Fsexo%0D%0ALIMIT+200&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on";

  constructor(private http: HttpClient) { }

  public getPiramidePoblacion(): Observable<any> {
    return this.http.get(this.queryPiramidePoblacion);
  }

}