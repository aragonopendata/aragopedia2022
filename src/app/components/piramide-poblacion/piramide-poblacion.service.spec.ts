import { Injectable } from "@angular/core";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

const headers = new HttpHeaders()
  .set('content-type', 'image/png')
  .set('Access-Control-Allow-Origin', '*');


@Injectable({
  providedIn: "root"
})

export class PiramidePoblacionService {

  constructor(private http: HttpClient) { }

  public getPiramidePoblacion(query: string): Observable<any> {
    return this.http.get(query);
  }

}