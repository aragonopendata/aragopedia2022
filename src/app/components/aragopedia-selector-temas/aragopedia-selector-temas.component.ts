import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AragopediaService } from '../aragopedia-tabla-datos/aragopediaService';
import { ComarcasComponent } from './location/comarcas/comarcas.component';
import { LocationComponent } from './location/location.component';
import { MunicipiosComponent } from './location/municipios/municipios.component';
import { ProvinciasComponent } from './location/provincias/provincias.component';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, timeout } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { outputAst } from '@angular/compiler';
import { Observable, of } from 'rxjs';
import { StickyDirection } from '@angular/cdk/table';

@Component({
  selector: 'app-aragopedia-selector-temas',
  templateUrl: './aragopedia-selector-temas.component.html',
  styleUrls: ['./aragopedia-selector-temas.component.scss']
})
export class AragopediaSelectorTemasComponent implements OnInit {

  previousQuery: string = '';
  tipoZonaAbreviada!: string;

  constructor(private router: Router, private _route: ActivatedRoute, public aragopediaSvc: AragopediaService, private fb: FormBuilder, private http: HttpClient) { }

  @ViewChild(LocationComponent) location: any;

  lastRutaUsable: string = '';
  lastId: string = '';
  lastNombre: string = '';

  temp = undefined;

  formGroup!: FormGroup;

  queryTemas!: string;
  newQueryTemas!: string;
  temasControl = new FormControl('');
  selectedTema: any = '';
  displayTema!: string;

  @Input() selectedProvincia: any = '';
  @Input() selectedComarca: any = '';
  @Input() selectedMunicipio: any = '';
  @Input() selectedProvinciaNombre: any = '';
  @Input() selectedComarcaNombre: any = '';
  @Input() selectedMunicipioNombre: any = '';

  tipoLocalidad: any = '';
  error: boolean = false;
  errorTabla: boolean = false;
  firstLand: boolean = true

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

  showTemas: any = [];
  temasActive: boolean = false;
  filteredTemas: any;

  submitted: boolean = false;
  loading: boolean = false;

  columnas: any;

  rutaLimpia!: any;
  displayZona: string = '';

  urlAnterior: string = '';
  URLparameters: any = [];


  ngOnInit(): void {

    this._route.queryParams.subscribe(params => {  //DE AQUI LEES LOS PARAMETROS DE LA URL PARAMETROS URL

      this.tipoLocalidad = params['tipo'];
      if (params['datos']) {
        this.rutaLimpia = params['datos'];
      } else {
        this.rutaLimpia = ''
      }
      this.URLparameters = params

    });

    setTimeout(() => {
      this.aragopediaSvc.triggerSubmitObserver.subscribe((tipoZona: any) => {
        this.selectedTema = '';
        this.firstLand = true;
        this.submitFromChangeZona(tipoZona);
      });
    }, 1000);


  }

  submitFromChangeZona(datos: string) {

    let selectedZonaNombre: string = '';
    
    if (datos == 'ComunidadAutonoma') {
      selectedZonaNombre = 'Aragón'
      this.tipoZonaAbreviada = "A";
    }
    else if (this.location.provinciaSelected != '' && this.location.provinciaSelected != undefined) {
      this.tipoZonaAbreviada = "TP";
      selectedZonaNombre = this.location.provinciaSelected
    } else if (this.location.comarcaSelected != '') {
      this.tipoZonaAbreviada = "TC";
      selectedZonaNombre = this.location.comarcaSelected
    } else if (this.location.municipioSelected != '') {
      this.tipoZonaAbreviada = "TM";
      selectedZonaNombre = this.location.municipioSelected
    }
    this.newQueryTemas = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3Fdataset+%3Fid+%3Fdsd+%3Fnombre++where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++%3Fdataset+dct%3Aidentifier+%3Fid%3B%0D%0A+++++++++++++++++++qb%3Astructure+%3Fdsd.%0D%0A++++%3Fdsd+dc%3Atitle+%3Fnombre.%0D%0A++filter+(regex(%3Fid%2C+%22${this.tipoZonaAbreviada}%24%22)).%0D%0A+++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2F${datos}%2F${this.fixNames(this.deleteSpace(selectedZonaNombre))}%3E.%0D%0A%7D+%0D%0A%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`

    console.log(this.newQueryTemas);

    this.aragopediaSvc.getData(this.newQueryTemas).subscribe((data: any) => {

      this.showTemas = []

      this.temas = data.results.bindings;
      this.showTemas = this.temas
      this.filteredTemas = this.temas

      this.temasActive = true;

    });

    setTimeout(() => {

      if (this.selectedProvincia === undefined) { this.selectedProvincia = '' }

      this.selectedProvincia = this.location.idProvincia;
      this.selectedComarca = this.location.idComarca;
      this.selectedMunicipio = this.location.idMunicipio;

      this.selectedMunicipioNombre = this.location.municipioSelected;
      this.selectedProvinciaNombre = this.location.provinciaSelected;
      this.selectedComarcaNombre = this.location.comarcaSelected;

      if (this.selectedProvincia !== '' && this.selectedProvincia !== undefined) {

        this.tipoLocalidad = 'provincia';
        this.rutaLimpia = this.rutaLimpia.replace('TC', 'TP').replace('TM', 'TP').replace('A', 'TP');

        this.displayZona = this.selectedProvinciaNombre;

        this.router.navigate(['aragopedia'], { queryParams: { tipo: this.tipoLocalidad, id: this.selectedProvincia, datos: this.rutaLimpia } })

      } else if (this.selectedComarca !== '') {
        this.tipoLocalidad = 'comarca';
        this.rutaLimpia = this.rutaLimpia.replace('TP', 'TC').replace('TM', 'TC').replace('A', 'TC');
        this.displayZona = this.selectedComarcaNombre;

        this.router.navigate(['aragopedia'], { queryParams: { tipo: this.tipoLocalidad, id: this.selectedComarca, datos: this.rutaLimpia } })

      } else if (this.selectedMunicipio !== '') {
        this.tipoLocalidad = 'municipio';
        this.rutaLimpia = this.rutaLimpia.replace('TC', 'TM').replace('TP', 'TM').replace('A', 'TM');
        this.displayZona = this.selectedMunicipioNombre;

        this.router.navigate(['aragopedia'], { queryParams: { tipo: this.tipoLocalidad, id: this.selectedMunicipio, datos: this.rutaLimpia } })
      } else if (this.selectedMunicipio == '' && selectedZonaNombre == 'Aragón' && this.selectedMunicipio == '' && this.selectedComarca == '') {
        this.tipoLocalidad = 'comunidad';
        this.rutaLimpia = this.rutaLimpia.replace('TC', 'A').replace('TP', 'A').replace('TM', 'A');
        this.displayZona = 'Aragón';

        this.router.navigate(['aragopedia'], { queryParams: { tipo: this.tipoLocalidad, id: '2', datos: this.rutaLimpia } })
      }

      if (this.selectedProvincia !== '' && this.selectedProvincia !== undefined) {

        this.tipoLocalidad = 'provincia';
        this.router.navigate(['aragopedia'], { queryParams: { tipo: this.tipoLocalidad, id: this.selectedProvincia, datos: this.rutaLimpia } })

      } else if (this.selectedComarca !== '') {

        this.tipoLocalidad = 'comarca';
        this.router.navigate(['aragopedia'], { queryParams: { tipo: this.tipoLocalidad, id: this.selectedComarca, datos: this.rutaLimpia } })

      } else if (this.selectedMunicipio !== '') {

        this.tipoLocalidad = 'municipio';
        this.router.navigate(['aragopedia'], { queryParams: { tipo: this.tipoLocalidad, id: this.selectedMunicipio, datos: this.rutaLimpia } })

      }

      this._route.queryParams.subscribe(params => {

        if (this.rutaLimpia !== '') {
          if (this.selectedProvincia !== '') {

            this.rutaLimpia = params['datos'].replace('TC', 'TP').replace('TM', 'TP').replace('A', 'TP');
            this.aragopediaSvc.tipoLocalidad = this.capitalizeString(this.tipoLocalidad);
          } else if (this.selectedComarca !== '') {
            this.rutaLimpia = params['datos'].replace('TP', 'TC').replace('TM', 'TC').replace('A', 'TC');
            this.aragopediaSvc.tipoLocalidad = this.capitalizeString(this.tipoLocalidad);
          } else if (this.selectedMunicipio !== '') {

            this.rutaLimpia = params['datos'].replace('TC', 'TM').replace('TP', 'TM').replace('A', 'TM');
            this.aragopediaSvc.tipoLocalidad = this.capitalizeString(this.tipoLocalidad);
          } else if (this.selectedMunicipio == '' && selectedZonaNombre == 'Aragón' && this.selectedMunicipio == '' && this.selectedComarca == '') {

            this.rutaLimpia = params['datos'].replace('TC', 'A').replace('TP', 'A').replace('TM', 'A');
            this.aragopediaSvc.tipoLocalidad = this.capitalizeString(this.tipoLocalidad);
          }
          if (this.router.url != this.urlAnterior) {

            this.urlAnterior = this.router.url
            this.temaSelectedAuto(this.rutaLimpia);
          }
        }
      });

      this.initForm();

    }, 500);
  }

  filterData(enteredData: any) {

    this.filteredTemas = this.showTemas.filter((item: any) => {
      return this.removeAccents(item.nombre.value.toLowerCase()).indexOf(this.removeAccents(enteredData.toLowerCase())) > -1

    })
  }

  removeAccents(str: any): any {
    const acentos: any = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U' };
    return str.split('').map((letra: any) => acentos[letra] || letra).join('').toString();
  }

  initForm() {

    this.formGroup = this.fb.group({
      "tema": [this.selectedTema]
    })
    this.formGroup.get('tema')?.valueChanges.subscribe(response => {
      this.selectedTema = response;
      this.filterData(response);
    })

  }

  temaSelectedAuto(tema: any) {

     this.filteredTemas = this.showTemas;
    let nombreZona = "";
    let rutaUsable: string;
    let rutaLimpia = '/';

    this.loading = true

    if (tema.id) {

      rutaLimpia = '/' + tema.id.value
      this.displayTema = tema.nombre.value;

    } else {
      setTimeout(() => {

        rutaUsable = tema
        this.showTemas.forEach((element: any) => {

          if ((rutaUsable) == element.id.value.substring(element.id.value.indexOf('/') + 1).replaceAll('/', '-')) {

            this.displayTema = element.nombre.value;
          }
          let index = rutaUsable.indexOf('/')
          rutaLimpia = '/' + rutaUsable.substring(index + 1).replaceAll('/', '-')
        }, 1000);
      });
    }

    this.showTemas.forEach((element: any) => {
      let rutaElement = element.id.value.substring(element.id.value.indexOf('/') + 1).replaceAll('/', '-');
      if (rutaElement === rutaUsable) {
        this.firstLand = false;
      }

    });
    setTimeout(() => {

      if (rutaLimpia == '/') {
        return;
      }

      let query: string = 'select distinct ?refArea ?nameRefArea '
      this.rutaLimpia = rutaLimpia.substring(1);

      let queryColumna: string = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FcolUri+%3FtipoCol+str%28%3FnombreCol%29%0D%0A+where+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset${rutaLimpia}%3E+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23structure%3E+%3Fdsd.%0D%0A++%3Fdsd+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23component%3E+%3Fcol.%0D%0A++%3Fcol+%3FtipoCol+%3FcolUri.%0D%0A++%3FcolUri+rdfs%3Alabel+%3FnombreCol.%0D%0A%7D%0D%0A%0D%0ALIMIT+500%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`

      this.aragopediaSvc.getData(queryColumna).subscribe(data => {
        this.columnas = data.results.bindings;

        let columnasCheckMesYAno: Array<any> = [];
        this.columnas.forEach((element: any) => {
          let nombreColumnaAux = element['callret-2'].value.replaceAll('%', 'porcentaje').replaceAll('-', '_').replaceAll('*', 'por').replaceAll(' ', '_').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[{(/,.)}]/g, '');
          query += '?' + nombreColumnaAux + ' as ' + '?' + nombreColumnaAux + ' '

          columnasCheckMesYAno.push(nombreColumnaAux)
        });

        this.aragopediaSvc.changeColumnas(this.columnas);


        columnasCheckMesYAno.includes('mes_y_ano') ? query += '' : query += '?refPeriod (strafter(str(?refPeriod), "http://reference.data.gov.uk/id/year/") AS ?nameRefPeriod) '
        query += 'where { \n'
        query += " ?obs qb:dataSet <http://opendata.aragon.es/recurso/iaest/dataset" + rutaLimpia + ">.\n";
        query += " ?obs <http://purl.org/linked-data/sdmx/2009/dimension#refPeriod> ?refPeriod.\n";
   
        query += " ?obs <http://purl.org/linked-data/sdmx/2009/dimension#refArea> ?refArea.\n";
        query += " ?refArea rdfs:label ?nameRefArea.";
        query += ' FILTER ( lang(?nameRefArea) = "es" ).\n';

        if (rutaLimpia.charAt(rutaLimpia.length - 1) != "A") {

          //se comento luego de correr SonarQube
          //-------this.showTemas

          let tipoZona = "";
          if (this.selectedProvincia != '') {
            tipoZona = "Provincia"
            nombreZona = this.selectedProvinciaNombre
          } else if (this.selectedComarca != '') {
            tipoZona = "Comarca"
            nombreZona = this.selectedComarcaNombre
          } else if (this.selectedMunicipio != '') {
            tipoZona = "Municipio"
            nombreZona = this.selectedMunicipioNombre
          }
          let uriPrefix = "<http://opendata.aragon.es/recurso/territorio/" + tipoZona + "/";
          query += "FILTER (?refArea IN (";
          query += uriPrefix + this.fixNames(this.deleteSpace(nombreZona)) + ">";
          query += ")).\n";
        }
        let icolumnas = 0
        this.columnas.forEach((element: any) => {

          let nombreColumnaAux = element['callret-2'].value.replaceAll('%', 'porcentaje').replaceAll('-', '_').replaceAll('*', 'por').replaceAll(' ', '_').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[{(/,.)}]/g, '')
          if (element.colUri.value.indexOf("https://opendata.aragon.es/def/iaest/dimension") != -1 && element.colUri.value.indexOf("https://opendata.aragon.es/def/iaest/dimension#mes-y-ano") == -1) {
            icolumnas++
            query += "OPTIONAL { ?obs <" + element.colUri.value + "> ?foo" + icolumnas + ".\n";
            query += " ?foo" + icolumnas + " skos:prefLabel " + "?" + nombreColumnaAux + " } .\n";

          }
          else {
            query += "OPTIONAL {  ?obs <" + element.colUri.value + "> ?" + nombreColumnaAux + " } .\n";
          }
        });

        query += "} \n";
        query += "ORDER BY ASC(?refArea) ASC(?refPeriod)\n";
        //query += "LIMIT 200\n"

        if (query == this.previousQuery) {
          return
        }
        this.previousQuery = query
        console.log(query);
        console.log('https://opendata.aragon.es/sparql?default-graph-uri=&query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on');

        this.sparql(query);

        query ? this.loading = false : this.loading = true;


        this.queryTabla = 'https://opendata.aragon.es/sparql?default-graph-uri=&query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';

        this.aragopediaSvc.change(this.queryTabla);

        if (this.selectedTema != '') {
    
        }

        this.selectedTema = '';
        this.firstLand = false;
      })
      if (rutaLimpia !== '' && rutaLimpia !== undefined && this.selectedProvincia != '') {
        this.router.navigate(['aragopedia'], { queryParams: { tipo: this.tipoLocalidad, id: this.selectedProvincia, datos: this.rutaLimpia } })
      } else if (rutaLimpia !== '' && rutaLimpia !== undefined && this.selectedComarca != '') {
        this.router.navigate(['aragopedia'], { queryParams: { tipo: this.tipoLocalidad, id: this.selectedComarca, datos: this.rutaLimpia } })
      } else if (rutaLimpia !== '' && rutaLimpia !== undefined && this.selectedMunicipio != '') {
        this.router.navigate(['aragopedia'], { queryParams: { tipo: this.tipoLocalidad, id: this.selectedMunicipio, datos: this.rutaLimpia } })
      } else if (rutaLimpia !== '' && rutaLimpia !== undefined && this.selectedProvincia == '' && this.selectedComarca == '' && this.selectedMunicipio == '' && this.displayZona == 'Aragón') {
        this.router.navigate(['aragopedia'], { queryParams: { tipo: 'comunidad', id: '2', datos: this.rutaLimpia } })
      }

      this.aragopediaSvc.lastZona = this.deleteSpace(nombreZona);
      this.aragopediaSvc.tipoLocalidad = this.capitalizeString(this.tipoLocalidad);
    }, 1000);
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

    this.http.get(('https://opendata.aragon.es/sparql?default-graph-uri=&query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on'), httpOptions).pipe(
      catchError(this.handleError<string>())
    ).subscribe((data: any) => {
      if (this.selectedTema != '') {
      }

      this.selectedTema = '';

      if (data.results.bindings.length === 0) {
        this.errorTabla = true;
        this.submitted = false;
      } else {
        this.errorTabla = false;

        this.submitted = false;
      }

    })

  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      //console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
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

      const lowerTxt = txt.toLowerCase();

      if (lowerTxt === 'el' || lowerTxt === 'y' || lowerTxt === 'del' ||
        lowerTxt === 'de' || lowerTxt === 'las' || lowerTxt === 'la' || lowerTxt === 'los') {
          return lowerTxt;
      } else {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    });
  }

  fixNames(str: string): string {
    return str
      .replace('Bajo_Aragón_–_Caspe_/_Baix_Aragó_–_Casp', 'Bajo_Aragón-Caspe/Baix_Aragó-Casp')
      .replace('Andorra_–_Sierra_de_Arcos', 'Andorra-Sierra_de_Arcos')
      .replace('Bajo_Cinca_-_Baix_Cinca', 'Bajo_Cinca/Baix_Cinca')
      .replace('Matarraña_-_Matarranya', 'Matarraña/Matarranya')
      .replace('La_Litera_-_La_Llitera', 'La_Litera/La_Llitera')
      .replace('Gúdar_–_Javalambre', 'Gúdar-Javalambre')
      .replace('Hoya_de_Huesca_-_Plana_de_Uesca', 'Hoya_de_Huesca/Plana_de_Uesca')
      .replace('de_La', 'de_la')
      .replace('Beranuy', 'Veracruz')
      .replace('Torla-Ordesa', 'Torla')
      .replace('Monflorite Lascasas', 'Monflorite-Lascasas')
      .replace('Lascellas Ponzano', 'Lascellas-Ponzano')
      .replace('Aisa', 'Aínsa-Sobrarbe')
      .replace('Baélls', 'Baells')
      .replace('Camporrélls', 'Camporrells')
      .replace('Hoz_y_Costean', 'Hoz_y_Costeán')
      .replace('Jarque_de_Moncayo', 'Jarque')
      .replace('Sabiñán', 'Saviñán')
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
    return newStr;
  }

  deleteSpace(str: any): string {
    return str.split(' ').join('_');
  }

}
