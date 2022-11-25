import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})

export class PersonaService {

    constructor(private http: HttpClient) { };

    getData(query: string) {
        this.http.get(query);
    }
}
