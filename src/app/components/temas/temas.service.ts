import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TemasService {
    constructor(private http: HttpClient) { }

    private temasURL: string = 'https://opendata.aragon.es/sparql?default-graph-uri=&query=select+sum%28%3Fcnt%29+%3Ftipo+%3FlabelTema+%3FuriTema+where%0D%0A%7B%0D%0A%3FuriTema+a+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23Concept%3E%3B%0D%0A++++%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23prefLabel%3E+%3FlabelTema%3B%0D%0A++++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fprov%23wasUsedBy%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fprocedencia%2FE2F7D8F3-6578-15FA-D429-F957DC7D61EF%3E.%0D%0A%7B%0D%0Aselect+distinct+count%28distinct+%3Fs%29+as+%3Fcnt+%3Ftipo++%3FlabelTema+%7B%0D%0A%3Fs+%3FpTema+%3Ftema.%0D%0A%3Fs+a+%3Ftipo.%0D%0A%3Ftema+skos%3AprefLabel+%3FlabelTema.%0D%0A%0D%0A+VALUES+%3FpTema+%7B+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23classification%3E+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%3E+%7D.%0D%0A%0D%0AVALUES+%3Ftipo+%7B+%0D%0A%3Chttp%3A%2F%2Fschema.org%2FCreativeWork%3E%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23Dataset%3E%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23Organization%3E%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23Location%3E%0D%0A%3Chttp%3A%2F%2Fschema.org%2FEvent%3E%0D%0A%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23dataSet%3E%0D%0A%7D%0D%0A%7D%0D%0Agroup+by+%3Ftipo+%3FlabelTema%0D%0A%7D%0D%0Aunion%0D%0A%7B%0D%0Aselect+distinct+count%28distinct+%3Fs%29+as+%3Fcnt+%3Ftipo++%3FlabelTema+%7B%0D%0A%3Fs+%3FpTema+%3FlabelTema.%0D%0A%3Fs+a+%3Ftipo.%0D%0A%0D%0A+VALUES+%3FpTema+%7B++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%3E+%7D.%0D%0A%0D%0AVALUES+%3Ftipo+%7B+%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23Dataset%3E%0D%0A%7D%0D%0A%7D%0D%0Agroup+by+%3Ftipo+%3FlabelTema%0D%0A%0D%0A%7D%0D%0AFILTER+%28regex%28%3FuriTema%2C+%22http%3A%2F%2Fdatos.gob.es%2Fkos%2Fsector-publico%2Fsector%2F%22%29%29.%0D%0A%7D%0D%0Agroup+by+%3Ftipo+%3FlabelTema+%3FuriTema%0D%0Aorder+by+%3FlabelTema&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';


    // Añadir a esta consulta la url de los temas seleccionados en la búsqueda
    temasResult: string = `https://opendata.aragon.es/sparql?default-graph-uri=&qtxt=select+%3Fs+%3Ftipo+where%0D%0A{%0D%0A{%0D%0Aselect+distinct+%3Fs+%3Ftipo+{%0D%0A%3Fs+%3FpTema+%3Chttp%3A%2F%2Fdatos.gob.es%2Fkos%2Fsector-publico%2Fsector%2Fcultura-ocio%3E.%0D%0A%3Fs+a+%3Ftipo.%0D%0A%3Ftema+skos%3AprefLabel+%3FlabelTema.%0D%0A%0D%0A+VALUES+%3FpTema+{+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23classification%3E+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%3E+}.%0D%0A%0D%0AVALUES+%3Ftipo+{+%0D%0A%3Chttp%3A%2F%2Fschema.org%2FCreativeWork%3E%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23Dataset%3E%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23Organization%3E%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23Location%3E%0D%0A%3Chttp%3A%2F%2Fschema.org%2FEvent%3E%0D%0A%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23dataSet%3E%0D%0A}%0D%0A}%0D%0A%0D%0A}%0D%0Aunion%0D%0A{%0D%0Aselect+distinct+%3Fs+%3Ftipo++{%0D%0A%0D%0A++%3Chttp%3A%2F%2Fdatos.gob.es%2Fkos%2Fsector-publico%2Fsector%2Fcultura-ocio%3E+a+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23Concept%3E%3B%0D%0A++++++%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23prefLabel%3E+%3FlabelTema.%0D%0A%0D%0A%0D%0A%3Fs+%3FpTema+%3FlabelTema.%0D%0A%3Fs+a+%3Ftipo.%0D%0A%0D%0A+VALUES+%3FpTema+{++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%3E+}.%0D%0A%0D%0AVALUES+%3Ftipo+{+%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23Dataset%3E%0D%0A}%0D%0A}%0D%0A%0D%0A%0D%0A}%0D%0A%0D%0A}%0D%0A%0D%0Aorder+by+%3Ftipo+%3Fs&format=text%2Fhtml&timeout=0&signal_void=on`

    getTemas(): Observable<any> {
        return this.http.get(this.temasURL);
    }

    getResults(query: string): Observable<any> {
        return this.http.get(query);
    }

}