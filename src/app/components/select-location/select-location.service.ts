import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class SelectLocationService {

    comarcasURL: string = 'https://opendata.aragon.es/sparql?default-graph-uri=http%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2&query=select+distinct+%3Fnombre+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A%3Fx+a+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23Organization%3E%3B%0D%0A++++++dc%3Atitle+%3Fnombre.%0D%0Afilter%28regex%28%3Fx+%2C+%22http%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fcomarca%2F%22%29%29%0D%0A%7D%0D%0Aorder+by+%3Fnombre&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';

    municipiosURL: string = 'https://opendata.aragon.es/sparql?default-graph-uri=http%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2&query=select+distinct+%3Fnombre+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A%3Fx+a+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23Organization%3E%3B%0D%0A++++++dc%3Atitle+%3Fnombre.%0D%0Afilter%28ucase%28%3Fnombre%29%21%3D%3Fnombre%29.%0D%0Afilter%28regex%28%3Fx+%2C+%22http%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fmunicipio%2F%22%29%29%0D%0A%7D%0D%0Aorder+by+%3Fnombre&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';



    constructor(private http: HttpClient) { }

    getComarcas() {
        return this.http.get(this.comarcasURL)
            .pipe(
                map((response: any) => response.results.bindings.map((item: any) => this.capitalizeString(item.nombre.value)))
            )
    }

    getMunicipios() {
        return this.http.get(this.municipiosURL)
            .pipe(
                map((response: any) => response.results.bindings.map((item: any) => item.nombre.value))
            )
    }

    getData(query: string): Observable<any> {
        return this.http.get(query);
    }

    capitalizeString(str: any): string {
        return str.replace(/\w\S*/g, function (txt: any) {
            const lowerTxt = txt.toLowerCase();
            if (lowerTxt === 'el' || lowerTxt === 'y' || lowerTxt === 'del' ||
                lowerTxt === 'de' || lowerTxt === 'las' || lowerTxt === 'la' || lowerTxt === 'los') {
                return lowerTxt;
            } else {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        });
    }
}