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

    queryUrlPoligonos: string = 'https://opendata.aragon.es/sparql?default-graph-uri=http%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2&query=select++distinct+count%28%3Fs%29+where+%7B%0D%0A%3Fs+%3Fp+%3Fo%3B%0D%0A++++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23linkedTo%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fmunicipio%2F22048%3E%3B%0D%0A++++ns%3AwasUsedBy+%3Fproc.%0D%0A%3Fproc+ns%3AwasAssociatedWith+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F104%3E.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on'

    queryUrlContacto: string = 'https://opendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0D%0APREFIX+ns%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fprov%23%3E%0D%0APREFIX+vcard%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23%3E%0D%0A%0D%0ASELECT+%3Femail+%3Ftel+%3Ffax+%3Fdireccion+%3FcodPostal+%0D%0AFROM+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E%0D%0AWHERE+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fmunicipio%2F50001%3E+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23hasSite%3E+%3FsiteAddress%3B%0D%0A+++++++ns%3AwasUsedBy+%3Fprocedencia.+%0D%0A++++++%3Fprocedencia+ns%3AwasAssociatedWith+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F11%3E.+%0D%0A%0D%0A++%3FsiteAddress+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23siteAddress%3E+%3Faddress2.%0D%0A%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Aemail+%3Femail+%7D.%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Atel+%3Ftel+%7D.%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Afax+%3Ffax+%7D.%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Astreet-address%3Fdireccion+%7D.%0D%0A+++OPTIONAL+%7B%3Faddress2+vcard%3Apostal-code+%3FcodPostal+%7D.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';

    queryUrlCreativeWork: string = 'https://opendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+schema%3A+%3Chttp%3A%2F%2Fschema.org%2F%3E%0D%0A%0D%0Aselect+%3Ftitle+%3Furl+%3Ftema%0D%0Awhere+%7B%0D%0A++%3Fs+a+schema%3ACreativeWork%3B%0D%0A+++++++schema%3Aabout+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FMunicipio%2FAbabuj%3E%3B%0D%0A+++++++schema%3Atitle+%3Ftitle%3B%0D%0A+++++++schema%3Aurl+%3Furl%3B%0D%0A+++++++schema%3Aconcept+%3Ftema.%0D%0A%7D%0D%0Alimit+10&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';

    queryUrlMiembrosPleno: string = 'https://opendata.aragon.es/sparql?default-graph-uri=http%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2&query=select++distinct+%3Fpersona+%3Fcargo+%3FnombrePersona+where+%7B%0D%0A%3Fpuesto+%3Fp+%3Fo%3B%0D%0A+++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23role%3E+%3Frol%3B%0D%0A+++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23postIn%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fmunicipio%2F22048%3E%3B%0D%0A++++ns%3AwasUsedBy+%3Fproc.%0D%0A%3Frol+dc%3Atitle+%3Fcargo.%0D%0A%3Fpersona+++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23holds%3E+%3Fpuesto.%0D%0AOPTIONAL+%7B+%3Fpersona+%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2Fname%3E+%3FnombrePersona.+%7D%0D%0A%3Fproc+ns%3AwasAssociatedWith+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F3%3E.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';

    queryUrlIncendios: string = ''

    queryUrlAlojamientosTuristicos: string = 'https://opendata.aragon.es/sparql?default-graph-uri=http%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2&query=select++distinct+count%28%3Fs%29+where+%7B%0D%0A%3Fs+%3Fp+%3Fo%3B%0D%0A++++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23linkedTo%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fmunicipio%2F44001%3E%3B%0D%0A++++ns%3AwasUsedBy+%3Fproc.%0D%0A%3Fproc+ns%3AwasAssociatedWith+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F73%3E.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';

    queryUrlOficinasTurismo: string = 'https://opendata.aragon.es/sparql?default-graph-uri=http%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2&query=select++distinct+count%28%3Fs%29+where+%7B%0D%0A%3Fs+%3Fp+%3Fo%3B%0D%0A++++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23linkedTo%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fmunicipio%2F44001%3E%3B%0D%0A++++ns%3AwasUsedBy+%3Fproc.%0D%0A%3Fproc+ns%3AwasAssociatedWith+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F70%3E.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';


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

    public getPoligonos(): Observable<any> {
        return this.http.get(this.queryUrlPoligonos)
    }

    public getDatosContacto(): Observable<any> {
        return this.http.get(this.queryUrlContacto);
    }

    public getCreativeWorkd(): Observable<any> {
        return this.http.get(this.queryUrlCreativeWork);
    }

    public getMiembrosPleno(): Observable<any> {
        return this.http.get(this.queryUrlMiembrosPleno);
    }

    public getAlojamientosTuristicos(): Observable<any> {
        return this.http.get(this.queryUrlAlojamientosTuristicos);
    }

    public getOficinasTurismo(): Observable<any> {
        return this.http.get(this.queryUrlAlojamientosTuristicos);
    }


}