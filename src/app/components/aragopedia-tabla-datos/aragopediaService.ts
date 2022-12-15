import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})

export class AragopediaService {
    constructor(private http: HttpClient) { }

    public getData(query: string): Observable<any> {
        return this.http.get(query);
    }
}