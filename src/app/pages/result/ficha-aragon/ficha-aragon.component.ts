import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ngxCsv } from 'ngx-csv';
import { AragopediaService } from 'src/app/components/aragopedia-tabla-datos/aragopediaService';
import { ResultService } from '../result.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartEvent } from 'chart.js';


interface Persona {
  nombre: { type: string, value: string },
  org: { type: string, value: string },
  orgTitle: { type: string, value: string },
  persona: { type: string, value: string }
}

interface DataLinks {
  sueloUrbano: string,
  sueloRural: string,
  edificiosDestinadosLocales: string,
  habitantes: string,
  densidad: string,
  poligonos: string,
  incendios: string,
  hectareasAfectadas: string,
  alojamientosHoteleros: string,
  alojamientosRurales: string,
  municipios: string,
  edadMedia: string,
  tablaPoblacion: string,
  miembrosPleno: string,
  datosContacto: string,
  image: string,
  publicaciones: string,
  presupuestos: string
}

@Component({
  selector: 'app-ficha-aragon',
  templateUrl: './ficha-aragon.component.html',
  styleUrls: ['../result.component.scss']
})

export class FichaAragonComponent implements OnInit {
  // Configuración gráfica
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  public lineChartType: ChartType = 'line';
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Habitantes',
        backgroundColor: 'rgba(214,234,240,0.4)',
        borderColor: '#00475C',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(214,234,240,0.4)',
        fill: 'origin',
      },],
    labels: []
  }

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5
      }
    },
    scales: {
      y: {
        stacked: true
      }
    }
  }

  constructor(public resultSvc: ResultService, private fb: FormBuilder, private http: HttpClient, public aragopediaSvc: AragopediaService) { }

  temp = undefined;

  lugarBuscado: any;
  lugarBuscadoParsed!: string;
  idLocalidad: any;
  tipoLocalidad!: string;
  comunidadActual: any;
  poblacion: any;
  yearPoblacion: any;
  tablaPoblacion: any;
  yearsTablaPoblacion: number[] = [];
  density: any;
  sueloUrbano: any;
  sueloRural: any;
  poligonos: any;
  creativeWork: any;
  numberOfCreativeWork: any;
  alojamientosTuristicos: any;
  oficinasTurismo: any;
  comunidad: string[] = [];
  provincia: string[] = [];
  municipio: string[] = [];
  porcentajeSueloUrbano: any;
  porcentajeSueloRural: any;
  densidadPoblacion: any
  imageWikiDataUrl!: string;
  map!: string;
  urlMap!: string;
  incendiosUltimosAnos!: string;
  hectareasQuemadas!: string;
  edadMediaHombres!: string;
  edadMediaMujeres!: string;
  yearEdadMedia!: string;
  explotacionesGanaderas!: string;
  plazasHoteleras!: string;
  codigoIne: any;
  leerMas: boolean = false;
  personasIlustres: any;
  cantidadPersonasIlustres!: number;
  oficinasComarcales!: string;
  miembrosPleno!: Persona[];
  cantidadMiembrosPleno!: number;
  direccion!: string;
  codPostal!: string;
  email!: string;
  telefono!: string;
  municipiosEnTerritorio: any;
  dataYearExtension: any;
  presupuestos!: string;


  dataSource: DataLinks = {
    sueloUrbano: '',
    sueloRural: '',
    edificiosDestinadosLocales: '',
    habitantes: '',
    densidad: '',
    poligonos: '',
    incendios: '',
    hectareasAfectadas: '',
    alojamientosHoteleros: '',
    alojamientosRurales: '',
    municipios: '',
    edadMedia: '',
    tablaPoblacion: '',
    miembrosPleno: '',
    datosContacto: '',
    image: '',
    publicaciones: '',
    presupuestos: ''
  };


  //Queries variables
  queryIdWikiData!: string;
  queryImageWikiData!: string;
  queryUrlDensidadPoblacion!: string;
  queryUrlExtension!: string;
  queryUrlPoblacion!: string;
  queryUrlPoligonos!: string;
  queryUrlCreativeWork!: string;
  queryUrlTotalCreativeWork!: string;
  queryUrlAlojamientosTuristicos!: string;
  queryUrlRatioSuelo!: string;
  queryUrlIncendios!: string;
  queryUrlEdadMedia!: string;
  queryUrlExplotacionesGanaderas!: string;
  queryUrlPlazasHoteleras!: string;
  queryUrlGetCodigoIne!: string;
  queryUrlPersonasIlustres!: string;
  queryNombresIne!: string;
  queryUrlOficinasComarcales!: string;
  queryUrlMiembrosPleno!: string;
  queryUrlContacto!: string;
  queryUrlMunicipiosEnTerritorio!: string;
  queryUrlPresupuestos!: string;

  // ARAGOPEDIA
  queryTemas!: string;
  temasAragopedia!: [{}];

  temasComunidad = [{}];
  temasProvincia = [{}];
  temasComarca = [{}];
  temasMunicipio = [{}];
  temasControl = new FormControl('');
  selectedTema: any = '';
  displayTema: any = '';
  showTemas: any;
  queryTabla!: string;
  columnas: any;
  errorTabla: boolean = false;

  filteredTemas: any;
  formGroup!: FormGroup;

  // Download data

  dataDownload = this.temp || [{ nombre: '', email: '', telefono: '', direccion: '', codigoPostal: '', habitantes: '', sueloRural: '', sueloUrbano: '', poligonosIndustriales: '', plazasHoteleras: '', incendiosDesde2022: '', hectareasAfectadasPorIncendios: '', mencionesEnPublicaciones: '', alojamientosTuristicos: '', edadMediaHombres: '', edadMediaMujeres: '', creativeWorks: '', miembrosPleno: '', municipiosDelTerritorio: '' }];



  ngOnInit() {

    //Query id-localidades-tipo
    this.queryIdWikiData = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+%3Fs+str%28%3Fnombre%29+%3Fid+%3Fclasif%0D%0Afrom+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E%0D%0Awhere++%7B%0D%0A++++++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23classification%3E+%3Fclasif.+%0D%0A++++++%3Fs+dc%3Aidentifier+%3Fid.+%0D%0A+++++%3Fs+dc%3Atitle+%3Fnombre.%0D%0A+++++VALUES+%3Fclasif+%7B%3Chttps%3A%2F%2Fwww.geonames.org%2Fontology%23A.ADM2%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fkos%2Fcomarca%3E+%3Chttps%3A%2F%2Fwww.geonames.org%2Fontology%23P.PPL%3E%7D%0D%0A%7D%0D%0Aorder+by+asc%28%3Fclasif%29+%3Fid+%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

    //Sacamos el nombre del municipio a través del codigo INE
    this.codigoIne = '2';
    this.queryNombresIne = `https://opendata.aragon.es/sparql?default-graph-uri=&query=prefix+dbpedia%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2F%3E+%0D%0Aprefix+org%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23%3E%0D%0Aprefix+aragopedia%3A+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23%3E%0D%0A%0D%0Aselect+%3Fnombre+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E++where+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fcomunidad%2F${this.codigoIne}%3E+dc%3Atitle+%3Fnombre%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

    this.queryUrlMunicipiosEnTerritorio = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+count%28distinct+%3Fs%29+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23subOrganizationOf%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fcomunidad%2F2%3E.+%7D%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
    this.dataSource.municipios = this.exportHtmlQuery(this.queryUrlMunicipiosEnTerritorio);

    //Obtenemos id y tipo de localidad antes de nada

    this.resultSvc.getData(this.queryIdWikiData).subscribe((data: any) => {
      // const found = data.results.bindings.find((element: any) => this.capitalizeString(element['callret-1'].value) == this.lugarBuscado);

      // this.codigoIne = found.id.value;

      // const urlAnalizada = found.s.value.split('/');
      // this.tipoLocalidad = urlAnalizada[6];

      if (this.codigoIne !== undefined) {

        //Queries con ID
        this.map = `https://idearagon.aragon.es/geoserver/VISOR2D/wms?service=WMS&version=1.1.0&request=GetMap&layers=VISOR2D%3ALimAragon&bbox=554192.3553%2C4406927.4576%2C825631.1337%2C4760878.6523&width=300&height=425&srs=EPSG%3A25830&format=image/png`;

        this.urlMap = `https://idearagon.aragon.es/visor/index.html`

        this.queryUrlPoligonos = `https://opendata.aragon.es/sparql?default-graph-uri=http%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2&query=PREFIX+org%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23%3E%0D%0Aselect++count%28distinct+%3Fs%29+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A%3Fs+%3Fp+%3Fo%3B%0D%0A+++a+org%3AOrganization%3B%0D%0A+org%3Aclassification%09%3Chttps%3A%2F%2Fwww.geonames.org%2Fontology%23L.INDS%3E+%3B%0D%0A++++dc%3Asource+%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2F0d8fab77-91db-4832-8184-ea83a0bc4ca5%2Fresource%2F66c34c59-7d01-4e1c-983c-7edc48602cda%3E.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
        this.dataSource.poligonos = this.exportHtmlQuery(this.queryUrlPoligonos);

        this.queryUrlAlojamientosTuristicos = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+count%28+distinct+%3Fs%29+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B+%0D%0A%0D%0A%3Fs+a+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23Organization%3E%3B+%0D%0A%0D%0A++++dc%3Asource+%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2Fb58bc283-573f-4fa5-9c0c-ff9136eab2c1%2Fresource%2F993c5ebf-5ced-478a-8791-159b2e87e789%3E.+%0D%0A%0D%0A%7D+&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
        this.dataSource.alojamientosRurales = this.exportHtmlQuery(this.queryUrlAlojamientosTuristicos)

        this.queryUrlExplotacionesGanaderas = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+count%28distinct%28%3Fs%29%29++from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A%3Fs+%3Fx+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fcomunidad%2F${this.codigoIne}%3E+.+++%0D%0AFILTER+%28%28REGEX%28STR%28%3Fx%29%2C+%22%5Ehttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fdimensionproperty%2Fexplotaciones-ganaderas*%22%29%29%29.%0D%0A%7D%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

        this.queryUrlPlazasHoteleras = `https://opendata.aragon.es/sparql?default-graph-uri=http%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2&query=select+count%28+distinct+%3Fs%29+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A%3Fs+a+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23Organization%3E%3B%0D%0A++++dc%3Asource+%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2F87b07cd4-c1b0-41c4-b071-c18db7c0cf58%2Fresource%2F8303127d-90c6-4e94-9617-e6e602a0140a%3E.%0D%0A%7D%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

        this.dataSource.alojamientosHoteleros = this.exportHtmlQuery(this.queryUrlPlazasHoteleras);

        this.queryUrlGetCodigoIne = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+%3Fwikidata+%3Faragopedia+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fcomunidad%2F2%3E+skos%3AexactMatch+%3Fwikidata%3B%0D%0A++skos%3AexactMatch+%3Faragopedia.%0D%0A++FILTER%28regex%28%3Fwikidata%2C+%22http%3A%2F%2Fwww.wikidata.org%2F%22%29%29.%0D%0A++FILTER%28regex%28%3Faragopedia%2C+%22http%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FComunidadAutonoma%2F%22%29%29.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

        this.queryUrlPresupuestos = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+%3Furl+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fcomunidad%2F2%3E+dc%3Arelation+%3Furl.+%0D%0A++filter%28regex%28%3Furl%2C+%22https%3A%2F%2Fpresupuesto.aragon.es%2F%22%29%29.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`
        this.dataSource.presupuestos = this.exportHtmlQuery(this.queryUrlPresupuestos)

        //Obtención de datos por ID

        this.resultSvc.getData(this.queryUrlPoligonos).subscribe((data: any) => {
          this.poligonos = data.results.bindings[0]['callret-0'].value;
          this.dataDownload[0].poligonosIndustriales = this.poligonos;

        });

        this.resultSvc.getData(this.queryUrlAlojamientosTuristicos).subscribe((data: any) => {
          this.alojamientosTuristicos = data.results.bindings[0]['callret-0'].value;
          this.dataDownload[0].alojamientosTuristicos = this.alojamientosTuristicos;
        });

        this.resultSvc.getData(this.queryUrlExplotacionesGanaderas).subscribe((data) => {
          if (data.results.bindings.length !== 0) {
            let explotacionesGanaderas = data.results.bindings;
            let total: number = 0;
            explotacionesGanaderas.forEach((element: any) => {
              total = total + parseInt(element['callret-0'].value);
            });
            this.explotacionesGanaderas = total.toString();
          }
        });

        this.resultSvc.getData(this.queryUrlPlazasHoteleras).subscribe((data) => {
          this.plazasHoteleras = data.results.bindings[0]['callret-0'].value;
          this.dataDownload[0].plazasHoteleras = this.plazasHoteleras;
        });

        this.resultSvc.getData(this.queryUrlPresupuestos).subscribe(data => {
          this.presupuestos = data.results.bindings[0].url.value;
        })

        this.resultSvc.getData(this.queryUrlGetCodigoIne).subscribe((data) => {
          const urlAnalizada = data.results.bindings[0].wikidata.value;
          this.idLocalidad = urlAnalizada.split('/')[4];

          this.queryImageWikiData = `https://query.wikidata.org/sparql?query=%0Aselect%20%3Fimg%20where%20%7B%20wd%3A${this.idLocalidad}%20wdt%3AP18%20%3Fimg%20%7D`;
          this.dataSource.image = this.exportHtmlQuery(this.queryImageWikiData);

          this.queryUrlPersonasIlustres = `https://query.wikidata.org/sparql?query=SELECT%20%3Fitem%20%3FitemLabel%20%3Fabout%20(count(%3Fx)%20as%20%3Fcont)%0AWHERE%20%0A%7B%0A%20%20%3Fitem%20wdt%3AP19%20wd%3A${this.idLocalidad}.%0A%20%20%3Fitem%20%3Fx%20%20%3Fo.%0A%20%20%3Fabout%20schema%3Aabout%20%3Fitem.%0A%20%20%3Fabout%20schema%3AinLanguage%20%22es%22.%0A%20%20%3Fabout%20schema%3AisPartOf%20%3Chttps%3A%2F%2Fes.wikipedia.org%2F%3E.%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22es%2Cen%22.%20%7D%0A%7D%0Agroup%20by%20%3Fitem%20%3FitemLabel%20%3Fabout%0Aorder%20by%20desc(%3Fcont)`;

          this.resultSvc.getData(this.queryImageWikiData).subscribe((data: any) => {

            this.imageWikiDataUrl = data.results.bindings[0].img.value;
          });

          this.resultSvc.getData(this.queryUrlPersonasIlustres).subscribe((data) => {

            this.personasIlustres = data.results.bindings;
            this.cantidadPersonasIlustres = this.personasIlustres.length;

            this.personasIlustres.forEach((element: any) => {
              let persona = `Nombre: ${element.itemLabel.value}; URL Wikipedia: ${element.about.value}`;
            });
          })

        });

      }

    });


    //Queries URLs NOMBRE MUNICIPIO

    this.resultSvc.getData(this.queryNombresIne).subscribe(data => {
      this.lugarBuscado = 'Aragón';
      this.dataDownload[0].nombre = this.lugarBuscado;
      this.lugarBuscadoParsed = 'Ababuj';


      // Queries con nombres

      this.queryUrlDensidadPoblacion = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct++%3FyearPob+as+%3Fyear+xsd%3Aint%28%3Fpoblacion%29%2F%3Fsuperficie_km2+as+%3Fdensidad+where+%7B%0D%0A%3FobsPob+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001A%3E.%0D%0A%3FobsKm++qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F02-020006A%3E.%0D%0A%3FobsPob+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriodPob.%0D%0A%3FobsKm+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriodKm.%0D%0A%0D%0A%3FrefPeriodPob+time%3AinXSDgYear+%3FyearPob.%0D%0A%3FrefPeriodKm+time%3AinXSDgYear+%3FyearKm.%0D%0A%3FobsPob+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FComunidadAutonoma%2FArag%C3%B3n%3E.%0D%0A%3FobsKm+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FComunidadAutonoma%2FArag%C3%B3n%3E.%0D%0A%0D%0A+%3FobsPob+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23poblacion%3E+%3Fpoblacion+.%0D%0A++%3FobsKm+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fdimension%23superficie-km2%3E+%3Fsuperficie_km2++.%0D%0A%7D%0D%0AORDER+BY+desc%28%3FyearPob%29+desc%28%3FyearKm%29%0D%0ALIMIT+1&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
      this.dataSource.densidad = this.exportHtmlQuery(this.queryUrlDensidadPoblacion);

      this.queryUrlExtension = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct++str%28%3Fyear%29+AS+%3FnameRefPeriod++sum%28xsd%3Aint%28%3Frust%29%29+as+%3Frustico+sum%28xsd%3Aint%28%3Furba%29%29+as+%3Furbano+where+%7B+%0D%0A+++%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019A%3E%3B%0D%0A++++++++%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FComunidadAutonoma%2FAragón%3E%3B%0D%0A++++++++%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.+%0D%0A%0D%0A++%3FrefPeriod+time%3AinXSDgYear+%3Fyear.+%0D%0A%0D%0A++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23rustico-superficie%3E+%3Frust.+%0D%0A++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23urbano-superficie%3E+%3Furba.+%0D%0A%7D+%0D%0AORDER+BY+desc%28%3Fyear%29%0D%0ALIMIT+1%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
      this.dataSource.sueloRural = this.exportHtmlQuery(this.queryUrlExtension);
      this.dataSource.sueloUrbano = this.exportHtmlQuery(this.queryUrlExtension);

      this.queryUrlPoblacion = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FrefArea+%3FnameRefArea+%3FnameRefPeriod+%3Fpoblac+where+%7B%0D%0A%0D%0Aselect+distinct+%3FrefArea+%3FnameRefArea+str%28%3Fyear%29+AS+%3FnameRefPeriod+xsd%3Aint%28%3Fpoblacion%29+as+%3Fpoblac+where+%7B%0D%0A%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001A%3E.%0D%0A%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A%3FrefPeriod+time%3AinXSDgYear+%3Fyear.%0D%0A%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A%3FrefArea+rdfs%3Alabel+%3FnameRefArea.%0D%0AFILTER+%28%3FrefArea+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FComunidadAutonoma%2FArag%C3%B3n%3E%29%29.%0D%0AOPTIONAL+%7B+%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23poblacion%3E+%3Fpoblacion+%7D+.%0D%0A%7D%0D%0AORDER+BY+desc%28%3Fyear%29%2C+%3FrefArea%0D%0ALIMIT+5%0D%0A%7D%0D%0Aorder+by+%3FrefArea%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
      this.dataSource.habitantes = this.exportHtmlQuery(this.queryUrlPoblacion);
      this.dataSource.tablaPoblacion = this.exportHtmlQuery(this.queryUrlPoblacion);

      this.queryUrlCreativeWork = `https://opendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+schema%3A+%3Chttp%3A%2F%2Fschema.org%2F%3E%0D%0A%0D%0Aselect+distinct+%3Ftitle+%3Furl+%3Ftema+%3Fresumen%0D%0Awhere+%7B%0D%0A++%3Fs+a+schema%3ACreativeWork%3B%0D%0A+++++++schema%3Aabout+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FComunidadAutonoma%2FArag%C3%B3n%3E%3B%0D%0A+++++++schema%3Atitle+%3Ftitle%3B%0D%0A+++++++schema%3Aurl+%3Furl%3B%0D%0A+++++++schema%3Aconcept+%3Ftema%3B%0D%0Aschema%3Aabstract+%3Fresumen.%0D%0A%7D%0D%0Alimit+10&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

      this.queryUrlTotalCreativeWork = `https://opendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+schema%3A+%3Chttp%3A%2F%2Fschema.org%2F%3E%0D%0A%0D%0Aselect+count+%28%3Fs%29+%0D%0Awhere+%7B%0D%0A++%3Fs+a+schema%3ACreativeWork%3B%0D%0A+++++++schema%3Aabout+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FComunidadAutonoma%2FArag%C3%B3n%3E%3B%0D%0A+++++++schema%3Atitle+%3Ftitle%3B%0D%0A+++++++schema%3Aurl+%3Furl%3B%0D%0A+++++++schema%3Aconcept+%3Ftema%3B%0D%0Aschema%3Aabstract+%3Fresumen.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
      this.dataSource.publicaciones = this.exportHtmlQuery(this.queryUrlTotalCreativeWork);

      this.queryUrlRatioSuelo = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3Fyear+xsd%3Aint%28%3Frust%29+as+%3Frustico+xsd%3Aint%28%3Furba%29+as+%3Furbano+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019A%3E.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A%3FrefPeriod+time%3AinXSDgYear+%3Fyear.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FComunidadAutonoma%2FArag%C3%B3n%3E.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23rustico-superficie%3E+%3Frust++%7D+.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23urbano-superficie%3E+%3Furba++%7D+.%0D%0A%7D%0D%0AORDER+BY+desc%28%3Fyear%29%0D%0ALIMIT+1%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
      this.dataSource.sueloUrbano = this.exportHtmlQuery(this.queryUrlRatioSuelo);
      this.dataSource.sueloRural = this.exportHtmlQuery(this.queryUrlRatioSuelo);

      this.queryUrlIncendios = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct++%3FrefArea+%3FnameRefArea+sum+%28%3Fincendios+%29+as+%3Fincendios+++sum+%28xsd%3Adouble%28%3Fsuperficie_forestal_afectada%29+%29+as+%3Fsuperficie_forestal_afectada+++%0D%0A+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++FILTER%28%3Fdataset+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F04-040017A%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A%3FrefPeriod+time%3AinXSDgYear+%3Fyear.%0D%0AFILTER+%28%3Fyear+%3E%3D2001+%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+%0D%0A+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0A%0D%0AOPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23incendios%3E+%3Fincendios++%7D+.%0D%0AOPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23superficie-forestal-afectada%3E+%3Fsuperficie_forestal_afectada++%7D+.%0D%0A%7D%0D%0Agroup+by+++%3FrefArea+%3FnameRefArea%0D%0ALIMIT+20%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
      this.dataSource.incendios = this.exportHtmlQuery(this.queryUrlIncendios);
      this.dataSource.hectareasAfectadas = this.exportHtmlQuery(this.queryUrlIncendios);

      this.queryUrlEdadMedia = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3Fyear+xsd%3Afloat%28%3Fvalor%29+as+%3Fval+%3Fsexo+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030006A%3E%3B%0D%0A++++++++++++%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FComunidadAutonoma%2FArag%C3%B3n%3E%3B%0D%0A+++++++++++%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A++%7B+select+distinct+%3FrefPeriod+where+%7B%0D%0A+++++++++++++++++++++++++++++++++++++++++++++++++++%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030006TM%3E.%0D%0A++++++++++++++++++++++++++++++++++++++++++++++++++++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+++++++++++++++++++++++++++++++++++++++++++++%7D%0D%0A+++++++++++++++++++++++++++++++++++++++++++++ORDER+BY+desc%28%3FrefPeriod%29%0D%0A+++++++++++++++++++++++++++++++++++++++++++++LIMIT+1++%7D%0D%0A%0D%0A%0D%0A++++%3FrefPeriod+time%3AinXSDgYear+%3Fyear.%0D%0A%0D%0A++++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fdimension%23sexo%3E+%3Ffoo1.%0D%0A++++%3Ffoo1+skos%3AprefLabel+%3Fsexo++.%0D%0A+++OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23edad-media-de-la-poblacion%3E+%3Fvalor++%7D+.%0D%0A%7D%0D%0AORDER+BY+desc%28%3Fyear%29%2C+desc%28%3Fval%29%2C+%3Fsexo%0D%0ALIMIT+100%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
      this.dataSource.edadMedia = this.exportHtmlQuery(this.queryUrlEdadMedia);

      this.queryUrlOficinasComarcales = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%0D%0A%3FrefArea+%3FnameRefArea+%3FrefPeriod+%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F%22%29+AS+%3FnameRefPeriod%29+%0D%0Axsd%3Aint%28%3Fnumero_de_edificios%29+++where+%7B%0D%0A+%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010009A%3E.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0AFILTER+%28%3FrefPeriod+IN+%28%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2011%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.FILTER+%28%3FrefArea+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FComunidadAutonoma%2FAragón%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fdimension%23tipo-edificio-detalle%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fkos%2Fiaest%2Ftipo-edificio-detalle%2Flocales%3E.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23numero-de-edificios%3E+%3Fnumero_de_edificios+.%0D%0A%7D+%0D%0Aorder+by+desc%28%3FrefPeriod%29%0D%0ALIMIT+1%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`
      this.dataSource.edificiosDestinadosLocales = this.exportHtmlQuery(this.queryUrlOficinasComarcales);

      this.queryUrlMiembrosPleno = `https://opendata.aragon.es/sparql?default-graph-uri=&query=prefix+org%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23%3E%0D%0Aprefix+ei2av2%3A+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%23%3E%0D%0A%0D%0Aselect+distinct+%3Forg+%3ForgTitle+%3Fpersona+%3Fnombre%0D%0Afrom+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A+++%3Forg+%3Fp+%3Fo%3B%0D%0A+++ei2av2%3Alegislature+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Flegislatura%2F25%3E%3B%0D%0A+++dc%3Atitle+%3ForgTitle%3B%0D%0A++ei2av2%3Aorder+%3Forder.%0D%0A++%3Fcargo+org%3ApostIn+%3Forg+%3B%0D%0A+++++++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Forder%3E+%221%22%5E%5E%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23int%3E.%0D%0A%0D%0A++%3Fpersona+org%3Aholds+%3Fcargo%3B%0D%0A+++++++foaf%3Aname+%3Fnombre.%0D%0A%0D%0A+++FILTER+NOT+EXISTS+%7B+%3Forg+org%3AsubOrganizationOf+%3Fx%7D%0D%0A+%7D%0D%0Aorder+by+%3Forder&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
      this.dataSource.miembrosPleno = this.exportHtmlQuery(this.queryUrlMiembrosPleno);

      this.queryUrlContacto = `https://opendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0D%0APREFIX+ns%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fprov%23%3E%0D%0APREFIX+vcard%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23%3E%0D%0A%0D%0ASELECT+%3Femail+%3Ftel+%3Ffax+%3Fdireccion+%3FcodPostal+%0D%0AFROM+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E%0D%0AWHERE+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Funidad-organizativa%2F3036%3E+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23hasSite%3E+%3FsiteAddress.%0D%0A%0D%0A++%3FsiteAddress+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23siteAddress%3E+%3Faddress2.%0D%0A%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Aemail+%3Femail+%7D.%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Atel+%3Ftel+%7D.%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Afax+%3Ffax+%7D.%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Astreet-address%3Fdireccion+%7D.%0D%0A+++OPTIONAL+%7B%3Faddress2+vcard%3Apostal-code+%3FcodPostal+%7D.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
      this.dataSource.datosContacto = this.exportHtmlQuery(this.queryUrlContacto);


      //Obtención de datos NOMBRE MUNICIPIO

      this.resultSvc.getData(this.queryUrlExtension).subscribe((data: any) => {

        this.sueloUrbano = data.results.bindings[0].urbano.value;
        this.sueloRural = data.results.bindings[0].rustico.value;
        this.dataYearExtension = data.results.bindings[0].nameRefPeriod.value;
        this.dataDownload[0].sueloRural = this.sueloRural;
        this.dataDownload[0].sueloUrbano = this.sueloUrbano;
      });

      this.resultSvc.getData(this.queryUrlDensidadPoblacion).subscribe((data: any) => {
        this.densidadPoblacion = (Number(data.results.bindings[0].densidad.value)).toFixed(1).replace('.', ',');
      });

      this.resultSvc.getData(this.queryUrlTotalCreativeWork).subscribe(data => {
        this.numberOfCreativeWork = data?.results.bindings[0]['callret-0'].value;
        this.dataDownload[0].mencionesEnPublicaciones = this.numberOfCreativeWork.toString();
      })

      this.resultSvc.getData(this.queryUrlCreativeWork).subscribe((data: any) => {
        this.creativeWork = data.results.bindings;

        this.creativeWork.forEach((element: any) => {
          let publicaciones = `Titulo: ${element.title.value}; url: ${element.url.value}; Tema: ${element.tema.value}; Abstract: ${element.resumen.value}`;
          this.dataDownload[0].creativeWorks += publicaciones;
        });

      });

      this.resultSvc.getData(this.queryUrlPoblacion).subscribe((data: any) => {
        this.yearPoblacion = data.results.bindings[0].nameRefPeriod.value;
        this.poblacion = data.results.bindings.find((lugar: any) => lugar.nameRefArea.value === this.lugarBuscado).poblac.value;
        this.dataDownload[0].habitantes = this.poblacion;

        this.comunidadActual = data.results.bindings[0].nameRefArea.value;

        this.tablaPoblacion = data.results.bindings;
        for (let i = 0; i < 5; i++) {
          this.yearsTablaPoblacion.push(data.results.bindings[i].nameRefPeriod.value);
        }
        for (let i = 0; i < 5; i++) {
          const element = this.tablaPoblacion[i].nameRefArea.value;
          this.comunidad.push(element);
        }

        const datos = data.results.bindings;
        for (let i = 4; i >= 0; i--) {
          this.lineChartData.labels?.push(data.results.bindings[i].nameRefPeriod.value)
          this.lineChartData.datasets[0].data.push(Number(datos[i].poblac.value))
        }
        this.chart?.update();
      });


      this.resultSvc.getData(this.queryUrlRatioSuelo).subscribe((data: any) => {
        let totalUrbano = data.results.bindings[0].urbano.value;
        let totalRural = data.results.bindings[0].rustico.value;

        this.porcentajeSueloRural = ((this.sueloRural / totalRural) * 100).toFixed(2).replace('.', ',');
        this.porcentajeSueloUrbano = ((this.sueloUrbano / totalUrbano) * 100).toFixed(2).replace('.', ',');

      });

      this.resultSvc.getData(this.queryUrlIncendios).subscribe((data: any) => {
        this.incendiosUltimosAnos = data.results.bindings[0].incendios.value;
        this.hectareasQuemadas = data.results.bindings[0].superficie_forestal_afectada.value.replace('.', ',');
        this.dataDownload[0].incendiosDesde2022 = this.incendiosUltimosAnos;
        this.dataDownload[0].hectareasAfectadasPorIncendios = this.hectareasQuemadas;
      });

      this.resultSvc.getData(this.queryUrlEdadMedia).subscribe((data) => {
        this.yearEdadMedia = data.results.bindings[0].year.value;
        const total = data.results.bindings;
        const mujeres = Number(total.find((item: any) => item.sexo.value === 'Mujeres').val.value).toFixed(2).replace('.', ',');
        const hombres = Number(total.find((item: any) => item.sexo.value === 'Hombres').val.value).toFixed(2).replace('.', ',');

        this.edadMediaMujeres = mujeres
        this.edadMediaHombres = hombres

        this.dataDownload[0].edadMediaHombres = this.edadMediaHombres;
        this.dataDownload[0].edadMediaMujeres = this.edadMediaMujeres;
      });

      this.resultSvc.getData(this.queryUrlOficinasComarcales).subscribe(data => {
        this.oficinasComarcales = data.results.bindings[0]['callret-4'].value;
      })

      this.resultSvc.getData(this.queryUrlMiembrosPleno).subscribe(data => {
        this.miembrosPleno = data.results.bindings;
        this.cantidadMiembrosPleno = this.miembrosPleno.length;
      })

      this.resultSvc.getData(this.queryUrlContacto).subscribe(data => {

        this.direccion = data.results.bindings[0].direccion.value;
        this.codPostal = data.results.bindings[0].codPostal.value;
        this.email = data.results.bindings[0].email.value;
        this.telefono = data.results.bindings[0].tel.value;

        this.dataDownload[0].email = this.email;
        this.dataDownload[0].telefono = this.telefono;
        this.dataDownload[0].direccion = this.direccion;
        this.dataDownload[0].codigoPostal = this.codPostal;

      })

      this.resultSvc.getData(this.queryUrlMunicipiosEnTerritorio).subscribe(data => {
        this.municipiosEnTerritorio = data.results.bindings[0]['callret-0'].value;
        this.dataDownload[0].municipiosDelTerritorio = this.municipiosEnTerritorio;
      });

    });


    // DATOS ARAGOPEDIA

    this.queryTemas = "https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3Fdataset+%3Fid+%3Fdsd+%3Fnombre++where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++%3Fdataset+dct%3Aidentifier+%3Fid%3B%0D%0A+++++++++++++++++++qb%3Astructure+%3Fdsd.%0D%0A++++%3Fdsd+dc%3Atitle+%3Fnombre.%0D%0A++filter+%28regex%28%3Fid%2C+%22A%24%22%29%29.%0D%0A+++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FComunidadAutonoma%2FArag%C3%B3n%3E.%0D%0A%7D+%0D%0A%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on"

    this.resultSvc.getData(this.queryTemas).subscribe(data => {

      this.temasAragopedia = data.results.bindings;
      let unique = [... new Set(data.results.bindings.map((item: { nombre: any }) => item.nombre))];

      this.showTemas = this.temasAragopedia;
      this.filteredTemas = this.showTemas
      this.initForm();

    })

  }

  createNameForUrl(str: string): string {
    const nameIndex = str.lastIndexOf('/') + 1;
    return str.substring(nameIndex);
  }

  filterData(enteredData: any) {

    this.filteredTemas = this.showTemas.filter((item: any) => {
      return this.removeAccents(item.nombre.toLowerCase()).indexOf(this.removeAccents(enteredData.toLowerCase())) > -1
    })
  }

  removeAccents(str: any): any {
    // return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const acentos: any = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U' };
    return str.split('').map((letra: any) => acentos[letra] || letra).join('').toString();
  }

  initForm() {
    this.formGroup = this.fb.group({
      "tema": [this.selectedTema]
    })

    this.formGroup.get('tema')?.valueChanges.subscribe(response => {

      this.selectedTema = response;
      this.filterData(response)
    })


  }

  //Métodos
  capitalizeString(str: any): string {
    return str.replace(/\w\S*/g, function (txt: any) {
      for (let i = 0; i < txt.length; i++) {
        if (txt[i].toLowerCase() !== 'de'
          && txt[i].toLowerCase() !== 'del'
          && txt[i].toLowerCase() !== 'la'
          && txt[i].toLowerCase() !== 'las'
          && txt[i].toLowerCase() !== 'los') {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
      }

    });
  }

  deleteSpace(str: any): string {
    return str.split(' ').join('_');
  }

  format(number: any) {
    if (typeof number === 'number') {
      let partesNumero = number.toString().split('.');
      partesNumero[0] = partesNumero[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

      return partesNumero.join('.');

    } else {

      let partesNumero = number.split('.');
      partesNumero[0] = partesNumero[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

      return partesNumero.join('.');
    }
  }

  reduceText(text: string): string {
    const reducedText = text.substr(0, 120);
    return (
      this.leerMas ? text : reducedText
    )
  }

  exportHtmlQuery(query: string) {
    const jsonFormat = 'application%2Fsparql-results%2Bjson';
    const htmlFormat = 'text%2Fhtml';

    const count = '+count+';
    const countDistinct = '+count%28distinct%28%3Fs%29%29++';
    const distinct = '+distinct%28%3Fs%29++';

    const htmlQuery = query?.replace(jsonFormat, htmlFormat).replace(count, '+').replace(countDistinct, distinct).replace('+count%28distinct+%3Fs%29+', '+distinct+%3Fs+').replace('+count%28+distinct+%3Fs%29+', '+distinct+%3Fs+').replace('https://query.wikidata.org/sparql?query=', 'https://query.wikidata.org/#');;
    return htmlQuery;
  }

  fileDownload() {
    const options = {
      fieldSeparator: ';',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      title: `Ficha de ${this.lugarBuscado}`,
      useBom: true,
      noDownload: false,
      headers: ["Nombre", "Email", "Teléfono", "Dirección", "Código Postal", "Habitantes", "Suelo Rural", "Suelo Urbano", "Polígonos Industriales", "Alojamientos Hoteleros", "Incendios desde 2001", "Hectáreas afectadas", "Menciones en publicaciones", "Alojamientos de turismo rural", "Edad media de los hombres", "Edad media de las mujeres", "Creative Works", "Miembros del pleno", "Municipios en el territorio"],
      eol: '\n'
    };

    new ngxCsv(this.dataDownload, `Datos de La Comunidad de ${this.lugarBuscado}`, options);
  }

  temaSelected(tema: any) {

    let rutaLimpia = '/' + tema.id.value;
    setTimeout(() => {
      if (rutaLimpia == '/') {
        return;
      }
      let query: string = 'select distinct ?refArea ?nameRefArea ?refPeriod (strafter(str(?refPeriod), "http://reference.data.gov.uk/id/year/") AS ?nameRefPeriod) '

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
          // //console.log(this.selectedMunicipioNombre != '')
          // //console.log("nombre zona " + nombreZona);

          // //console.log(this.deleteSpace(nombreZona));

          let uriPrefix = "<http://opendata.aragon.es/recurso/territorio/" + this.capitalizeString(this.tipoLocalidad) + "/";
          query += "FILTER (?refArea IN (";
          query += uriPrefix + this.lugarBuscadoParsed + ">";
          query += ")).\n";
        }
        let icolumnas = 0
        this.columnas.forEach((element: any) => {

          let nombreColumnaAux = element['callret-2'].value.replaceAll(' ', '_').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[{(/,.)}]/g, '')
          if (element.colUri.value.indexOf("http://opendata.aragon.es/def/iaest/dimension") != -1 && element.colUri.value.indexOf("http://opendata.aragon.es/def/iaest/dimension#mes-y-ano") == -1) {
            icolumnas++
            query += "OPTIONAL { ?obs <" + element.colUri.value + "> ?foo" + icolumnas + ".\n";
            query += " ?foo" + icolumnas + " skos:prefLabel " + "?" + nombreColumnaAux + " } .\n";

          } /* else if (element.colUri.value.indexOf("http://opendata.aragon.es/def/iaest/dimension/mes_y_ano") == -1){
            query += "OPTIONAL {  ?obs <" + element.colUri.value + "> ?" + nombreColumnaAux + " } .\n";
          } */
          else {
            query += "OPTIONAL {  ?obs <" + element.colUri.value + "> ?" + nombreColumnaAux + " } .\n";
          }
        });

        query += "} \n";
        query += "ORDER BY ASC(?refArea) ASC(?refPeriod)\n";
        //query += "LIMIT 200\n"

        console.log(query);
        console.log('https://opendata.aragon.es/sparql?default-graph-uri=&query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on');

        this.sparql(query);

        this.queryTabla = 'https://opendata.aragon.es/sparql?default-graph-uri=&query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';


        this.aragopediaSvc.change(this.queryTabla);
      })
    }, 500);

    /*     let query: string = 'select distinct ?refArea ?nameRefArea ?refPeriod (strafter(str(?refPeriod), "http://reference.data.gov.uk/id/year/") AS ?nameRefPeriod) '
    
        let index = tema.Ruta.indexOf('/')
    
        let rutaLimpia = '/' + tema.Ruta.substring(index + 1).replaceAll('/', '-')
        let queryColumna: string = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FcolUri+%3FtipoCol+str%28%3FnombreCol%29%0D%0A+where+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset${rutaLimpia}%3E+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23structure%3E+%3Fdsd.%0D%0A++%3Fdsd+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23component%3E+%3Fcol.%0D%0A++%3Fcol+%3FtipoCol+%3FcolUri.%0D%0A++%3FcolUri+rdfs%3Alabel+%3FnombreCol.%0D%0A%7D%0D%0A%0D%0ALIMIT+500%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`
    
        this.resultSvc.getData(queryColumna).subscribe(data => {
          this.columnas = data.results.bindings;
    
          this.columnas.forEach((element: any) => {
            let nombreColumnaAux = element['callret-2'].value.replaceAll(' ', '_').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[{(/,.)}]/g, '');
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
    
            if (this.tipoLocalidad === 'diputacion') {
              tipoZona = "Provincia"
              nombreZona = this.lugarBuscadoParsed
            } else if (this.tipoLocalidad === 'comarca') {
              tipoZona = "Comarca"
              nombreZona = this.lugarBuscadoParsed
            } else if (this.tipoLocalidad === 'municipio') {
              tipoZona = "Municipio"
              nombreZona = this.lugarBuscadoParsed
            }
    
            let uriPrefix = "<http://opendata.aragon.es/recurso/territorio/" + tipoZona + "/";
            query += "FILTER (?refArea IN (";
            query += uriPrefix + this.deleteSpace(nombreZona) + ">";
            query += ")).\n";
          }
    
          this.columnas.forEach((element: any) => {
            let nombreColumnaAux = element['callret-2'].value.replaceAll(' ', '_').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[{(/,.)}]/g, '');
            query += "OPTIONAL {  ?obs <" + element.colUri.value + "> ?" + nombreColumnaAux + " } .\n";
            element
          });
    
          query += "} \n";
          query += "ORDER BY ASC(?refArea) ASC(?refPeriod)\n";
          query += "LIMIT 200\n"
    
          this.sparql(query);
    
          this.queryTabla = 'https://opendata.aragon.es/sparql?default-graph-uri=&query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';
    
          this.aragopediaSvc.change(this.queryTabla); 
        })*/

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

    this.http.get(('https://opendata.aragon.es/sparql?default-graph-uri=&query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on'), httpOptions).subscribe((data: any) => {

      this.displayTema = this.selectedTema;
      this.selectedTema = ''

      if (data.results.bindings.length === 0) {
        this.errorTabla = true;
      } else {

        this.errorTabla = false;
      }
    })
  }

}
