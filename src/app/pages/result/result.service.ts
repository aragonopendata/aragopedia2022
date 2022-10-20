import { Injectable } from "@angular/core";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

const headers = new HttpHeaders()
    .set('content-type', 'image/png')
    .set('Access-Control-Allow-Origin', '*');


@Injectable({
    providedIn: "root"
})

export class ResultService {
    // queryUrl: string = "https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FrefArea+%3FnameRefArea+%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F%22%29+AS+%3FnameRefPeriod%29++%3Fdensidad_de_poblacion_habkm2+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++FILTER%28%3Fdataset+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F02-020001TM%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+FILTER+%28%3FrefPeriod+IN+%28%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2016%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2017%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2018%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2019%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2020%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2021%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+%0D%0A+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0A+BIND+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FMunicipio%2FAbabuj%3E+AS+%3Fmuni%29.%0D%0A+FILTER+%28%3FrefArea+IN+%28%3Fmuni%29%29.%0D%0AOPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23densidad-de-poblacion-habkm2%3E+%3Fdensidad_de_poblacion_habkm2++%7D+.%0D%0A%7D%0D%0Aorder+by++desc%28%3FrefPeriod%29%0D%0ALIMIT+1%0D%0A&format=text%2Fhtml&timeout=0&signal_void=on"

    // constructor(private http: HttpClient) { }

    // getData() {
    //     this.http.get(this.queryUrl).subscribe(data => {
    //         console.log(data);
    //     });
    // }
}