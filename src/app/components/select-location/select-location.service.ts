import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class SelectLocationService {


    comarcasURL: string = 'https://opendata.aragon.es/sparql?default-graph-uri=&query=select++str%28%3Fnombre%29%0D%0Awhere++%7B%0D%0A++++++++++++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23type%3E++%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2FGovernmentalAdministrativeRegion%3E+.+%0D%0A++++++++++++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23label%3E+%3Fnombre.%0D%0A++++++++++++%3Fs+a+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23Comarca%3E.%0D%0A%7D%0D%0Aorder+by+asc%28%3Fs%29+&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';
    municipiosURL: string = 'https://opendata.aragon.es/sparql?default-graph-uri=&query=select+str%28%3Fnombre%29%0D%0Awhere++%7B%0D%0A++++++++++++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23type%3E++%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2FGovernmentalAdministrativeRegion%3E+.+%0D%0A++++++++++++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23label%3E+%3Fnombre.%0D%0A++++++++++++%3Fs+a+dbo%3AMunicipality.%0D%0A%7D%0D%0Aorder+by+asc%28%3Fs%29+&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';



    constructor(private http: HttpClient) { }

    getComarcas() {
        return this.http.get(this.comarcasURL)
            .pipe(
                map((response: any) => response.results.bindings.map((item: any) => item['callret-0'].value))
            )
    }

    getMunicipios() {
        return this.http.get(this.municipiosURL)
            .pipe(
                map((response: any) => response.results.bindings.map((item: any) => item['callret-0'].value))
            )
    }

    getData(query: string): Observable<any> {
        return this.http.get(query);
    }
}