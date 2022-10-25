import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RDFData {
  label!: string;
  uri!: string;
  type!: string;
  dctype!: string;
  hits?: number;
  selected = false;
}


export class SparqlserviceService {

  constructor(private http: HttpClient) { }

  static PREFIXES = `
  PREFIX hg: <http://rdf.histograph.io/>
  PREFIX dct: <http://purl.org/dc/terms/>
  PREFIX dbo: <http://dbpedia.org/ontology/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX imt: <http://immigrants.tutorial/>
  PREFIX pnv: <https://w3id.org/pnv#>`;

  serviceURL: string = 'https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FrefArea+%3FnameRefArea+%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F%22%29+AS+%3FnameRefPeriod%29+xsd%3Aint%28%3Fpoblacion%29+as+%3Fpoblac+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++FILTER%28%3Fdataset+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001A%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001TC%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001TM%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+FILTER+%28%3FrefPeriod+IN+%28%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2017%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2018%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2019%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2020%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2021%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+%0D%0A+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0A+BIND+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FMunicipio%2FAbabuj%3E+AS+%3Fmuni%29.%0D%0A+%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComarca%3E+%3Fcomarca.%0D%0A+%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComunidadAutonoma%3E+%3Fccaa.%0D%0A+FILTER+%28%3FrefArea+IN+%28%3Fmuni%2C+%3Fcomarca%2C+%3Fccaa%29%29.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23poblacion%3E+%3Fpoblacion++%7D+.%0D%0A%7D%0D%0AORDER+BY+%3FrefArea%2C+desc%28%3FrefPeriod%29%0D%0ALIMIT+15%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console

      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string, data?: any) {
    console.log(`SparqlService: ${message}`, data);
  }


  protected parseResults(results: any): Array<RDFData> {
    let resultData: any;
    const tempDict: { [uri: string]: RDFData } = {};
    const itemsDict: { [uri: string]: RDFData } = {};
    const items: RDFData[] = [];
    let rdfdata: RDFData;
    let key: string;
    let label: string;
    let hits: number;
    let type: string;
    let dctype: string;
    for (resultData of results.results.bindings) {
      key = resultData.uri ? resultData.uri.value : null;
      label = resultData.label ? resultData.label.value : null;
      hits = resultData.hits ? resultData.hits.value : null;
      type = resultData.type ? resultData.type.value : null;
      dctype = resultData.dctype ? resultData.dctype.value : null;
      if (null == tempDict[key]) {
        rdfdata = new RDFData();
        tempDict[key] = rdfdata;
      } else {
        rdfdata = tempDict[key];
      }
      rdfdata.uri = key;
      rdfdata.hits = hits;
      rdfdata.label = label;
      rdfdata.type = type;
      rdfdata.dctype = dctype;
      if (rdfdata.label && rdfdata.label !== '') {
        if (itemsDict[rdfdata.uri] == null) {
          itemsDict[rdfdata.uri] = rdfdata;
          items.push(rdfdata);
        } else {
          console.log('Duplicate item found: ', rdfdata.label);
        }
      } else {
        // console.log('Item without a name found: ', itemdata);
      }
    }
    console.log('results from loading: ', results);
    return items;
  }


  getRDF(query: string): Observable<any[]> {
    const params = new HttpParams()
      .set('query', query)
      .set('format', 'json');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/sparql-results+json'
      }),
      params: params
    };
    return this.http.get<any>(this.serviceURL, options).pipe(
      catchError(this.handleError('getRDF', []))
    );
  }

  getData() {
    const query = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FrefArea+%3FnameRefArea+%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F%22%29+AS+%3FnameRefPeriod%29+xsd%3Aint%28%3Fpoblacion%29+as+%3Fpoblac+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++FILTER%28%3Fdataset+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001A%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001TC%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001TM%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+FILTER+%28%3FrefPeriod+IN+%28%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2017%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2018%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2019%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2020%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2021%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+%0D%0A+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0A+BIND+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FMunicipio%2FAbabuj%3E+AS+%3Fmuni%29.%0D%0A+%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComarca%3E+%3Fcomarca.%0D%0A+%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComunidadAutonoma%3E+%3Fccaa.%0D%0A+FILTER+%28%3FrefArea+IN+%28%3Fmuni%2C+%3Fcomarca%2C+%3Fccaa%29%29.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23poblacion%3E+%3Fpoblacion++%7D+.%0D%0A%7D%0D%0AORDER+BY+%3FrefArea%2C+desc%28%3FrefPeriod%29%0D%0ALIMIT+15%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

    return this.getRDF(query).pipe(
      map(res => {
        return this.parseResults(res);
      }));
  }



}
