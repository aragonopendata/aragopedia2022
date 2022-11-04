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
    queryUrlDensidadPoblacion: string = "https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FrefArea+%3FnameRefArea+%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F%22%29+AS+%3FnameRefPeriod%29++%3Fdensidad_de_poblacion_habkm2+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++FILTER%28%3Fdataset+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F02-020001TM%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+FILTER+%28%3FrefPeriod+IN+%28%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2016%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2017%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2018%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2019%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2020%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2021%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+%0D%0A+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0A+BIND+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FMunicipio%2FAbabuj%3E+AS+%3Fmuni%29.%0D%0A+FILTER+%28%3FrefArea+IN+%28%3Fmuni%29%29.%0D%0AOPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23densidad-de-poblacion-habkm2%3E+%3Fdensidad_de_poblacion_habkm2++%7D+.%0D%0A%7D%0D%0Aorder+by++desc%28%3FrefPeriod%29%0D%0ALIMIT+1%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on";
    queryUrlSueloUrbano: string = "https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+xsd%3Aint%28%3Frust%29+as+%3Frustico+xsd%3Aint%28%3Furba%29+as+%3Furbano+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++FILTER%28%3Fdataset+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019A%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019TC%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019TM%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+FILTER+%28%3FrefPeriod+IN+%28%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2018%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2019%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2020%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2021%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+%0D%0A+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0A+BIND+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FMunicipio%2FAbabuj%3E+AS+%3Fmuni%29.%0D%0A+%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComarca%3E+%3Fcomarca.%0D%0A+%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComunidadAutonoma%3E+%3Fccaa.%0D%0A+FILTER+%28%3FrefArea+IN+%28%3Fmuni%2C+%3Fccaa%29%29.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23rustico-superficie%3E+%3Frust++%7D+.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23urbano-superficie%3E+%3Furba++%7D+.%0D%0A%7D%0D%0AORDER+BY+desc%28%3FrefPeriod%29%2C%3FrefArea%0D%0ALIMIT+2%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on";
    queryUrlPoblacion: string = "https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FrefArea+%3FnameRefArea+%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F%22%29+AS+%3FnameRefPeriod%29+xsd%3Aint%28%3Fpoblacion%29+as+%3Fpoblac+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++FILTER%28%3Fdataset+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001A%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001TC%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001TM%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+FILTER+%28%3FrefPeriod+IN+%28%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2017%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2018%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2019%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2020%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2021%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+%0D%0A+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0A+BIND+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FMunicipio%2FAbabuj%3E+AS+%3Fmuni%29.%0D%0A+%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComarca%3E+%3Fcomarca.%0D%0A+%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComunidadAutonoma%3E+%3Fccaa.%0D%0A+FILTER+%28%3FrefArea+IN+%28%3Fmuni%2C+%3Fcomarca%2C+%3Fccaa%29%29.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23poblacion%3E+%3Fpoblacion++%7D+.%0D%0A%7D%0D%0AORDER+BY+%3FrefArea%2C+desc%28%3FrefPeriod%29%0D%0ALIMIT+15%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on";

    density!: number;

    constructor(private http: HttpClient) { }

    public getDensidadData(): Observable<any> {
        return this.http.get(this.queryUrlDensidadPoblacion);
    }

    public getPoblacionData(): Observable<any> {
        return this.http.get(this.queryUrlPoblacion);
    }

    public getSueloUrbanoData(): Observable<any> {
        return this.http.get(this.queryUrlSueloUrbano);
    }
}