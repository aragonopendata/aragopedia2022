import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { dateFormat } from 'dc';
import { AragopediaService } from '../aragopedia-tabla-datos/aragopediaService';
import { ComarcasComponent } from './location/comarcas/comarcas.component';
import { LocationComponent } from './location/location.component';
import { MunicipiosComponent } from './location/municipios/municipios.component';
import { ProvinciasComponent } from './location/provincias/provincias.component';

@Component({
  selector: 'app-aragopedia-selector-temas',
  templateUrl: './aragopedia-selector-temas.component.html',
  styleUrls: ['./aragopedia-selector-temas.component.scss']
})
export class AragopediaSelectorTemasComponent implements OnInit {

  constructor(public aragopediaSvc: AragopediaService, private fb: FormBuilder) { }

  @ViewChild(LocationComponent) location: any;


  temp = undefined;

  formGroup!: FormGroup;

  queryTemas!: string;
  temasControl = new FormControl('');
  selectedTema: any = '';

  selectedProvincia: any = '';
  selectedComarca: any = '';
  selectedMunicipio: any = '';
  unique: any;
  temas!: any;

  temasComunidad = [{}];
  temasProvincia = [{}];
  temasComarca = [{}];
  temasMunicipio = [{}];

  queryUrlWikiData!: string;

  queryUrlComarcasId!: string
  queryUrlMunicipiosId!: string;

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

    if (this.selectedProvincia !== undefined) {
      this.showTemas = this.temasProvincia;
      this.temasActive = true;
      console.log(this.showTemas);

    } else if (this.selectedComarca !== undefined) {
      this.showTemas = this.temasComarca;
      this.temasActive = true;
    } else if (this.selectedMunicipio !== undefined) {
      this.showTemas = this.temasMunicipio;
      this.temasActive = true;
    }
  }

  temaSelected(tema: any) {
    let query: string = 'select distinct ?refArea ?nameRefArea ?refPeriod (strafter(str(?refPeriod), "http://reference.data.gov.uk/id/year/") AS ?nameRefPeriod) '

    let index = tema.Ruta.indexOf('/')

    let rutaLimpia = '/' + tema.Ruta.substring(index + 1).replaceAll('/', '-')
    let queryColumna: string = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FcolUri+%3FtipoCol+str%28%3FnombreCol%29%0D%0A+where+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset${rutaLimpia}%3E+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23structure%3E+%3Fdsd.%0D%0A++%3Fdsd+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23component%3E+%3Fcol.%0D%0A++%3Fcol+%3FtipoCol+%3FcolUri.%0D%0A++%3FcolUri+rdfs%3Alabel+%3FnombreCol.%0D%0A%7D%0D%0A%0D%0ALIMIT+500%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`

    this.aragopediaSvc.getData(queryColumna).subscribe(data => {
      this.columnas = data.results.bindings;

      this.columnas.forEach((element: any) => {
        let nombreColumnaAux = element['callret-2'].value.replaceAll(' ', '_').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
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

      //Añadir código zonas

      this.columnas.forEach((element: any) => {
        let nombreColumnaAux = element['callret-2'].value.replaceAll(' ', '_').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        query += "OPTIONAL {  ?obs <" + element.colUri.value + "> ?" + nombreColumnaAux + " } .\n";
        element
      });

      query += "} \n";
      query += "ORDER BY ASC(?refArea) ASC(?refPeriod)\n";

      console.log(query);

    })
  }
}