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
    queryTemasReady: boolean = false;
    queryTemasObserver: Subject<string> = new Subject<string>();

    constructor(private http: HttpClient) {

    }

    host: string = '';
    repository: string = '';
    PREFIXES: Array<Prefix> = [
        { prefix: '', namespace: '' }
    ]

    change(query: string) {
        this.queryTemas = query;
        console.log(this.queryTemas)
        this.queryTemasObserver.next(this.queryTemas);
    }


    getTables() {
        let selectString = `
        
        `;
        let query = "select distinct ?value where {\n";
        query += "{ ?obs0 a qb:Observation .\n";

    }

    public getData(query: string): Observable<any> {
        return this.http.get(query);
    }

}