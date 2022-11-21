import { Injectable } from '@angular/core';
import { YearsPeriod } from '../timeline/timeline.service';

@Injectable({ providedIn: 'root' })
export class ServiceNameService {

    provincia!: string;
    comarca!: string;
    municipio!: string;
    years!: YearsPeriod;
    temas!: string[];

    sparqlSearch: string = `https://opendata.aragon.es/sparql?${this.provincia}${this.municipio}${this.comarca}${this.years}${this.temas}`

    // https://opendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0D%0APREFIX+ns%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fprov%23%3E%0D%0APREFIX+vcard%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23%3E%0D%0A%0D%0ASELECT+%3Fmuni%0D%0AFROM+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E%0D%0AWHERE+%7B%0D%0A%3Fmuni++++ns%3AwasUsedBy+%3Fprocedencia.+%0D%0A++++++%3Fprocedencia+ns%3AwasAssociatedWith+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F11%3E.+%0D%0A%7D%0D%0Alimit+100&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on
}