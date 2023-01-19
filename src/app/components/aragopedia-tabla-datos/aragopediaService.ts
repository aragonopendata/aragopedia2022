import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from "rxjs";

class Prefix {
    prefix!: string;
    namespace!: string;
}
@Injectable({
    providedIn: "root"
})


export class AragopediaService {

    queryTemas!: string;
    queryTemasObserver: Subject<string> = new Subject<string>();

    columnasTabla!: any;
    columnasTablaObserver: Subject<string> = new Subject<string>();

    triggerSubmit: string = '';
    triggerSubmitObserver: Subject<string> = new Subject<string>();

    lastZona: string = '';

    constructor(private http: HttpClient) {

    }

    // host: string = '';
    // repository: string = '';
    // PREFIXES: Array<Prefix> = [
    //     { prefix: '', namespace: '' }
    // ]

    change(query: string) {
        this.queryTemas = query;
        this.queryTemasObserver.next(this.queryTemas);
    }

    changeColumnas(columnas: any) {
        this.columnasTabla = columnas;

        this.columnasTablaObserver.next(this.columnasTabla);
    }

    changeTriggerSubmitObserver(tipoZona: string) {

        this.triggerSubmitObserver.next(tipoZona)
    }

    // getTables() {
    //     let selectString = `

    //     `;
    //     let query = "select distinct ?value where {\n";
    //     query += "{ ?obs0 a qb:Observation .\n";

    // }

    public getData(query: string): Observable<any> {
        return this.http.get(query);
    }

}