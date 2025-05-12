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

}