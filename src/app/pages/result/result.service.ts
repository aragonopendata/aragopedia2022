import { Injectable } from "@angular/core";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";

const headers = new HttpHeaders()
    .set('content-type', 'image/png')
    .set('Access-Control-Allow-Origin', '*');

@Injectable({
    providedIn: "root"
})

export class ResultService {
    constructor(private http: HttpClient, public _route: ActivatedRoute) { }

    queryUrlIncendios: string = ''

    public getDensidadData(query: string): Observable<any> {
        return this.http.get(query);
    }

    public getPoblacionData(query: string): Observable<any> {
        return this.http.get(query);
    }

    public getSueloUrbanoData(query: string): Observable<any> {
        return this.http.get(query);
    }

    public getPoligonos(query: string): Observable<any> {
        return this.http.get(query)
    }

    public getDatosContacto(query: string): Observable<any> {
        return this.http.get(query);
    }

    public getCreativeWorkd(query: string): Observable<any> {
        return this.http.get(query);
    }

    public getMiembrosPleno(query: string): Observable<any> {
        return this.http.get(query);
    }

    public getAlojamientosTuristicos(query: string): Observable<any> {
        return this.http.get(query);
    }

    public getOficinasTurismo(query: string): Observable<any> {
        return this.http.get(query);
    }

    public getRatioSuelo(query: string): Observable<any> {
        return this.http.get(query);
    }

}