import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TemasService {
    constructor(private http: HttpClient) { }

    private temasURL: string = 'https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+count%28*%29+%3Ftema+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%3Fs+a+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23Organization%3E%3B%0D%0A++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fprov%23wasUsedBy%3E+%3Fprov.%0D%0A++%3Fprov+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fprov%23wasAssociatedWith%3E+%3Fvista.%0D%0A++%3Fvista++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23distribution%3E+%09%3Fdistrib.%0D%0A++%3Fvista+a+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23Dataset%3E.%0D%0A++%3Fdataset++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23distribution%3E+%09%3Fdistrib.%0D%0A++%3Fdataset++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%3E+%3Ftema.+%0D%0A%7D+%0D%0Agroup+by+%3Ftema%0D%0Alimit+200&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';

    getTemas(): Observable<any> {
        return this.http.get(this.temasURL);
    }
}