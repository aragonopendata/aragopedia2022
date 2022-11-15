import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Injectable({
    providedIn: "root"
})

export class ResultService {
    constructor(private http: HttpClient, public _route: ActivatedRoute) { }

    public getData(query: string): Observable<any> {
        return this.http.get(query);
    }
}