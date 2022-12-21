import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { dateFormat } from 'dc';
import { AragopediaService } from '../aragopedia-tabla-datos/aragopediaService';
import { ComarcasComponent } from './location/comarcas/comarcas.component';
import { LocationComponent } from './location/location.component';
import { MunicipiosComponent } from './location/municipios/municipios.component';
import { ProvinciasComponent } from './location/provincias/provincias.component';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { outputAst } from '@angular/compiler';

@Component({
  selector: 'app-aragopedia-selector-temas',
  templateUrl: './aragopedia-selector-temas.component.html',
  styleUrls: ['./aragopedia-selector-temas.component.scss']
})
export class AragopediaSelectorTemasComponent implements OnInit {

  constructor(public aragopediaSvc: AragopediaService, private fb: FormBuilder, private http: HttpClient) { }

  @ViewChild(LocationComponent) location: any;


  temp = undefined;

  formGroup!: FormGroup;

  queryTemas!: string;
  temasControl = new FormControl('');
  selectedTema: any = '';

  @Input() selectedProvincia: any = '';
  @Input() selectedComarca: any = '';
  @Input() selectedMunicipio: any = '';
  @Input() selectedProvinciaNombre: any = '';
  @Input() selectedComarcaNombre: any = '';
  @Input() selectedMunicipioNombre: any = '';

  unique: any;
  temas!: any;

  temasComunidad = [{}];
  temasProvincia = [{}];
  temasComarca = [{}];
  temasMunicipio = [{}];

  queryUrlWikiData!: string;

  queryUrlComarcasId!: string
  queryUrlMunicipiosId!: string;

  queryTabla: string = '';
  @Output() queryEmitter = new EventEmitter<String>();

  showTemas: any;
  temasActive: boolean = false;

  columnas: any;


  ngOnInit(): void {
    this.formGroup = this.fb.group({
      temas: [''],
      location: ['']
    });

    this.queryTemas = "https://opendata.aragon.es/solrWIKI/informesIAEST/select?q=*&rows=2000&omitHeader=true&wt=json";

    this.aragopediaSvc.getData(this.queryTemas).subscribe((data: any) => {
      this.temas = data.response.docs;
      this.unique = [...new Set(data.response.docs.map((item: { Descripcion: any; }) => item.Descripcion))];

      // Construcción temas por tipo de territorio
      this.temas.forEach((tema: any) => {
        if (tema.Tipo === 'A') {
          this.temasComunidad.push(tema)
        } else if (tema.Tipo === 'TP') {
          this.temasProvincia.push(tema)
        } else if (tema.Tipo === 'TC') {
          this.temasComarca.push(tema)
        } else if (tema.Tipo === 'TM') {
          this.temasMunicipio.push(tema);
        }
      });
    });

  }

  submit() {
    this.selectedProvincia = this.location.idProvincia;
    this.selectedComarca = this.location.idComarca;
    this.selectedMunicipio = this.location.idMunicipio;

    this.selectedMunicipioNombre = this.location.municipioSelected;
    this.selectedProvinciaNombre = this.location.provinciaSelected;
    this.selectedComarcaNombre = this.location.comarcaSelected;

    if (this.selectedProvincia !== undefined) {
      this.showTemas = this.temasProvincia;
      this.temasActive = true;


    } else if (this.selectedComarca !== undefined) {
      this.showTemas = this.temasComarca;
      this.temasActive = true;
    } else if (this.selectedMunicipio !== undefined) {
      this.showTemas = this.temasMunicipio;
      this.temasActive = true;
    }
    console.log(this.selectedProvincia);
    console.log(this.selectedComarca);
    console.log(this.selectedMunicipio);
  }

  temaSelected(tema: any) {
    let query: string = 'select distinct ?refArea ?nameRefArea ?refPeriod (strafter(str(?refPeriod), "http://reference.data.gov.uk/id/year/") AS ?nameRefPeriod) '

    let index = tema.Ruta.indexOf('/')

    let rutaLimpia = '/' + tema.Ruta.substring(index + 1).replaceAll('/', '-')
    let queryColumna: string = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FcolUri+%3FtipoCol+str%28%3FnombreCol%29%0D%0A+where+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset${rutaLimpia}%3E+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23structure%3E+%3Fdsd.%0D%0A++%3Fdsd+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23component%3E+%3Fcol.%0D%0A++%3Fcol+%3FtipoCol+%3FcolUri.%0D%0A++%3FcolUri+rdfs%3Alabel+%3FnombreCol.%0D%0A%7D%0D%0A%0D%0ALIMIT+500%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`

    this.aragopediaSvc.getData(queryColumna).subscribe(data => {
      this.columnas = data.results.bindings;

      this.columnas.forEach((element: any) => {
        let nombreColumnaAux = element['callret-2'].value.replaceAll(' ', '_').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[{()}]/g, '');
        query += '?' + nombreColumnaAux + ' as ' + '?' + nombreColumnaAux + ' '
      });

      let queryPrefijo = "<http://reference.data.gov.uk/id/year/"

      query += 'where { \n'
      query += " ?obs qb:dataSet <http://opendata.aragon.es/recurso/iaest/dataset" + rutaLimpia + ">.\n";
      query += " ?obs <http://purl.org/linked-data/sdmx/2009/dimension#refPeriod> ?refPeriod.\n";
      //query += "FILTER (?refPeriod IN (";
      //query += queryPrefijo = "<http://reference.data.gov.uk/id/year/" + '2010' + ">"; //Cambiar por minimo años
      // for (var i = (2010); i <= 2020; i++) {
      //   query += ',' + queryPrefijo + i + ">";
      // }
      query += " ?obs <http://purl.org/linked-data/sdmx/2009/dimension#refArea> ?refArea.\n";
      query += " ?refArea rdfs:label ?nameRefArea.";
      query += ' FILTER ( lang(?nameRefArea) = "es" ).\n';

      if (rutaLimpia.charAt(rutaLimpia.length - 1) != "A") {

        this.showTemas
        let tipoZona = "";
        let nombreZona = "";

        if (this.selectedProvincia != undefined) {
          tipoZona = "Provincia"
          nombreZona = this.selectedProvinciaNombre
        } else if (this.selectedComarca != undefined) {
          tipoZona = "Comarca"
          nombreZona = this.selectedComarcaNombre
        } else if (this.selectedMunicipio != undefined) {
          tipoZona = "Municipio"
          nombreZona = this.selectedMunicipioNombre
        }

        console.log(this.deleteSpace(nombreZona));

        let uriPrefix = "<http://opendata.aragon.es/recurso/territorio/" + tipoZona + "/";
        query += "FILTER (?refArea IN (";
        query += uriPrefix + this.deleteSpace(nombreZona) + ">";
        query += ")).\n";
      }

      this.columnas.forEach((element: any) => {
        let nombreColumnaAux = element['callret-2'].value.replaceAll(' ', '_').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[{()}]/g, '');
        query += "OPTIONAL {  ?obs <" + element.colUri.value + "> ?" + nombreColumnaAux + " } .\n";
        element
      });

      query += "} \n";
      query += "ORDER BY ASC(?refArea) ASC(?refPeriod)\n";
      query += "LIMIT 200\n"

      console.log(query);
      console.log(encodeURIComponent(query));

      this.sparql(query);

      this.queryTabla = 'https://opendata.aragon.es/sparql?default-graph-uri=&query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';

      this.aragopediaSvc.change(this.queryTabla);
    })

  }

  sendQuery() {
    this.queryEmitter.emit(this.queryTabla);
  }
  sparql(query: any) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    this.http.get('your-url', httpOptions);

    let params = new URLSearchParams();
    params.append("query", ("https://opendata.aragon.es/sparql" + query));
    params.append("format", "json");

    this.http.get(('https://opendata.aragon.es/sparql?default-graph-uri=&query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on'), httpOptions).subscribe(data => {
      console.log(data);

    })


  }

  correctWordInverse(name: string, word: string) {
    let str = name;
    if (str.startsWith(word + " ")) {
      return str.replace(new RegExp(word + ' ', 'g'), '') + " (" + word + ")";
    } else {
      return str;
    }
  }

  getAragopediaURIfromName(itemOrig: any, type: any) {
    let item = itemOrig;
    if (type == "Municipio") {
      item = this.correctWordInverse(item, "La");
      item = this.correctWordInverse(item, "El");
      item = this.correctWordInverse(item, "Las");
      item = this.correctWordInverse(item, "Los");
    }
    item = item.replace(new RegExp(' \/ ', 'g'), '/');
    if (item == "Beranuy") {
      item = "Veracruz";
    }
    if (item == "Torla-Ordesa") {
      item = "Torla";
    }
    if (item == "Monflorite Lascasas") {
      item = "Monflorite-Lascasas";
    }
    if (item == "Lascellas Ponzano") {
      item = "Lascellas-Ponzano";
    }
    item = item.replace(new RegExp(' ', 'g'), '_');
    return item;
  }

  capitalizeString(str: any): string {
    return str.replace(/\w\S*/g, function (txt: any) {
      for (let i = 0; i < txt.length; i++) {
        if (txt.toLowerCase() === 'el'
          || txt.toLowerCase() === 'y'
          || txt.toLowerCase() === 'del'
          || txt.toLowerCase() === 'de'
          || txt.toLowerCase() === 'las') {
          return txt.toLowerCase();
        }
        if (txt.toLowerCase() !== 'de'
          || txt.toLowerCase() !== 'del'
          || txt.toLowerCase() !== 'la'
          || txt.toLowerCase() !== 'las'
          || txt.toLowerCase() !== 'los') {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
        else {
          return txt.toLowerCase()
        }
      }

    });
  }

  capitalAfterSlash(str: string): string {
    const index = str.indexOf('/');
    const replacement = str[index + 1].toUpperCase();
    return str.replace(str[index + 1], replacement);
  }

  capitalAfterHyphen(str: string): string {
    let newStr = str[0];
    for (let i = 0; i < str.length - 1; i++) {

      const char = str[i];
      if (char === '-') {
        newStr += str[i + 1].toUpperCase()
      } else {
        newStr += str[i + 1]
      }
    }

    // if (str.includes('-')) {
    //   const index = str.indexOf('-');
    //   const replacement = str[index + 1].toUpperCase();
    //   return str
    //     .replaceAll(str[index + 1], replacement)
    //     .replace('ArcoS', 'Arcos')
    //     .replace('MonfLorite', 'Monflorite')
    //     .replace('AínSa', 'Aínsa')
    // }
    return newStr;
  }

  deleteSpace(str: any): string {
    return str.split(' ').join('_');
  }

}

