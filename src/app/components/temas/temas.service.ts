import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TemasService {
    constructor(private http: HttpClient) { }

    // getTemas(): Observable<any> {
    //     return this.http.get(this.temasURL);
    // }

    getResults(query: string): Observable<any> {
        return this.http.get(query);
    }

}