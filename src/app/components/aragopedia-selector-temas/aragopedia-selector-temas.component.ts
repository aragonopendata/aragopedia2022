import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { dateFormat } from 'dc';
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

  constructor(private router: Router, private _route: ActivatedRoute, public aragopediaSvc: AragopediaService, private fb: FormBuilder, private http: HttpClient) { }

  @ViewChild(LocationComponent) location: any;

  lastRutaUsable: string = '';
  lastId: string = '';
  lastNombre: string = '';

  temp = undefined;

  formGroup!: FormGroup;

  queryTemas!: string;
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

  columnas: any;

  rutaLimpia!: any;
  displayZona: string = '';

  urlAnterior: string = '';
  URLparameters: any = [];


  ngOnInit(): void {
    //    this.formGroup = this.fb.group({
    //      temas: [''],
    //      location: ['']
    //    });
    this.queryTemas = "https://opendata.aragon.es/solrWIKI/informesIAEST/select?q=*&rows=2000&omitHeader=true&wt=json";

    this.aragopediaSvc.getData(this.queryTemas).subscribe((data: any) => {
      this.temas = data.response.docs;
      // //console.log('temas init')
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
    this._route.queryParams.subscribe(params => {  //DE AQUI LEES LOS PARAMETROS DE LA URL PARAMETROS URL

      this.tipoLocalidad = params['tipo'];
      if (params['datos']) {
        this.rutaLimpia = params['datos'];
      } else {
        this.rutaLimpia = ''
      }
      //console.log(this.rutaLimpia);

      this.URLparameters = params

    });

    this.aragopediaSvc.triggerSubmitObserver.subscribe((tipoZona: any) => {

      this.selectedTema = '';

      this.firstLand = true;
      ////console.log('trigger' + trigger)
      //console.log(tipoZona)
      this.submitFromChangeZona(tipoZona);
    });

  }

  submit() {

    if (this.selectedProvincia === undefined) { this.selectedProvincia = '' }

    // //console.log('submit' + this.selectedProvincia);
    // //console.log(this.selectedComarca);
    // //console.log(this.selectedMunicipio);

    this.selectedProvincia = this.location.idProvincia;
    this.selectedComarca = this.location.idComarca;
    this.selectedMunicipio = this.location.idMunicipio;


    //console.log('selected municipio' + this.location.idMunicipio);

    this.selectedMunicipioNombre = this.location.municipioSelected;
    this.selectedProvinciaNombre = this.location.provinciaSelected;
    this.selectedComarcaNombre = this.location.comarcaSelected;

    if (this.selectedProvincia !== '' || this.selectedProvincia !== undefined) {
      this.showTemas = this.temasProvincia;
      this.temasActive = true;

    } else if (this.selectedComarca !== '') {

      this.showTemas = this.temasComarca;
      this.temasActive = true;

    } else if (this.selectedMunicipio !== '') {

      this.showTemas = this.temasMunicipio;
      this.temasActive = true;
    }

    if (this.selectedProvincia !== '' || this.selectedProvincia !== undefined) {
      this.tipoLocalidad = 'diputacion';
      this.rutaLimpia = this.rutaLimpia.replace('TC', 'TP').replace('TM', 'TP');
      //console.log(this.rutaLimpia);

      if (this.URLparameters.datos != this.URLparameters.datos || this.URLparameters.id != this.selectedProvincia) {
        this.router.navigate(['aragopedia'], { queryParams: { tipo: this.tipoLocalidad, id: this.selectedProvincia, datos: this.rutaLimpia } })
      }
    } else if (this.selectedComarca !== '') {
      this.tipoLocalidad = 'comarca';
      this.rutaLimpia = this.rutaLimpia.replace('TP', 'TC').replace('TM', 'TC');

      if (this.URLparameters.datos != this.URLparameters.datos || this.URLparameters.id != this.selectedComarca) {
        this.router.navigate(['aragopedia'], { queryParams: { tipo: this.tipoLocalidad, id: this.selectedComarca, datos: this.rutaLimpia } })
      }
    } else if (this.selectedMunicipio !== '') {
      this.tipoLocalidad = 'municipio';
      this.rutaLimpia = this.rutaLimpia.replace('TC', 'TM').replace('TP', 'TM');

      if (this.URLparameters.datos != this.URLparameters.datos || this.URLparameters.id != this.selectedMunicipio) {
        this.router.navigate(['aragopedia'], { queryParams: { tipo: this.tipoLocalidad, id: this.selectedMunicipio, datos: this.rutaLimpia } })
      }
    }

    if (!this.showTemas[0].Descripcion) {
      this.showTemas.shift()
    }
    this.initForm();
  }

  submitFromChangeZona(datos: string) {
    if (this.selectedProvincia === undefined) { this.selectedProvincia = '' }

    this.selectedProvincia = this.location.idProvincia;
    this.selectedComarca = this.location.idComarca;
    this.selectedMunicipio = this.location.idMunicipio;

    this.selectedMunicipioNombre = this.location.municipioSelected;
    this.selectedProvinciaNombre = this.location.provinciaSelected;
    this.selectedComarcaNombre = this.location.comarcaSelected;


    //console.log('submitfromchangezona')

    if (this.selectedProvincia !== '' && this.selectedComarca !== undefined) {

      //console.log(this.selectedProvincia)

      this.tipoLocalidad = 'diputacion';
      this.rutaLimpia = this.rutaLimpia.replace('TC', 'TP').replace('TM', 'TP');
      //console.log('prov ' + this.selectedTema);

      this.displayZona = this.selectedProvinciaNombre;

      this.router.navigate(['aragopedia'], { queryParams: { tipo: this.tipoLocalidad, id: this.selectedProvincia, datos: this.rutaLimpia } })

    } else if (this.selectedComarca !== '') {
      this.tipoLocalidad = 'comarca';
      this.rutaLimpia = this.rutaLimpia.replace('TP', 'TC').replace('TM', 'TC');
      //console.log('coma ' + this.selectedTema);
      this.displayZona = this.selectedComarcaNombre;

      this.router.navigate(['aragopedia'], { queryParams: { tipo: this.tipoLocalidad, id: this.selectedComarca, datos: this.rutaLimpia } })

    } else if (this.selectedMunicipio !== '') {
      this.tipoLocalidad = 'municipio';
      this.rutaLimpia = this.rutaLimpia.replace('TC', 'TM').replace('TP', 'TM');
      //console.log('muni ' + this.selectedTema);
      this.displayZona = this.selectedMunicipioNombre;

      this.router.navigate(['aragopedia'], { queryParams: { tipo: this.tipoLocalidad, id: this.selectedMunicipio, datos: this.rutaLimpia } })
    }

    if (this.selectedProvincia !== '') {
      this.showTemas = this.temasProvincia;
      this.temasActive = true;
      if (!this.showTemas[0].Descripcion) {
        this.showTemas.shift()
      }

    } else if (this.selectedComarca !== '') {

      this.showTemas = this.temasComarca;
      this.temasActive = true;
      if (!this.showTemas[0].Descripcion) {
        this.showTemas.shift()
      }
      // //console.log('temas');


    } else if (this.selectedMunicipio !== '') {
      this.showTemas = this.temasMunicipio;
      this.temasActive = true;
      if (!this.showTemas[0].Descripcion) {
        this.showTemas.shift()
      }
    }


    // //console.log('submit from cghangezona');


    if (this.selectedProvincia !== '' && this.selectedProvincia !== undefined) {

      this.tipoLocalidad = 'diputacion';
      this.router.navigate(['aragopedia'], { queryParams: { tipo: this.tipoLocalidad, id: this.selectedProvincia, datos: this.rutaLimpia } })

    } else if (this.selectedComarca !== '') {

      // //console.log(this.rutaLimpia);
      this.tipoLocalidad = 'comarca';
      this.router.navigate(['aragopedia'], { queryParams: { tipo: this.tipoLocalidad, id: this.selectedComarca, datos: this.rutaLimpia } })
      // //console.log('url');


    } else if (this.selectedMunicipio !== '') {

      // //console.log(this.rutaLimpia);
      this.tipoLocalidad = 'municipio';
      this.router.navigate(['aragopedia'], { queryParams: { tipo: this.tipoLocalidad, id: this.selectedMunicipio, datos: this.rutaLimpia } })

    }

    this._route.queryParams.subscribe(params => {  //DE AQUI LEES LOS PARAMETROS DE LA URL PARAMETROS URL

      if (this.rutaLimpia !== '') {
        // this.rutaLimpia = params['datos'];
        if (this.selectedProvincia !== '') {
          this.rutaLimpia = params['datos'].replace('TC', 'TP').replace('TM', 'TP');
        } else if (this.selectedComarca !== '') {
          this.rutaLimpia = params['datos'].replace('TP', 'TC').replace('TM', 'TC');

        } else if (this.selectedMunicipio !== '') {
          this.rutaLimpia = params['datos'].replace('TC', 'TM').replace('TP', 'TM');
        }
        if (this.router.url != this.urlAnterior) {
          this.urlAnterior = this.router.url
          this.temaSelectedAuto(this.rutaLimpia);
        }
      }
    });

    this.initForm();
  }

  filterData(enteredData: any) {

    this.filteredTemas = this.showTemas.filter((item: any) => {
      return item.DescripcionMejorada.toLowerCase().indexOf(enteredData.toLowerCase()) > -1
    })
  }

  initForm() {

    this.formGroup = this.fb.group({
      "tema": [this.selectedTema]
    })

    this.formGroup.get('tema')?.valueChanges.subscribe(response => {
      this.selectedTema = response;
      /* this.displayTema = response; */
      // //console.log('DISPLAY TEMA: ', this.displayTema);

      this.filterData(response);
    })

  }

  temaSelected(tema: any) {

    /* this.displayTema = this.selectedTema; */
    // //console.log('selectedtema ' + this.selectedTema);

    //console.log(this.rutaLimpia)

    let rutaUsable: string;

    if (tema.Ruta) {
      rutaUsable = tema.Ruta
    } else {
      rutaUsable = tema
    }

    let query: string = 'select distinct ?refArea ?nameRefArea ?refPeriod (strafter(str(?refPeriod), "http://reference.data.gov.uk/id/year/") AS ?nameRefPeriod) '

    let index = rutaUsable.indexOf('/')

    // //console.log(rutaUsable.substring(index + 1).replaceAll('/', '-'));

    let rutaLimpia = '/' + rutaUsable.substring(index + 1).replaceAll('/', '-')
    this.rutaLimpia = rutaLimpia.substring(1);

    let queryColumna: string = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FcolUri+%3FtipoCol+str%28%3FnombreCol%29%0D%0A+where+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset${rutaLimpia}%3E+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23structure%3E+%3Fdsd.%0D%0A++%3Fdsd+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23component%3E+%3Fcol.%0D%0A++%3Fcol+%3FtipoCol+%3FcolUri.%0D%0A++%3FcolUri+rdfs%3Alabel+%3FnombreCol.%0D%0A%7D%0D%0A%0D%0ALIMIT+500%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`

    this.aragopediaSvc.getData(queryColumna).subscribe(data => {

      this.columnas = data.results.bindings;

      this.columnas.forEach((element: any) => {
        let nombreColumnaAux = element['callret-2'].value.replaceAll(' ', '_').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[{(/,.)}]/g, '');
        query += '?' + nombreColumnaAux + ' as ' + '?' + nombreColumnaAux + ' '
      });

      this.aragopediaSvc.changeColumnas(this.columnas);

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

        let tipoZona = "";
        let nombreZona = "";

        // //console.log(this.selectedProvinciaNombre != '');
        // //console.log(this.selectedComarcaNombre != '');
        // //console.log(this.selectedMunicipioNombre != '');


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
        // //console.log("nombre zona " + nombreZona);

        // //console.log(this.deleteSpace(nombreZona));

        let uriPrefix = "<http://opendata.aragon.es/recurso/territorio/" + tipoZona + "/";
        query += "FILTER (?refArea IN (";
        query += uriPrefix + this.deleteSpace(nombreZona) + ">";
        query += ")).\n";
      }

      this.columnas.forEach((element: any) => {
        let nombreColumnaAux = element['callret-2'].value.replaceAll(' ', '_').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[{(/,.)}]/g, '')
        query += "OPTIONAL {  ?obs <" + element.colUri.value + "> ?" + nombreColumnaAux + " } .\n";
        element
      });

      query += "} \n";
      query += "ORDER BY ASC(?refArea) ASC(?refPeriod)\n";
      query += "LIMIT 200\n"

      // //console.log(query);
      // //console.log(encodeURIComponent(query));

      this.sparql(query);

      this.queryTabla = 'https://opendata.aragon.es/sparql?default-graph-uri=&query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';

      this.aragopediaSvc.change(this.queryTabla);

      if (this.selectedTema != '') {
        this.displayTema = this.selectedTema;
      }

      this.selectedTema = '';
      this.firstLand = false;
    })

    // //console.log(rutaLimpia)
    if (rutaLimpia !== '' && rutaLimpia !== undefined && this.selectedProvincia != '') {
      this.router.navigate(['aragopedia'], { queryParams: { tipo: this.tipoLocalidad, id: this.selectedProvincia, datos: this.rutaLimpia } })
    } else if (rutaLimpia !== '' && rutaLimpia !== undefined && this.selectedComarca != '') {
      this.router.navigate(['aragopedia'], { queryParams: { tipo: this.tipoLocalidad, id: this.selectedComarca, datos: this.rutaLimpia } })
    } else if (rutaLimpia !== '' && rutaLimpia !== undefined && this.selectedMunicipio != '') {
      this.router.navigate(['aragopedia'], { queryParams: { tipo: this.tipoLocalidad, id: this.selectedMunicipio, datos: this.rutaLimpia } })
    }

  }

  temaSelectedAuto(tema: any) {

    //console.log('temaSelectedAuto ' + tema)

    let nombreZona = "";

    this.displayTema = this.selectedTema;
    // //console.log('selectedtema ' + this.selectedTema);

    let rutaUsable: string;

    if (tema.Ruta) {
      rutaUsable = tema.Ruta
    } else {
      rutaUsable = tema
    }

    this.showTemas.forEach((element: any) => {
      let rutaElement = element.Ruta.substring(element.Ruta.indexOf('/') + 1).replaceAll('/', '-');
      if (rutaElement === rutaUsable) {
        //console.log('done')
        this.firstLand = false;
        this.displayTema = element.Descripcion;
      }

    });
    setTimeout(() => {

      let query: string = 'select distinct ?refArea ?nameRefArea ?refPeriod (strafter(str(?refPeriod), "http://reference.data.gov.uk/id/year/") AS ?nameRefPeriod) '

      let index = rutaUsable.indexOf('/')

      // //console.log(rutaUsable.substring(index + 1).replaceAll('/', '-'));

      let rutaLimpia = '/' + rutaUsable.substring(index + 1).replaceAll('/', '-')
      this.rutaLimpia = rutaLimpia.substring(1);

      let queryColumna: string = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FcolUri+%3FtipoCol+str%28%3FnombreCol%29%0D%0A+where+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset${rutaLimpia}%3E+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23structure%3E+%3Fdsd.%0D%0A++%3Fdsd+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23component%3E+%3Fcol.%0D%0A++%3Fcol+%3FtipoCol+%3FcolUri.%0D%0A++%3FcolUri+rdfs%3Alabel+%3FnombreCol.%0D%0A%7D%0D%0A%0D%0ALIMIT+500%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`

      this.aragopediaSvc.getData(queryColumna).subscribe(data => {

        this.columnas = data.results.bindings;

        this.columnas.forEach((element: any) => {
          let nombreColumnaAux = element['callret-2'].value.replaceAll(' ', '_').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[{(/,.)}]/g, '');
          query += '?' + nombreColumnaAux + ' as ' + '?' + nombreColumnaAux + ' '
        });

        this.aragopediaSvc.changeColumnas(this.columnas);

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

          // //console.log(this.selectedProvinciaNombre != '');
          // //console.log(this.selectedComarcaNombre != '');
          // //console.log(this.selectedMunicipioNombre != '');


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

          // //console.log("nombre zona " + nombreZona);

          // //console.log(this.deleteSpace(nombreZona));

          let uriPrefix = "<http://opendata.aragon.es/recurso/territorio/" + tipoZona + "/";
          query += "FILTER (?refArea IN (";
          query += uriPrefix + this.deleteSpace(nombreZona) + ">";
          query += ")).\n";
        }

        this.columnas.forEach((element: any) => {
          let nombreColumnaAux = element['callret-2'].value.replaceAll(' ', '_').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[{(/,.)}]/g, '')
          query += "OPTIONAL {  ?obs <" + element.colUri.value + "> ?" + nombreColumnaAux + " } .\n";
          element
        });

        query += "} \n";
        query += "ORDER BY ASC(?refArea) ASC(?refPeriod)\n";
        query += "LIMIT 200\n"

        // //console.log(query);
        // //console.log(encodeURIComponent(query));

        this.sparql(query);

        this.queryTabla = 'https://opendata.aragon.es/sparql?default-graph-uri=&query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';

        this.aragopediaSvc.change(this.queryTabla);

        if (this.selectedTema != '') {
          this.displayTema = this.selectedTema;
        }

        this.selectedTema = '';
        this.firstLand = false;
      })

      // //console.log(rutaLimpia)
      if (rutaLimpia !== '' && rutaLimpia !== undefined && this.selectedProvincia != '') {
        this.router.navigate(['aragopedia'], { queryParams: { tipo: this.tipoLocalidad, id: this.selectedProvincia, datos: this.rutaLimpia } })
      } else if (rutaLimpia !== '' && rutaLimpia !== undefined && this.selectedComarca != '') {
        this.router.navigate(['aragopedia'], { queryParams: { tipo: this.tipoLocalidad, id: this.selectedComarca, datos: this.rutaLimpia } })
      } else if (rutaLimpia !== '' && rutaLimpia !== undefined && this.selectedMunicipio != '') {
        this.router.navigate(['aragopedia'], { queryParams: { tipo: this.tipoLocalidad, id: this.selectedMunicipio, datos: this.rutaLimpia } })
      }

      this.aragopediaSvc.lastZona = nombreZona;
    }, 200);
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
      // //console.log(data);

      if (this.selectedTema != '') {
        this.displayTema = this.selectedTema;
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

