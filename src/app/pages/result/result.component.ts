import { Component, ViewChild } from '@angular/core';
import { ResultService } from './result.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { AragopediaSelectorTemasComponent } from 'src/app/components/aragopedia-selector-temas/aragopedia-selector-temas.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AragopediaService } from 'src/app/components/aragopedia-tabla-datos/aragopediaService';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

interface DataLinks {
  sueloUrbano: string,
  sueloRural: string,
  edificiosDestinadosLocales: string,
  habitantes: string,
  densidad: string,
  poligonos: string,
  explotacionesGanaderas: string,
  incendios: string,
  hectareasAfectadas: string,
  publicaciones: string,
  alojamientosHoteleros: string,
  alojamientosRurales: string,
  municipios: string,
  porcentajeSueloRural: string,
  porcentajeSueloUrbano: string,
  esPoblado: string,
  edadMedia: string,
  tieneOficinaComarcal: string,
  tablaPoblacion: string,
  miembrosPleno: string,
  datosContacto: string,
  entidadesSingulares: string,
  personasIlustres: string,
  image: string,
  presupuestos: string,

  mascotas: string
}

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})

export class ResultComponent {

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

  public lineChartLegend = true;

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

  constructor(public resultSvc: ResultService, private fb: FormBuilder, private _route: ActivatedRoute, private http: HttpClient, public aragopediaSvc: AragopediaService) { }

  temp = undefined;
  currentLink: any;

  tituloFicha!: string;
  lugarBuscado: any;
  lugarBuscadoParsed!: string;
  idLocalidad: any;
  tipoLocalidad!: string;
  tipoLocalidadGlobal!: string;
  idForComarca!: string;
  comunidadActual: any;
  poblacion: any;
  yearPoblacion: any;
  tablaPoblacion: any;
  yearsTablaPoblacion: number[] = [];
  density: any;
  sueloUrbano: any;
  sueloRural: any;
  poligonos: any;
  email: any;
  telefono: any;
  direccion: any;
  localidad: any;
  codPostal: any;
  creativeWork: any;
  numberOfCreativeWork: any;
  miembrosPleno: any;
  cantidadMiembrosPleno!: number;
  nameForUrl!: string;
  alojamientosTuristicos: any;
  oficinasTurismo: any;
  comunidad: string[] = [];
  provincia: string[] = [];
  municipio: string[] = [];
  porcentajeSueloUrbano: any;
  porcentajeSueloRural: any;
  yearRatioSuelo: any;
  densidadPoblacion: any
  imageWikiDataUrl!: string;
  map!: string;
  urlMap!: string;
  incendiosUltimosAnos!: string;
  hectareasQuemadas!: string;
  esPoblado!: string;
  edadMediaHombres!: string;
  edadMediaMujeres!: string;
  yearEdadMedia!: string;
  explotacionesGanaderas!: string;
  plazasHoteleras!: string;
  codigoIne: any;
  leerMas: boolean = false;
  personasIlustres: any;
  entidadesSingulares: any;
  numeroEntidadesSingulares!: number;
  entidadesSingularesId: any;
  cantidadPersonasIlustres!: number;
  sufijoCuboDatos!: string;
  sufijoCuboDatosGlobal!: string;
  locales!: string;
  tieneOficinaComarcal!: number;
  municipiosEnTerritorio: any;
  datosDePoblacion: any;
  dataYearExtension: any;
  presupuestos!: string;
  loading: boolean = false;

  mascotas!: string;

  @ViewChild(AragopediaSelectorTemasComponent) aragopediaMunicipio: any;


  //Queries variables
  queryIdWikiData!: string;
  queryImageWikiData!: string;
  queryUrlDensidadPoblacion!: string;
  queryUrlExtension!: string;
  queryUrlPoblacion!: string;
  queryUrlPoligonos!: string;
  queryUrlContacto!: string;
  queryUrlCreativeWork!: string;
  queryUrlTotalCreativeWork!: string;
  queryUrlMiembrosPleno!: string;
  queryUrlAlojamientosTuristicos!: string;
  queryUrlRatioSuelo!: string;
  queryUrlIncendios!: string;
  queryUrlEsPoblado!: string;
  queryUrlEdadMedia!: string;
  queryUrlExplotacionesGanaderas!: string;
  queryUrlPlazasHoteleras!: string;
  queryUrlGetCodigoIne!: string;
  queryUrlPersonasIlustres!: string;
  queryUrlEntidadesSingulares!: string;
  queryNombresIne!: string;
  queryUrlLocales!: string;
  queryUrlOficinaComarcal!: string;
  queryUrlMunicipiosEnTerritorio!: string;
  queryUrlPresupuestos!: string;

  queryUrlMascotas!: string;

  dataSource: DataLinks = {
    sueloUrbano: '',
    sueloRural: '',
    edificiosDestinadosLocales: '',
    habitantes: '',
    densidad: '',
    poligonos: '',
    explotacionesGanaderas: '',
    incendios: '',
    hectareasAfectadas: '',
    publicaciones: '',
    alojamientosHoteleros: '',
    alojamientosRurales: '',
    municipios: '',
    porcentajeSueloRural: '',
    porcentajeSueloUrbano: '',
    esPoblado: '',
    edadMedia: '',
    tieneOficinaComarcal: '',
    tablaPoblacion: '',
    miembrosPleno: '',
    datosContacto: '',
    entidadesSingulares: '',
    personasIlustres: '',
    image: '',
    presupuestos: '',

    mascotas: ''
  };

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

  dataDownload = this.temp || [{ nombre: '', email: '', telefono: '', direccion: '', codigoPostal: '', habitantes: '', sueloRural: '', sueloUrbano: '', densidad: '', poligonosIndustriales: '', explotacionesGanaderas: '', plazasHoteleras: '', incendiosDesde2022: '', hectareasAfectadasPorIncendios: '', mencionesEnPublicaciones: '', alojamientosTuristicos: '', urlImagen: '', porcentajeSueloRural: '', porcentajeSueloUrbano: '', esDeLosMasPoblados: '', edadMediaHombres: '', edadMediaMujeres: '', creativeWorks: '', miembrosPleno: '', personasIlustres: '', entidadesSingulares: '', mascotas: '' }];



  ngOnInit() {

    this.queryIdWikiData = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+%3Fs+str%28%3Fnombre%29+%3Fid+%3Fclasif%0D%0Awhere++%7B%0D%0A++++++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23classification%3E+%3Fclasif.+%0D%0A++++++%3Fs+dc%3Aidentifier+%3Fid.+%0D%0A+++++%3Fs+dc%3Atitle+%3Fnombre.%0D%0A+++++VALUES+%3Fclasif+%7B%3Chttps%3A%2F%2Fwww.geonames.org%2Fontology%23A.ADM2%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fkos%2Fcomarca%3E+%3Chttps%3A%2F%2Fwww.geonames.org%2Fontology%23P.PPL%3E%7D%0D%0A%7D%0D%0Aorder+by+asc%28%3Fclasif%29+%3Fid+%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
    this._route.queryParams.subscribe(params => {  //DE AQUI LEES LOS PARAMETROS DE LA URL PARAMETROS URL
      this.codigoIne = params['id'];
      this.tipoLocalidad = params['tipo'];
    });
    if (this.tipoLocalidad === 'municipio') {
      this.sufijoCuboDatos = 'TM';
    } else if (this.tipoLocalidad === 'comarca') {
      this.sufijoCuboDatos = 'TC'
    } else {
      this.sufijoCuboDatos = 'TP';
    }

    //Sacamos el nombre del municipio a través del codigo INE
    if (this.tipoLocalidad === 'diputacion') {
      this.queryNombresIne = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select++concat%28%22Provincia+de+%22%2C+%3Fnombre%29+as+%3Fnombre+where+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fdiputacion%2F${this.codigoIne}%3E+owl%3AsameAs+%3Faragopedia.%0D%0A++%3Faragopedia+rdfs%3Alabel+%3Fnombre.%0D%0A++FILTER%28%21+regex%28%3Fnombre%2C+%22%29%24%22%29%29.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`
    } else {
      this.queryNombresIne = `https://opendata.aragon.es/sparql?default-graph-uri=&query=prefix+dbpedia%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2F%3E+%0D%0Aprefix+org%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23%3E%0D%0Aprefix+aragopedia%3A+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23%3E%0D%0A%0D%0Aselect+%3Fnombre+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E++where+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2F${this.tipoLocalidad}%2F${this.codigoIne}%3E+dc%3Atitle+%3Fnombre%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
    }

    //Obtenemos id y tipo de localidad antes de nada

    this.resultSvc.getData(this.queryIdWikiData).subscribe((data: any) => {
      if (this.codigoIne !== undefined) {

        //Queries con ID
        if (this.tipoLocalidad === 'municipio') {
          this.map = `https://idearagon.aragon.es/Visor2D?service=WMS&version=1.1.0&request=GetMap&layers=VISOR2D%3ALimAragon,VISOR2D%3AMunicipio_t2m&bbox=554192.3553%2C4406927.4576%2C825631.1337%2C4760878.6523&width=300&height=425&srs=EPSG%3A25830&format=image/png&CQL_FILTER=1=1;c_muni_ine=${this.codigoIne}`;

          this.urlMap = `https://idearagon.aragon.es/visor/index.html?ACTIVELAYER=BusMun&QUERY=C_MUNI_INE=${this.codigoIne}`

        } else if (this.tipoLocalidad === 'comarca') {
          this.map = `https://idearagon.aragon.es/Visor2D?service=WMS&version=1.1.0&request=GetMap&layers=VISOR2D%3ALimAragon,VISOR2D%3AMunicipio_t2m&bbox=554192.3553%2C4406927.4576%2C825631.1337%2C4760878.6523&width=300&height=425&srs=EPSG%3A25830&format=image/png&CQL_FILTER=1=1;c_comarca=${this.codigoIne}`;

          this.urlMap = `https://idearagon.aragon.es/visor/index.html?ACTIVELAYER=Comarca_t2m&QUERY=C_COMARCA=${this.codigoIne}`;
        } else if (this.tipoLocalidad === 'diputacion') {
          if (this.codigoIne === '7824') {
            this.map = `https://idearagon.aragon.es/geoserver/VISOR2D/wms?service=WMS&version=1.1.0&request=GetMap&layers=VISOR2D%3ALimAragon,VISOR2D%3AProvincia&bbox=554192.3553%2C4406927.4576%2C825631.1337%2C4760878.6523&width=300&height=425&srs=EPSG%3A25830&format=image/png&CQL_FILTER=1=1;c_prov=22&STYLES=,Comarca_t2m_VISOR2D`;
            this.urlMap = `https://idearagon.aragon.es/visor/index.html?ACTIVELAYER=Provincia&QUERY=C_PROV=22`;
          } else if (this.codigoIne === '7823') {
            this.map = `https://idearagon.aragon.es/geoserver/VISOR2D/wms?service=WMS&version=1.1.0&request=GetMap&layers=VISOR2D%3ALimAragon,VISOR2D%3AProvincia&bbox=554192.3553%2C4406927.4576%2C825631.1337%2C4760878.6523&width=300&height=425&srs=EPSG%3A25830&format=image/png&CQL_FILTER=1=1;c_prov=50&STYLES=,Comarca_t2m_VISOR2D`;
            this.urlMap = `https://idearagon.aragon.es/visor/index.html?ACTIVELAYER=Provincia&QUERY=C_PROV=50`;
          } else {
            this.map = `https://idearagon.aragon.es/geoserver/VISOR2D/wms?service=WMS&version=1.1.0&request=GetMap&layers=VISOR2D%3ALimAragon,VISOR2D%3AProvincia&bbox=554192.3553%2C4406927.4576%2C825631.1337%2C4760878.6523&width=300&height=425&srs=EPSG%3A25830&format=image/png&CQL_FILTER=1=1;c_prov=44&STYLES=,Comarca_t2m_VISOR2D`;
            this.urlMap = `https://idearagon.aragon.es/visor/index.html?ACTIVELAYER=Provincia&QUERY=C_PROV=44`
          }
        }


        this.queryUrlPoligonos = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+count%28distinct+%3Fs%29+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A%3Fs+%3Fp+%3Fo%3B%0D%0A++++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23linkedTo%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2F${this.tipoLocalidad}%2F${this.codigoIne}%3E%3B%0D%0A++++dc%3Asource+%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2F0d8fab77-91db-4832-8184-ea83a0bc4ca5%2Fresource%2F66c34c59-7d01-4e1c-983c-7edc48602cda%3E.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

        this.dataSource.poligonos = this.exportHtmlQuery(this.queryUrlPoligonos);

        if (this.tipoLocalidad === 'municipio' || this.tipoLocalidad === 'comarca') {
          this.queryUrlContacto = `https://opendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0D%0APREFIX+ns%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fprov%23%3E%0D%0APREFIX+vcard%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23%3E%0D%0A%0D%0ASELECT+%3Femail+%3Ftel+%3Ffax+%3Fdireccion+%3FcodPostal+%3Flocality%0D%0AFROM+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E%0D%0AWHERE+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2F${this.tipoLocalidad}%2F${this.codigoIne}%3E+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23hasSite%3E+%3FsiteAddress.%0D%0A%0D%0A++%3FsiteAddress+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23siteAddress%3E+%3Faddress2.%0D%0A%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Alocality+%3Flocality+%7D.%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Aemail+%3Femail+%7D.%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Atel+%3Ftel+%7D.%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Afax+%3Ffax+%7D.%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Astreet-address%3Fdireccion+%7D.%0D%0A+++OPTIONAL+%7B%3Faddress2+vcard%3Apostal-code+%3FcodPostal+%7D.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
          this.dataSource.datosContacto = this.exportHtmlQuery(this.queryUrlContacto);
        } else {
          this.queryUrlContacto = `https://opendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0D%0APREFIX+ns%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fprov%23%3E%0D%0APREFIX+vcard%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23%3E%0D%0A%0D%0ASELECT+%3Femail+%3Ftel+%3Ffax+%3Fdireccion+%3FcodPostal+%0D%0AFROM+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E%0D%0AWHERE+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fdiputacion%2F${this.codigoIne}%3E+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23hasSite%3E+%3FsiteAddress.%0D%0A++%3FsiteAddress+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23siteAddress%3E+%3Faddress2.%0D%0A%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Aemail+%3Femail+%7D.%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Atel+%3Ftel+%7D.%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Afax+%3Ffax+%7D.%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Astreet-address%3Fdireccion+%7D.%0D%0A+++OPTIONAL+%7B%3Faddress2+vcard%3Apostal-code+%3FcodPostal+%7D.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
          this.dataSource.datosContacto = this.exportHtmlQuery(this.queryUrlContacto);
        }

        this.queryUrlMiembrosPleno = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select++distinct+%3Fpersona+%3Fcargo+%3FnombrePersona+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A%3Fpuesto+%3Fp+%3Fo%3B%0D%0A+++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23role%3E+%3Frol%3B%0D%0A+++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23postIn%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2F${this.tipoLocalidad}%2F${this.codigoIne}%3E.%0D%0A%3Frol+dc%3Atitle+%3Fcargo.%0D%0A%3Fpersona+++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23holds%3E+%3Fpuesto.%0D%0AOPTIONAL+%7B+%3Fpersona+%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2Fname%3E+%3FnombrePersona.+%7D%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
        this.dataSource.miembrosPleno = this.exportHtmlQuery(this.queryUrlMiembrosPleno);

        this.queryUrlAlojamientosTuristicos = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+count%28+distinct+%3Fs%29+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A%3Fs+%3Fp+%3Fo%3B%0D%0A++++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23linkedTo%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2F${this.tipoLocalidad}%2F${this.codigoIne}%3E%3B%0D%0A++++dc%3Asource+%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2Fb58bc283-573f-4fa5-9c0c-ff9136eab2c1%2Fresource%2F993c5ebf-5ced-478a-8791-159b2e87e789%3E.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
        this.dataSource.alojamientosRurales = this.exportHtmlQuery(this.queryUrlAlojamientosTuristicos);

        if (this.tipoLocalidad === 'comarca') {
          this.queryUrlExplotacionesGanaderas = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+count%28distinct%28%3Fs%29%29++from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A%3Fs+%3Fx+%3Fmuni.%0D%0A%3Fmuni+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23subOrganizationOf%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fcomarca%2F${this.codigoIne}%3E+.+++%0D%0AFILTER+%28%28REGEX%28STR%28%3Fx%29%2C+%22%5Ehttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fdimensionproperty%2Fexplotaciones-ganaderas*%22%29%29%29.%0D%0A%7D%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`
        } else {
          this.queryUrlExplotacionesGanaderas = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+count%28distinct%28%3Fs%29%29++from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A%3Fs+%3Fx+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2F${this.tipoLocalidad}%2F${this.codigoIne}%3E+.+++%0D%0AFILTER+%28%28REGEX%28STR%28%3Fx%29%2C+%22%5Ehttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fdimensionproperty%2Fexplotaciones-ganaderas*%22%29%29%29.%0D%0A%7D%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
        }

        this.dataSource.explotacionesGanaderas = this.exportHtmlQuery(this.queryUrlExplotacionesGanaderas);

        if (this.tipoLocalidad === 'municipio') {
          // total
          this.queryUrlMascotas = `https://preopendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+ei2a%3A+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%23%3E%0D%0APREFIX+vcard%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23%3E%0D%0A%0D%0ASELECT+%28COUNT%28%3Fpet%29+AS+%3FtotalMascotas%29%0D%0AWHERE+%7B%0D%0A++%3Fpet+a+ei2a%3APet+%3B%0D%0A+++++++vcard%3Alocality+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fmunicipio%2F${this.codigoIne}%3E+.%0D%0A%7D%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on&interface=true`
          
          // todas las mascotas
          // this.queryUrlMascotas = `https://preopendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+ei2a%3A+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%23%3E%0D%0APREFIX+vcard%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23%3E%0D%0A%0D%0ASELECT+%3Fpet%0D%0AWHERE+%7B%0D%0A++%3Fpet+a+ei2a%3APet+%3B%0D%0A+++++++vcard%3Alocality+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fmunicipio%2F${this.codigoIne}%3E+.%0D%0A%7D%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on&interface=true`
        } else if (this.tipoLocalidad === 'diputacion') {
          // total
          this.queryUrlMascotas = `https://preopendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+ei2a%3A+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%23%3E%0D%0APREFIX+vcard%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23%3E%0D%0A%0D%0ASELECT+%28COUNT%28%3Fpet%29+AS+%3FtotalMascotas%29%0D%0AWHERE+%7B%0D%0A++%3Fpet+a+ei2a%3APet+%3B%0D%0A+++++++vcard%3Aregion+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fdiputacion%2F${this.codigoIne}%3E+.%0D%0A%7D%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on&interface=true`;

          //todas las mascotas
          //this.queryUrlMascotas = `https://preopendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+ei2a%3A+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%23%3E%0D%0APREFIX+vcard%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23%3E%0D%0A%0D%0ASELECT+%3Fpet%0D%0AWHERE+%7B%0D%0A++%3Fpet+a+ei2a%3APet+%3B%0D%0A+++++++vcard%3Aregion+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fdiputacion%2F${this.codigoIne}%3E+.%0D%0A%7D%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on&interface=true`;
        }
        this.dataSource.mascotas = this.exportHtmlQuery(this.queryUrlMascotas);



        this.queryUrlPlazasHoteleras = `https://opendata.aragon.es/sparql?default-graph-uri=http%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2&query=select+count%28+distinct+%3Fs%29+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A%3Fs+a+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23Organization%3E%3B%0D%0A++++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23linkedTo%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2F${this.tipoLocalidad}%2F${this.codigoIne}%3E%3B%0D%0A++++dc%3Asource+%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2F87b07cd4-c1b0-41c4-b071-c18db7c0cf58%2Fresource%2F8303127d-90c6-4e94-9617-e6e602a0140a%3E.%0D%0A%7D%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
        this.dataSource.alojamientosHoteleros = this.exportHtmlQuery(this.queryUrlPlazasHoteleras);

        if (this.tipoLocalidad === 'diputacion') {
          this.queryUrlGetCodigoIne = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+%3Fwikidata+%3Faragopedia+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2F${this.tipoLocalidad}%2F${this.codigoIne}%3E+skos%3AexactMatch+%3Fwikidata%3B%0D%0A+++owl%3AsameAs+%3Faragopedia.%0D%0A++FILTER%28regex%28%3Fwikidata%2C+%22http%3A%2F%2Fwww.wikidata.org%2F%22%29%29.%0D%0A++FILTER%28regex%28%3Faragopedia%2C+%22http%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FProvincia%2F%22%29%29.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
        } else {
          this.queryUrlGetCodigoIne = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+%3Fwikidata+%3Faragopedia+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2F${this.tipoLocalidad}%2F${this.codigoIne}%3E+skos%3AexactMatch+%3Fwikidata%3B%0D%0A+++owl%3AsameAs+%3Faragopedia.%0D%0A++FILTER%28regex%28%3Fwikidata%2C+%22http%3A%2F%2Fwww.wikidata.org%2F%22%29%29.%0D%0A++FILTER%28regex%28%3Faragopedia%2C+%22http%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2F${this.capitalizeString(this.tipoLocalidad)}%2F%22%29%29.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

        }

        this.queryUrlEntidadesSingulares = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select++distinct+%3Fs+%3FnombreEntidad+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A%3Fs+dc%3Atitle+%3FnombreEntidad%3B%0D%0A++++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23linkedTo%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2F${this.tipoLocalidad}%2F${this.codigoIne}%3E%3B%0D%0A+++++dc%3Asource+%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2F331c4c50-e0df-4741-9975-5d5552d8875b%2Fresource%2F4b4e2b16-0327-4196-8636-9de97b9d5961%3E.%0D%0A%7D%0D%0Aorder+by+%3Fs%0D%0Alimit+100&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
        this.dataSource.entidadesSingulares = this.exportHtmlQuery(this.queryUrlEntidadesSingulares);

        this.queryUrlOficinaComarcal = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select++count%28distinct+%3Fs%29+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A%3Fs+%3Fp+%3Fo%3B%0D%0A++++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23linkedTo%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2F${this.tipoLocalidad}%2F${this.codigoIne}%3E%3B%0D%0A++++dc%3Asource+%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2Fb0faccd6-aa4f-4ab3-b81e-6c9408448127%2Fresource%2F118a6803-7bb1-4191-885d-c2329a9c0a9b%3E.%0D%0A%0D%0A%7D%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
        this.dataSource.tieneOficinaComarcal = this.exportHtmlQuery(this.queryUrlOficinaComarcal);

        this.queryUrlMunicipiosEnTerritorio = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+count%28distinct+%3Fs%29+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23subOrganizationOf%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2F${this.tipoLocalidad}%2F${this.codigoIne}%3E.+%7D%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
        this.dataSource.municipios = this.exportHtmlQuery(this.queryUrlMunicipiosEnTerritorio);

        this.queryUrlPresupuestos = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+%3Furl+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2F${this.tipoLocalidad}%2F${this.codigoIne}%3E+dc%3Arelation+%3Furl.+%0D%0A++filter%28regex%28%3Furl%2C+%22https%3A%2F%2Fpresupuesto.aragon.es%2F%22%29%29.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`
        this.dataSource.presupuestos = this.exportHtmlQuery(this.queryUrlPresupuestos)

        //Obtención de datos por ID

        this.resultSvc.getData(this.queryUrlPoligonos).subscribe((data: any) => {

          this.poligonos = data?.results.bindings[0]['callret-0'].value;
          this.dataDownload[0].poligonosIndustriales = this.poligonos;
        });

        this.resultSvc.getData(this.queryUrlContacto).subscribe((data: any) => {
          const locality = data.results.bindings[0].locality?.value;

          this.email = data.results.bindings[0].email?.value;
          this.telefono = data.results.bindings[0].tel?.value;
          this.localidad = locality;
          this.direccion = data.results.bindings[0].direccion?.value;
          this.codPostal = data.results.bindings[0].codPostal?.value;

          this.dataDownload[0].email = this.email;
          this.dataDownload[0].telefono = this.telefono;
          this.dataDownload[0].direccion = this.direccion;
          this.dataDownload[0].codigoPostal = this.codPostal;
        });

        this.resultSvc.getData(this.queryUrlMiembrosPleno).subscribe((data: any) => {

          this.miembrosPleno = data?.results.bindings;
          this.cantidadMiembrosPleno = this.miembrosPleno.length;

          this.miembrosPleno.forEach((element: any) => {
            let miembro = `Nombre: ${element.nombrePersona.value}; Cargo: ${element.cargo.value}; URL: ${element.persona.value}`
            this.dataDownload[0].miembrosPleno += miembro;
          });
        });

        this.resultSvc.getData(this.queryUrlAlojamientosTuristicos).subscribe((data: any) => {

          this.alojamientosTuristicos = data?.results.bindings[0]['callret-0'].value;
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
            this.dataDownload[0].explotacionesGanaderas = this.explotacionesGanaderas;
          }

        });

        // TODAS LAS MASCOTAS DE FORMA INDIVIDUAL
        // this.resultSvc.getData(this.queryUrlMascotas).subscribe((data) => {
        //   if (data.results.bindings && data.results.bindings.length > 0) {
        //     const mascotas = data.results.bindings;
        //     console.log("mascotas obtenidas");
            
        //     // Contamos cuántos elementos (mascotas) hay
        //     const total = mascotas.length;
            
        //     // Guardamos ese total como string
        //     this.mascotas = total.toString();
        //     this.dataDownload[0].mascotas = this.mascotas;
        //   }
        // });

        // NÚMERO TOTAL DE MASCOTAS
        this.resultSvc.getData(this.queryUrlMascotas).subscribe((data) => {
          if (data.results.bindings.length !== 0) {
            const bindings = data.results.bindings;
            this.mascotas = bindings[0].totalMascotas.value;
            this.dataDownload[0].mascotas = this.mascotas;
          } else {
            this.mascotas = "0";
            this.dataDownload[0].mascotas = this.mascotas;
          }
        });

        this.resultSvc.getData(this.queryUrlPlazasHoteleras).subscribe((data) => {

          this.plazasHoteleras = data?.results.bindings[0]['callret-0'].value;
          this.dataDownload[0].plazasHoteleras = this.plazasHoteleras;
        });

        this.resultSvc.getData(this.queryUrlEntidadesSingulares).subscribe((data) => {
          this.entidadesSingulares = data?.results.bindings;
          this.numeroEntidadesSingulares = this.entidadesSingulares.length;
          this.entidadesSingulares.forEach((element: any) => {
            let entidad = `Entidad: ${element.nombreEntidad.value}; URI: ${element.s.value}`
            this.dataDownload[0].entidadesSingulares += entidad;
          });
        })

        this.resultSvc.getData(this.queryUrlGetCodigoIne).subscribe((data) => {
          const urlAnalizada = data?.results.bindings[0].wikidata.value;
          this.idLocalidad = urlAnalizada.split('/')[4];

          this.queryImageWikiData = `https://query.wikidata.org/sparql?query=%0Aselect%20%3Fimg%20where%20%7B%20wd%3A${this.idLocalidad}%20wdt%3AP18%20%3Fimg%20%7D`;
          this.dataSource.image = this.exportHtmlQuery(this.queryImageWikiData);

          this.queryUrlPersonasIlustres = `https://query.wikidata.org/sparql?query=SELECT%20%3Fitem%20%3FitemLabel%20%3Fabout%20(count(%3Fx)%20as%20%3Fcont)%0AWHERE%20%0A%7B%0A%20%20%3Fitem%20wdt%3AP19%20wd%3A${this.idLocalidad}.%0A%20%20%3Fitem%20%3Fx%20%20%3Fo.%0A%20%20%3Fabout%20schema%3Aabout%20%3Fitem.%0A%20%20%3Fabout%20schema%3AinLanguage%20%22es%22.%0A%20%20%3Fabout%20schema%3AisPartOf%20%3Chttps%3A%2F%2Fes.wikipedia.org%2F%3E.%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22es%2Cen%22.%20%7D%0A%7D%0Agroup%20by%20%3Fitem%20%3FitemLabel%20%3Fabout%0Aorder%20by%20desc(%3Fcont)%20limit%2020`;
          this.dataSource.personasIlustres = this.exportHtmlQuery(this.queryUrlPersonasIlustres);

          this.resultSvc.getData(this.queryImageWikiData).subscribe((data: any) => {
            this.imageWikiDataUrl = data.results.bindings[0].img.value;
            this.dataDownload[0].urlImagen = this.imageWikiDataUrl;
          });

          this.resultSvc.getData(this.queryUrlPersonasIlustres).subscribe((data) => {
            this.personasIlustres = data.results.bindings;
            this.cantidadPersonasIlustres = this.personasIlustres.length;
            this.personasIlustres.forEach((element: any) => {
              let persona = `Nombre: ${element.itemLabel.value}; URL Wikipedia: ${element.about.value}`;
              this.dataDownload[0].personasIlustres += persona;
            });
          })

        });
        this.resultSvc.getData(this.queryUrlOficinaComarcal).subscribe(data => {
          this.tieneOficinaComarcal = Number(data.results.bindings[0]['callret-0'].value);
        })
      }

      this.resultSvc.getData(this.queryUrlMunicipiosEnTerritorio).subscribe(data => {
        this.municipiosEnTerritorio = data.results.bindings[0]['callret-0'].value;
      });

      this.resultSvc.getData(this.queryUrlPresupuestos).subscribe(data => {
        this.presupuestos = data.results.bindings[0].url?.value;
      })
    });


    //Queries URLs NOMBRE MUNICIPIO

    this.resultSvc.getData(this.queryNombresIne).subscribe(data => {

      const lastPosition = data.results.bindings.length - 1
      let nombreMunicipio = this.replaceWord(data?.results.bindings[lastPosition].nombre.value);
      this.tituloFicha = this.capitalizeString(nombreMunicipio).replace('Zaragóza', 'Zaragoza').replace('Diputacion', 'Diputación').replace('Bajo Aragón-caspe-baix Aragó-casp', 'Bajo Aragón-Caspe / Baix Aragó-Casp').replace('Aisa', 'Aínsa-Sobrarbe').replace('ÉPila', 'Épila').replace('Sabiñán', 'Saviñán');

      if (this.tipoLocalidad === 'diputacion') {
        nombreMunicipio = data?.results.bindings[lastPosition].nombre.value.replace('ZARAGÓZA', 'ZARAGOZA');

        this.lugarBuscado = nombreMunicipio.replace('Provincia de ', '');
        this.lugarBuscadoParsed = this.lugarBuscado;
      } else if (this.tipoLocalidad === 'comarca') {
        this.lugarBuscado = this.capitalizeString(nombreMunicipio.toLowerCase());
        this.dataDownload[0].nombre = this.lugarBuscado;
        this.lugarBuscadoParsed = this.fixNames(this.replaceCaspe(this.capitalAfterHyphen(this.capitalAfterSlash(this.deleteSpace(this.lugarBuscado)))));
      }
      else {
        this.lugarBuscado = this.capitalizeString(nombreMunicipio.toLowerCase());
        if (this.lugarBuscado === 'Sabiñán') {
          this.lugarBuscado = 'Saviñán'
        }

        this.dataDownload[0].nombre = this.lugarBuscado;
        this.lugarBuscadoParsed = this.replaceCaspe(this.capitalAfterHyphen(this.capitalAfterSlash(this.deleteSpace(this.lugarBuscado)))).replace('de_La', 'de_la').replace('de_Las', 'de_las');

        if (this.lugarBuscadoParsed === 'Litera-La_LLitera,_La') {
          this.lugarBuscadoParsed = 'La_Litera/La_Llitera';
        } else if (this.lugarBuscadoParsed === 'AzAnuy-Alins') {
          this.lugarBuscadoParsed = 'Azanuy-Alins'
        } else if (this.lugarBuscadoParsed === 'Jacetania,_La') {
          this.lugarBuscadoParsed = 'La_Jacetania'
        } else if (this.lugarBuscadoParsed === 'Ribagorza,_La') {
          this.lugarBuscadoParsed = 'La_Ribagorza'
        } else if (this.lugarBuscadoParsed === 'Monegros,_Los') {
          this.lugarBuscadoParsed = 'Los_Monegros'
        } else if (this.lugarBuscadoParsed === 'ÉPila') {
          this.lugarBuscadoParsed = 'Épila'
        } else if (this.lugarBuscadoParsed === 'Zaragóza') {
          this.lugarBuscadoParsed = 'Zaragoza';
        } else if (this.lugarBuscadoParsed === 'Villarroya_de_La_Sierra') {
          this.lugarBuscadoParsed = 'Villarroya_de_la_Sierra';
        } else if (this.lugarBuscadoParsed === 'Villanueva_del_Rebollar_de_La_Sierra') {
          this.lugarBuscadoParsed = 'Villanueva_del_Rebollar_de_la_Sierra';
        } else if (this.lugarBuscadoParsed === 'Torla-Ordesa') {
          this.lugarBuscado = 'Torla'
          this.lugarBuscadoParsed = 'Torla';
        } else if (this.lugarBuscadoParsed === 'Torre_La_Ribera') {
          this.lugarBuscadoParsed = 'Torre_la_Ribera'
        } else if (this.lugarBuscadoParsed === 'Beranuy') {
          this.lugarBuscado = 'Veracruz';
          this.lugarBuscadoParsed = 'Veracruz';
        } else if (this.lugarBuscadoParsed === 'Aisa') {
          this.lugarBuscado = 'Aínsa-Sobrarbe'
          this.lugarBuscadoParsed = 'Aínsa-Sobrarbe';
        } else if (this.lugarBuscadoParsed === 'Baélls') {
          this.lugarBuscado = 'Baells'
          this.lugarBuscadoParsed = 'Baells'
        } else if (this.lugarBuscadoParsed === 'Camporrélls') {
          this.lugarBuscado = 'Camporrells'
          this.lugarBuscadoParsed = 'Camporrells'
        } else if (this.lugarBuscadoParsed === 'Puente_La_Reina_de_Jaca') {
          this.lugarBuscadoParsed = 'Puente_la_Reina_de_Jaca'
        } else if (this.lugarBuscadoParsed === 'Hoz_y_Costean') {
          this.lugarBuscado = 'Hoz y Costeán';
          this.lugarBuscadoParsed = 'Hoz_y_Costeán';
        } else if (this.lugarBuscadoParsed === 'Jarque_de_Moncayo') {
          this.lugarBuscado = 'Jarque';
          this.lugarBuscadoParsed = 'Jarque';
        }
      }
      // Queries con nombres

      if (this.tipoLocalidad === 'municipio') {
        this.tipoLocalidadGlobal = 'municipio';
        this.sufijoCuboDatosGlobal = 'TM';
      } else if (this.tipoLocalidad === 'comarca') {
        this.tipoLocalidadGlobal = 'comarca';
        this.sufijoCuboDatosGlobal = this.sufijoCuboDatos;
      } else {
        this.tipoLocalidadGlobal = 'provincia';
        this.sufijoCuboDatosGlobal = 'TP';
      }

      this.queryUrlDensidadPoblacion = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FrefArea+%3FnameRefArea+str%28%3Fyear%29+AS+%3FnameRefPeriod+%3Fdensidad_de_poblacion_habkm2+where+%7B%0D%0A%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0AFILTER%28%3Fdataset+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F02-020001${this.sufijoCuboDatosGlobal}%3E%29%29.%0D%0A%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A%3FrefPeriod+time%3AinXSDgYear+%3Fyear.%0D%0A%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A%3FrefArea+rdfs%3Alabel+%3FnameRefArea.%0D%0AFILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0ABIND+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2F${this.capitalizeString(this.tipoLocalidadGlobal)}%2F${this.lugarBuscadoParsed}%3E+AS+%3Fmuni%29.%0D%0AFILTER+%28%3FrefArea+IN+%28%3Fmuni%29%29.%0D%0AOPTIONAL+%7B+%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23densidad-de-poblacion-habkm2%3E+%3Fdensidad_de_poblacion_habkm2+%7D+.%0D%0A%7D%0D%0Aorder+by+desc%28%3Fyear%29%0D%0ALIMIT+1%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
      this.dataSource.densidad = this.exportHtmlQuery(this.queryUrlDensidadPoblacion);

      this.queryUrlExtension = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct++str%28%3Fyear%29+AS+%3FnameRefPeriod++sum%28xsd%3Aint%28%3Frust%29%29+as+%3Frustico+sum%28xsd%3Aint%28%3Furba%29%29+as+%3Furbano+where+%7B+%0D%0A+++%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019${this.sufijoCuboDatosGlobal}%3E%3B%0D%0A++++++++%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2F${this.capitalizeString(this.tipoLocalidadGlobal)}%2F${this.lugarBuscadoParsed}%3E%3B%0D%0A++++++++%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.+%0D%0A%0D%0A++%3FrefPeriod+time%3AinXSDgYear+%3Fyear.+%0D%0A%0D%0A++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23rustico-superficie%3E+%3Frust.+%0D%0A++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23urbano-superficie%3E+%3Furba.+%0D%0A%7D+%0D%0AORDER+BY+desc%28%3Fyear%29%0D%0ALIMIT+1%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
      this.dataSource.sueloRural = this.exportHtmlQuery(this.queryUrlExtension);
      this.dataSource.sueloUrbano = this.exportHtmlQuery(this.queryUrlExtension);

      if (this.tipoLocalidad === 'municipio') {
        this.queryUrlPoblacion = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FrefArea+%3FnameRefArea+str%28%3Fyear%29+AS+%3FnameRefPeriod+xsd%3Aint%28%3Fpoblacion%29+as+%3Fpoblac+where+%7B%0D%0A%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0AFILTER%28%3Fdataset+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001A%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001TC%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001TM%3E%29%29.%0D%0A%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A%0D%0A++%7B+select+distinct+%3FrefPeriod+where+%7B%0D%0A+++++++++++++++++++++++++++++++++++++++++++++++++++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0AFILTER%28%3Fdataset+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001A%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001TC%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001TM%3E%29%29.%0D%0A++++++++++++++++++++++++++++++++++++++++++++++++++++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+++++++++++++++++++++++++++++++++++++++++++++%7D%0D%0A+++++++++++++++++++++++++++++++++++++++++++++ORDER+BY+desc%28%3FrefPeriod%29%0D%0A+++++++++++++++++++++++++++++++++++++++++++++LIMIT+5++%7D%0D%0A%0D%0A%3FrefPeriod+time%3AinXSDgYear+%3Fyear.%0D%0A%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A%3FrefArea+rdfs%3Alabel+%3FnameRefArea.%0D%0AFILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0ABIND+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2F${this.capitalizeString(this.tipoLocalidadGlobal)}%2F${this.lugarBuscadoParsed}%3E+AS+%3Fmuni%29.%0D%0A%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComarca%3E+%3Fcomarca.%0D%0A%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComunidadAutonoma%3E+%3Fccaa.%0D%0AFILTER+%28%3FrefArea+IN+%28%3Fmuni%2C+%3Fcomarca%2C+%3Fccaa%29%29.%0D%0AOPTIONAL+%7B+%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23poblacion%3E+%3Fpoblacion+%7D+.%0D%0A%7D%0D%0AORDER+BY++%3FrefArea%2C+desc%28%3Fyear%29%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
        this.dataSource.habitantes = this.exportHtmlQuery(this.queryUrlPoblacion);
        this.dataSource.tablaPoblacion = this.exportHtmlQuery(this.queryUrlPoblacion);
      } else if (this.tipoLocalidad === 'comarca') {
        this.queryUrlPoblacion = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FrefArea+%3FnameRefArea+%3FrefPeriod+%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F%22%29+AS+%3FnameRefPeriod%29+sum+%28%3Fpoblac+%29+as+%3Fpoblac++++where+%7B%0D%0A+%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001TC%3E.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0AFILTER+%28%3FrefPeriod+IN+%28%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2017%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2018%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2019%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2020%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2021%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2022%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.FILTER+%28%3FrefArea+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FComarca%2F${this.lugarBuscadoParsed}%3E%29%29.%0D%0AOPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23poblacion%3E+%3Fpoblac++%7D+.%0D%0A%7D+%0D%0Aorder+by+desc%28%3FrefPeriod%29%0D%0ALIMIT+300&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
        this.dataSource.habitantes = this.exportHtmlQuery(this.queryUrlPoblacion);
        this.dataSource.tablaPoblacion = this.exportHtmlQuery(this.queryUrlPoblacion);
      } else if (this.tipoLocalidad === 'diputacion') {
        this.queryUrlPoblacion = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FrefArea+%3FnameRefArea+%3FrefPeriod+%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F%22%29+AS+%3FnameRefPeriod%29+sum+%28%3Fpoblac+%29+as+%3Fpoblac++++where+%7B%0D%0A+%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001TP%3E.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0AFILTER+%28%3FrefPeriod+IN+%28%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2017%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2018%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2019%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2020%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2021%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2022%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.FILTER+%28%3FrefArea+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FProvincia%2F${this.lugarBuscadoParsed}%3E%29%29.%0D%0AOPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23poblacion%3E+%3Fpoblac++%7D+.%0D%0A%7D+%0D%0Aorder+by+desc%28%3FrefPeriod%29%0D%0ALIMIT+300&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
        this.dataSource.habitantes = this.exportHtmlQuery(this.queryUrlPoblacion);
        this.dataSource.tablaPoblacion = this.exportHtmlQuery(this.queryUrlPoblacion);
      }
      else {
        this.queryUrlPoblacion = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FrefArea+%3FnameRefArea+%3FrefPeriod+%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F%22%29+AS+%3FnameRefPeriod%29+sum+%28%3Fpoblac+%29+as+%3Fpoblac++++where+%7B%0D%0A+%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001TM%3E.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0AFILTER+%28%3FrefPeriod+IN+%28%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2017%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2018%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2019%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2020%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2021%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.FILTER+%28%3FrefArea+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FMunicipio%2F${this.lugarBuscadoParsed}%3E%29%29.%0D%0AOPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23poblacion%3E+%3Fpoblac++%7D+.%0D%0A%7D+%0D%0A%0D%0ALIMIT+300&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
        this.dataSource.habitantes = this.exportHtmlQuery(this.queryUrlPoblacion);
        this.dataSource.tablaPoblacion = this.exportHtmlQuery(this.queryUrlPoblacion);
      }

      this.queryUrlCreativeWork = `https://opendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+schema%3A+%3Chttp%3A%2F%2Fschema.org%2F%3E%0D%0A%0D%0Aselect+%3Ftitle+%3Furl+%3Ftema+%3Fresumen%0D%0Awhere+%7B%0D%0A++%3Fs+a+schema%3ACreativeWork%3B%0D%0A+++++++schema%3Aabout+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2F${this.capitalizeString(this.checkForMunicipioProvincia())}%2F${this.lugarBuscadoParsed}%3E%3B%0D%0A+++++++schema%3Atitle+%3Ftitle%3B%0D%0A+++++++schema%3Aurl+%3Furl%3B%0D%0A+++++++schema%3Aconcept+%3Ftema%3B%0D%0Aschema%3Aabstract+%3Fresumen.%0D%0A%7D%0D%0Alimit+10&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

      this.queryUrlTotalCreativeWork = `https://opendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+schema%3A+%3Chttp%3A%2F%2Fschema.org%2F%3E%0D%0A%0D%0Aselect+count+%28%3Fs%29%0D%0Awhere+%7B%0D%0A++%3Fs+a+schema%3ACreativeWork%3B%0D%0A+++++++schema%3Aabout+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2F${this.capitalizeString(this.checkForMunicipioProvincia())}%2F${this.lugarBuscadoParsed}%3E%3B%0D%0A+++++++schema%3Atitle+%3Ftitle%3B%0D%0A+++++++schema%3Aurl+%3Furl%3B%0D%0A+++++++schema%3Aconcept+%3Ftema%3B%0D%0Aschema%3Aabstract+%3Fresumen.%0D%0A%7D%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

      this.dataSource.publicaciones = this.exportHtmlQuery(this.queryUrlTotalCreativeWork);

      this.queryUrlRatioSuelo = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FrefArea+%3FnameRefArea+%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F%22%29+AS+%3FnameRefPeriod%29+xsd%3Aint%28%3Frust%29+as+%3Frustico+xsd%3Aint%28%3Furba%29+as+%3Furbano+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++FILTER%28%3Fdataset+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019A%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019TC%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019TM%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+FILTER+%28%3FrefPeriod+IN+%28%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2018%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2019%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2020%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2021%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+%0D%0A+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0A+BIND+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2F${this.capitalizeString(this.tipoLocalidadGlobal)}%2F${this.lugarBuscadoParsed}%3E+AS+%3Fmuni%29.%0D%0A+%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComarca%3E+%3Fcomarca.%0D%0A+%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComunidadAutonoma%3E+%3Fccaa.%0D%0A+FILTER+%28%3FrefArea+IN+%28%3Fmuni%2C+%3Fccaa%29%29.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23rustico-superficie%3E+%3Frust++%7D+.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23urbano-superficie%3E+%3Furba++%7D+.%0D%0A%7D%0D%0AORDER+BY+desc%28%3FrefPeriod%29%2C%3FrefArea%0D%0ALIMIT+2%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
      this.dataSource.porcentajeSueloRural = this.exportHtmlQuery(this.queryUrlRatioSuelo);
      this.dataSource.porcentajeSueloUrbano = this.exportHtmlQuery(this.queryUrlRatioSuelo);

      this.queryUrlIncendios = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct++%3FrefArea+%3FnameRefArea+sum+%28%3Fincendios+%29+as+%3Fincendios+++sum+%28xsd%3Adouble%28%3Fsuperficie_forestal_afectada%29+%29+as+%3Fsuperficie_forestal_afectada++++%0D%0A%0D%0Awhere+%7B+%0D%0A%0D%0A+++%3Fobs+qb%3AdataSet+%3Fdataset.+%0D%0A%0D%0A+++FILTER%28%3Fdataset+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F04-040017${this.sufijoCuboDatosGlobal}%3E%29%29.+%0D%0A%0D%0A%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.+%0D%0A%0D%0A%3FrefPeriod+time%3AinXSDgYear+%3Fyear.+%0D%0A%0D%0A+%0D%0A%0D%0AFILTER+%28%3Fyear+%3E%3D2001++%0D%0A%0D%0A%29.+%0D%0A%0D%0A%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.+%0D%0A%0D%0A%3FrefArea+rdfs%3Alabel+%3FnameRefArea.++%0D%0A%0D%0AFILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.+%0D%0A%0D%0ABIND+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2F${this.capitalizeString(this.tipoLocalidadGlobal)}%2F${this.lugarBuscadoParsed}%3E+AS+%3Fmuni%29.+%0D%0A%0D%0AFILTER+%28%3FrefArea+IN+%28%3Fmuni%29%29.+%0D%0A%0D%0AOPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23incendios%3E+%3Fincendios++%7D+.+%0D%0A%0D%0AOPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23superficie-forestal-afectada%3E+%3Fsuperficie_forestal_afectada++%7D+.+%0D%0A%0D%0A%7D+%0D%0A%0D%0Agroup+by+++%3FrefArea+%3FnameRefArea+%0D%0A%0D%0ALIMIT+20+&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
      this.dataSource.incendios = this.exportHtmlQuery(this.queryUrlIncendios);
      this.dataSource.hectareasAfectadas = this.exportHtmlQuery(this.queryUrlIncendios);

      this.queryUrlEsPoblado = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+%3Festa+where%0D%0A%7B%0D%0A++select+distinct+%3FrefArea+%3FrefArea%3D%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2F${this.capitalizeString(this.tipoLocalidadGlobal)}%2F${this.lugarBuscadoParsed}%3E+as+%3Festa++where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001${this.sufijoCuboDatosGlobal}%3E.%0D%0A+++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A++%7B+select+distinct+%3FrefPeriod+where+%7B%0D%0A+++++++++++++++++++++++++++++++++++++++++++++++++++%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001${this.sufijoCuboDatosGlobal}%3E.%0D%0A++++++++++++++++++++++++++++++++++++++++++++++++++++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+++++++++++++++++++++++++++++++++++++++++++++%7D%0D%0A+++++++++++++++++++++++++++++++++++++++++++++ORDER+BY+desc%28%3FrefPeriod%29%0D%0A+++++++++++++++++++++++++++++++++++++++++++++LIMIT+1++%7D%0D%0A%0D%0A+++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+++%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+%0D%0A+++FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0A+++%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComunidadAutonoma%3E+%3Fccaa.%0D%0A+++FILTER+%28%3FrefArea+IN+%28%3Fmuni%29%29.%0D%0A+++OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23poblacion%3E+%3Fpoblacion++%7D+.%0D%0A%7D%0D%0AORDER+BY+desc%28%3FrefPeriod%29%2C+desc%28%3Fpoblacion%29%2C+%3FrefArea%0D%0ALIMIT+20%0D%0A%7D%0D%0Aorder+by+desc+%28%3Festa%29%0D%0Alimit+1&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
      this.dataSource.esPoblado = this.exportHtmlQuery(this.queryUrlEsPoblado);

      if (this.tipoLocalidad === 'diputacion') {
        this.queryUrlEdadMedia = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3Fyear+xsd%3Afloat%28%3Fvalor%29+as+%3Fval+%3Fsexo+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030006${this.sufijoCuboDatosGlobal}%3E%3B%0D%0A++++++++++++%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FProvincia%2F${this.lugarBuscadoParsed}%3E%3B%0D%0A+++++++++++%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A++%7B+select+distinct+%3FrefPeriod+where+%7B%0D%0A+++++++++++++++++++++++++++++++++++++++++++++++++++%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030006TM%3E.%0D%0A++++++++++++++++++++++++++++++++++++++++++++++++++++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+++++++++++++++++++++++++++++++++++++++++++++%7D%0D%0A+++++++++++++++++++++++++++++++++++++++++++++ORDER+BY+desc%28%3FrefPeriod%29%0D%0A+++++++++++++++++++++++++++++++++++++++++++++LIMIT+1++%7D%0D%0A%0D%0A%0D%0A++++%3FrefPeriod+time%3AinXSDgYear+%3Fyear.%0D%0A%0D%0A++++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fdimension%23sexo%3E+%3Ffoo1.%0D%0A++++%3Ffoo1+skos%3AprefLabel+%3Fsexo++.%0D%0A+++OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23edad-media-de-la-poblacion%3E+%3Fvalor++%7D+.%0D%0A%7D%0D%0AORDER+BY+desc%28%3Fyear%29%2C+desc%28%3Fval%29%2C+%3Fsexo%0D%0ALIMIT+100%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
        this.dataSource.edadMedia = this.exportHtmlQuery(this.queryUrlEdadMedia);
      } else {
        this.queryUrlEdadMedia = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3Fyear+xsd%3Afloat%28%3Fvalor%29+as+%3Fval+%3Fsexo+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030006${this.sufijoCuboDatosGlobal}%3E%3B%0D%0A++++++++++++%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2F${this.capitalizeString(this.tipoLocalidad)}%2F${this.lugarBuscadoParsed}%3E%3B%0D%0A+++++++++++%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A++%7B+select+distinct+%3FrefPeriod+where+%7B%0D%0A+++++++++++++++++++++++++++++++++++++++++++++++++++%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030006TM%3E.%0D%0A++++++++++++++++++++++++++++++++++++++++++++++++++++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+++++++++++++++++++++++++++++++++++++++++++++%7D%0D%0A+++++++++++++++++++++++++++++++++++++++++++++ORDER+BY+desc%28%3FrefPeriod%29%0D%0A+++++++++++++++++++++++++++++++++++++++++++++LIMIT+1++%7D%0D%0A%0D%0A%0D%0A++++%3FrefPeriod+time%3AinXSDgYear+%3Fyear.%0D%0A%0D%0A++++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fdimension%23sexo%3E+%3Ffoo1.%0D%0A++++%3Ffoo1+skos%3AprefLabel+%3Fsexo++.%0D%0A+++OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23edad-media-de-la-poblacion%3E+%3Fvalor++%7D+.%0D%0A%7D%0D%0AORDER+BY+desc%28%3Fyear%29%2C+desc%28%3Fval%29%2C+%3Fsexo%0D%0ALIMIT+100%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
      }

      this.dataSource.edadMedia = this.exportHtmlQuery(this.queryUrlEdadMedia);

      this.queryUrlLocales = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct%0D%0A%3FrefArea+%3FnameRefArea+%3FrefPeriod+str%28%3Fyear%29+AS+%3FnameRefPeriod%0D%0Axsd%3Aint%28%3Fnumero_de_edificios%29+where+%7B%0D%0A%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010009${this.sufijoCuboDatosGlobal}%3E.%0D%0A%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A%3FrefPeriod+time%3AinXSDgYear+%3Fyear.%0D%0A%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.FILTER+%28%3FrefArea+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2F${this.capitalizeString(this.tipoLocalidadGlobal)}%2F${this.lugarBuscadoParsed}%3E%29%29.%0D%0A%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fdimension%23tipo-edificio-detalle%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fkos%2Fiaest%2Ftipo-edificio-detalle%2Flocales%3E.%0D%0A%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23numero-de-edificios%3E+%3Fnumero_de_edificios+.%0D%0A%7D%0D%0Aorder+by+desc%28%3Fyear%29%0D%0ALIMIT+1%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
      this.dataSource.edificiosDestinadosLocales = this.exportHtmlQuery(this.queryUrlLocales);

      //Datos Aragopedia portátil

      if (this.tipoLocalidad === 'diputacion') {
        this.queryTemas = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3Fdataset+%3Fid+%3Fdsd+%3Fnombre++where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++%3Fdataset+dct%3Aidentifier+%3Fid%3B%0D%0A+++++++++++++++++++qb%3Astructure+%3Fdsd.%0D%0A++++%3Fdsd+dc%3Atitle+%3Fnombre.%0D%0A%0D%0A+++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FProvincia%2F${this.lugarBuscadoParsed}%3E.%0D%0A%7D+%0D%0A%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`
      } else {
        this.queryTemas = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3Fdataset+%3Fid+%3Fdsd+%3Fnombre++where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++%3Fdataset+dct%3Aidentifier+%3Fid%3B%0D%0A+++++++++++++++++++qb%3Astructure+%3Fdsd.%0D%0A++++%3Fdsd+dc%3Atitle+%3Fnombre.%0D%0A%0D%0A+++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2F${this.capitalizeString(this.tipoLocalidad)}%2F${this.lugarBuscadoParsed}%3E.%0D%0A%7D+%0D%0A%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`
      }


      setTimeout(() => {

        this.resultSvc.getData(this.queryTemas).subscribe(data => {

          this.temasAragopedia = data.results.bindings;
          this.showTemas = data.results.bindings;
          this.filteredTemas = data.results.bindings;

          this.initForm();
        });
      }, 150);
      //Obtención de datos NOMBRE MUNICIPIO

      this.resultSvc.getData(this.queryUrlExtension).subscribe((data: any) => {
        this.sueloUrbano = data.results.bindings[0].urbano.value;
        this.sueloRural = data.results.bindings[0].rustico.value;
        this.dataYearExtension = data.results.bindings[0].nameRefPeriod.value;
        this.dataDownload[0].sueloRural = this.sueloRural;
        this.dataDownload[0].sueloUrbano = this.sueloUrbano;
      });

      this.resultSvc.getData(this.queryUrlDensidadPoblacion).subscribe((data: any) => {
        //debugger;
        //this.densidadPoblacion = (Number(data?.results.bindings[0].densidad_de_poblacion_habkm2.value)).toFixed(1).replace('.', ',');
        const densidad = data?.results.bindings[0]?.densidad_de_poblacion_habkm2?.value;
         //Se va a verificar si ante de llamar a la funcion number este es un valor valido
        if (densidad && !isNaN(Number(densidad))) {
          this.densidadPoblacion = (Number(densidad)).toFixed(1).replace('.', ',');
        } else {
          this.densidadPoblacion = '0'; // O cualquier otro valor por defecto
        }
       
        this.dataDownload[0].densidad = this.densidadPoblacion;
      });

      this.resultSvc.getData(this.queryUrlTotalCreativeWork).subscribe(data => {

        const number = data.results.bindings[0]['callret-0'].value;
        this.numberOfCreativeWork = this.format(number);
        this.dataDownload[0].mencionesEnPublicaciones = this.numberOfCreativeWork;
      })

      this.resultSvc.getData(this.queryUrlCreativeWork).subscribe((data: any) => {

        this.creativeWork = data.results.bindings;

        this.creativeWork?.forEach((element: any) => {
          let publicaciones = `Titulo: ${element.title.value}; url: ${element.url.value}; Tema: ${element.tema.value}; Abstract: ${element.resumen.value}`;
          this.dataDownload[0].creativeWorks += publicaciones;
        });

      });

      this.resultSvc.getData(this.queryUrlPoblacion).subscribe((data: any) => {

        this.yearPoblacion = data.results.bindings[0].nameRefPeriod.value;

        if (this.tipoLocalidad === 'municipio') {

          this.poblacion = data?.results.bindings.find((lugar: any) => lugar.nameRefArea.value.toLowerCase() === this.lugarBuscado.replace('Zaragóza', 'Zaragoza').toLowerCase()).poblac.value;

          this.dataDownload[0].habitantes = this.poblacion;

          const datos = data.results.bindings;
          const poblacion: any = [];
          const dataChart: any = [];

          datos.forEach((element: any) => {
            if (element.nameRefArea.value.toLowerCase() === this.lugarBuscado.toLowerCase()) {

              dataChart.push(element);
              this.yearsTablaPoblacion.push(element.nameRefPeriod.value);
              poblacion.push(element.poblac.value);
            }
          });
          this.datosDePoblacion = poblacion;
          for (let i = dataChart.length - 1; i >= 0; i--) {
            this.lineChartData.labels?.push(dataChart[i].nameRefPeriod.value);
            this.lineChartData.datasets[0].data.push(dataChart[i].poblac.value);
          }
          this.chart?.update();

        } else if (this.tipoLocalidad === 'comarca' || this.tipoLocalidad === 'diputacion') {
          const datos = data.results.bindings;

          this.poblacion = data.results.bindings[0].poblac.value;
          this.dataDownload[0].habitantes = this.poblacion;
          this.tablaPoblacion = datos;

          for (let i = datos.length - 1; i >= 0; i--) {
            this.municipio[0] = datos[0].nameRefArea.value;
            this.lineChartData.labels?.push(datos[i].nameRefPeriod.value);
            this.yearsTablaPoblacion.push(datos[i].nameRefPeriod.value);
            this.lineChartData.datasets[0].data.push(Number(data.results.bindings[i].poblac.value));
          }
          this.chart?.update();


        }
        else {
          this.poblacion = data.results.bindings[0].poblac.value;
        }
        this.chart?.update();
      });


      this.resultSvc.getData(this.queryUrlRatioSuelo).subscribe((data: any) => {
        this.yearRatioSuelo = data.results.bindings[0].nameRefPeriod.value;

        if (data.results.bindings.length !== 0) {
          let totalUrbano = data?.results.bindings[0].urbano.value;
          let totalRural = data?.results.bindings[0].rustico.value;

          this.porcentajeSueloRural = ((this.sueloRural / totalRural) * 100).toFixed(2).replace('.', ',');
          this.porcentajeSueloUrbano = ((this.sueloUrbano / totalUrbano) * 100).toFixed(2).replace('.', ',');

          this.dataDownload[0].porcentajeSueloRural = this.porcentajeSueloRural;
          this.dataDownload[0].porcentajeSueloUrbano = this.porcentajeSueloUrbano;
        }
      });

      this.resultSvc.getData(this.queryUrlIncendios).subscribe((data: any) => {
        this.incendiosUltimosAnos = data?.results.bindings[0].incendios.value;
        this.hectareasQuemadas = data?.results.bindings[0].superficie_forestal_afectada.value.replace('.', ',');
        this.dataDownload[0].incendiosDesde2022 = this.incendiosUltimosAnos;
        this.dataDownload[0].hectareasAfectadasPorIncendios = this.hectareasQuemadas;
      });

      this.resultSvc.getData(this.queryUrlEsPoblado).subscribe((data) => {
        this.esPoblado = data?.results.bindings[0].esta.value;
        this.dataDownload[0].esDeLosMasPoblados = this.esPoblado;

      });

      this.resultSvc.getData(this.queryUrlEdadMedia).subscribe((data) => {
        if (data.results.bindings.length !== 0) {
          this.edadMediaMujeres = Number(data?.results.bindings[0].val.value).toFixed(2).replace('.', ',');
          this.edadMediaHombres = Number(data?.results.bindings[1].val.value).toFixed(2).replace('.', ',');
          this.yearEdadMedia = data.results.bindings[0].year.value;
          this.dataDownload[0].edadMediaHombres = this.edadMediaHombres;
          this.dataDownload[0].edadMediaMujeres = this.edadMediaMujeres;
        }
      });

      this.resultSvc.getData(this.queryUrlLocales).subscribe(data => {
        this.locales = data.results.bindings[0]['callret-4'].value;
      });

    });
  }

  capitalizeString(str: any): string {
    return str.replace(/\w\S*/g, function (txt: any) {
      const lowerTxt = txt.toLowerCase();
      if (lowerTxt === 'el' || lowerTxt === 'y' || lowerTxt === 'del' ||
          lowerTxt === 'de' || lowerTxt === 'las' || lowerTxt === 'la' || 
          lowerTxt === 'los' || lowerTxt === 'de la' ) {
          return lowerTxt;
      } else {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
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
    return newStr;
  }

  deleteSpace(str: any): string {
    return str.split(' ').join('_');
  }

  reduceText(text: string): string {
    const reducedText = text.substr(0, 120);
    return (
      this.leerMas ? text : reducedText
    )
  }

  checkForMunicipioProvincia() {
    if (this.tipoLocalidadGlobal == 'municipio' && (this.lugarBuscadoParsed == 'Teruel' || this.lugarBuscadoParsed == 'Zaragoza' || this.lugarBuscadoParsed == 'Huesca')) {
      return 'Provincia';
    }
    else {
      return this.tipoLocalidadGlobal;
    }
  }

  replaceWord(str: string): string {
    return str
      .replace('ARAGON', 'ARAGÓN')
      .replace('ARAGO', 'ARAGÓ')
      .replace('GALLEGO', 'GÁLLEGO')
      .replace('MARTIN', 'MARTÍN')
      .replace('GUDAR', 'GÚDAR')
      .replace('ALBARRACIN', 'ALBARRACÍN')
      .replace('VALDEJALON', 'VALDEJALÓN')
      .replace('JACETANIA,_LA', 'LA_JACETANIA')
      .replace('/', '-')
  }

  replaceCaspe(str: string): string {
    return str
      .replace('-baix', '/Baix')
      .replace('-Baix', '/Baix')
      .replace('-Plana', '/Plana')
      .replace('Matarraña-', 'Matarraña/')
  }

  fixNames(str: string): string {
    return str
      .replace('Bajo_Aragón_–_Caspe_-_Baix_Aragó_–_Casp', 'Bajo_Aragón-Caspe/Baix_Aragó-Casp')
      .replace('Andorra_–_Sierra_de_Arcos', 'Andorra-Sierra_de_Arcos')
      .replace('Bajo_Cinca_-_Baix_Cinca', 'Bajo_Cinca/Baix_Cinca')
      .replace('Matarraña_-_Matarranya', 'Matarraña/Matarranya')
      .replace('La_Litera_-_La_Llitera', 'La_Litera/La_Llitera')
      .replace('Gúdar_–_Javalambre', 'Gúdar-Javalambre')
      .replace('Hoya_de_Huesca_-_Plana_de_Uesca', 'Hoya_de_Huesca/Plana_de_Uesca')
      .replace('de_La', 'de_la');
  }

  createNameForUrl(str: string): string {
    const nameIndex = str.lastIndexOf('/') + 1;
    return str.substring(nameIndex);
  }

  exportHtmlQuery(query: string) {
    const jsonFormat = 'application%2Fsparql-results%2Bjson';
    const htmlFormat = 'text%2Fhtml';

    const count = '+count+';
    const countDistinct = '+count%28distinct%28%3Fs%29%29++';
    const distinct = '+distinct%28%3Fs%29++';

    const htmlQuery = query?.replace(jsonFormat, htmlFormat).replace(count, '+').replace(countDistinct, distinct).replace('+count%28distinct+%3Fs%29+', '+distinct+%3Fs+').replace('+count%28+distinct+%3Fs%29+', '+distinct+%3Fs+').replace('https://query.wikidata.org/sparql?query=', 'https://query.wikidata.org/#');
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
      headers: ["Nombre", "Email", "Teléfono", "Dirección", "Código Postal", "Habitantes", "Suelo Rural", "Suelo Urbano", "Densidad de población", "Polígonos Industriales", "Explotaciones Ganaderas", "Alojamientos hoteleros", "Incendios desde 2001", "Hectáreas afectadas", "Menciones en publicaciones", "Alojamientos de turismo rural", "Imagen de portada", "Porcentaje de suelo rural con respecto Aragón", "Porcentaje de suelo urbano con respecto Aragón", "Es uno de los 20 municipios más poblados", "Edad media de los hombres", "Edad media de las mujeres", "Creative Works", "Miembros del pleno territorial", "Personas ilustres nacidas en el territorio", "Entidades singulares"],
      eol: '\n'
    };
/* sonarqube-ignore */
    new ngxCsv(this.dataDownload, `Datos de ${this.capitalizeString(this.tipoLocalidad)} ${this.lugarBuscado}`, options);
  }


  temaSelected(tema: any) {

    let rutaLimpia = '/' + tema.id.value;
    this.loading = true
    setTimeout(() => {
      if (rutaLimpia == '/') {
        return;
      }
      let query: string = 'select distinct ?refArea ?nameRefArea '

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

        let queryPrefijo = "<http://reference.data.gov.uk/id/year/"
        columnasCheckMesYAno.includes('mes_y_ano') ? query += '' : query += '?refPeriod (strafter(str(?refPeriod), "http://reference.data.gov.uk/id/year/") AS ?nameRefPeriod) '
        query += 'where { \n'
        query += " ?obs qb:dataSet <http://opendata.aragon.es/recurso/iaest/dataset" + rutaLimpia + ">.\n";
        query += " ?obs <http://purl.org/linked-data/sdmx/2009/dimension#refPeriod> ?refPeriod.\n";
        query += " ?obs <http://purl.org/linked-data/sdmx/2009/dimension#refArea> ?refArea.\n";
        query += " ?refArea rdfs:label ?nameRefArea.";
        query += ' FILTER ( lang(?nameRefArea) = "es" ).\n';


        if (rutaLimpia.charAt(rutaLimpia.length - 1) != "A") {

          let tipoZona = "";
          let uriPrefix;
          if (this.tipoLocalidad === 'diputacion') {
            uriPrefix = "<http://opendata.aragon.es/recurso/territorio/" + "Provincia/";
          } else {

            uriPrefix = "<http://opendata.aragon.es/recurso/territorio/" + this.capitalizeString(this.tipoLocalidad) + "/";
          }

          query += "FILTER (?refArea IN (";
          query += uriPrefix + this.lugarBuscadoParsed + ">";
          query += ")).\n";
        }
        let icolumnas = 0
        this.columnas.forEach((element: any) => {

          let nombreColumnaAux = element['callret-2'].value.replaceAll(' ', '_').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[{(/,.)}]/g, '')
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
        this.sparql(query);
        query ? this.loading = false : this.loading = true;

        this.queryTabla = 'https://opendata.aragon.es/sparql?default-graph-uri=&query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';


        this.aragopediaSvc.change(this.queryTabla);
      })
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

  format(number: any) {
      if (typeof number === 'number') {
        let partesNumero = number.toString().split('.');
        partesNumero[0] = this.formatNumber(partesNumero[0]); 
        return partesNumero.join('.'); 
      } else if (typeof number === 'string') {
        const numberConPunto = number.replace(',', '.');
       // Ahora convertimos a número y procedemos a formatear
        let partesNumero = Number(numberConPunto).toString().split('.');
        partesNumero[0] = this.formatNumber(partesNumero[0]); // Formatea la parte entera
    
        return partesNumero.join('.');
      }
    
      return number;
  }

  formatNumber(num:any) {
    // Convertir la cadena numérica a un número y luego formatearlo con separadores de miles.
    return new Intl.NumberFormat('de-DE').format(Number(num));
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

