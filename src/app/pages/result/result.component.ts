import { Component, ViewChild } from '@angular/core';
import { ResultService } from './result.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { AragopediaSelectorTemasComponent } from 'src/app/components/aragopedia-selector-temas/aragopedia-selector-temas.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AragopediaService } from 'src/app/components/aragopedia-tabla-datos/aragopediaService';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})

export class ResultComponent {

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
  tablaPoblacion: any;
  yearsTablaPoblacion: number[] = [];
  density: any;
  sueloUrbano: any;
  sueloRural: any;
  poligonos: any;
  email: any;
  telefono: any;
  direccion: any;
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
  densidadPoblacion: any
  imageWikiDataUrl!: string;
  map!: string;
  urlMap!: string;
  incendiosUltimosAnos!: string;
  hectareasQuemadas!: string;
  esPoblado!: string;
  edadMediaHombres!: string;
  edadMediaMujeres!: string;
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

  dataDownload = this.temp || [{ nombre: '', email: '', telefono: '', direccion: '', codigoPostal: '', habitantes: '', sueloRural: '', sueloUrbano: '', densidad: '', poligonosIndustriales: '', explotacionesGanaderas: '', plazasHoteleras: '', incendiosDesde2022: '', hectareasAfectadasPorIncendios: '', mencionesEnPublicaciones: '', alojamientosTuristicos: '', urlImagen: '', porcentajeSueloRural: '', porcentajeSueloUrbano: '', esDeLosMasPoblados: '', edadMediaHombres: '', edadMediaMujeres: '', creativeWorks: '', miembrosPleno: '', personasIlustres: '', entidadesSingulares: '' }];



  ngOnInit() {



    //Query id-localidades-tipo
    this.queryIdWikiData = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+%3Fs+str%28%3Fnombre%29+%3Fid+%3Fclasif%0D%0Awhere++%7B%0D%0A++++++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23classification%3E+%3Fclasif.+%0D%0A++++++%3Fs+dc%3Aidentifier+%3Fid.+%0D%0A+++++%3Fs+dc%3Atitle+%3Fnombre.%0D%0A+++++VALUES+%3Fclasif+%7B%3Chttps%3A%2F%2Fwww.geonames.org%2Fontology%23A.ADM2%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fkos%2Fcomarca%3E+%3Chttps%3A%2F%2Fwww.geonames.org%2Fontology%23P.PPL%3E%7D%0D%0A%7D%0D%0Aorder+by+asc%28%3Fclasif%29+%3Fid+%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

    // this.lugarBuscado = this.capitalizeString(this._route.snapshot.paramMap.get('municipio'));
    // this.lugarBuscadoParsed = this.deleteSpace(this._route.snapshot.paramMap.get('municipio'));
    // this.tipoLocalidad = this.deleteSpace(this._route.snapshot.paramMap.get('tipoLocalidad'));
    // //console.log(this.tipoLocalidad);

    // this.codigoIne = this._route.snapshot.paramMap.get('municipio');
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
    this.queryNombresIne = `https://opendata.aragon.es/sparql?default-graph-uri=&query=prefix+dbpedia%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2F%3E+%0D%0Aprefix+org%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23%3E%0D%0Aprefix+aragopedia%3A+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23%3E%0D%0A%0D%0Aselect+%3Fnombre+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E++where+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2F${this.tipoLocalidad}%2F${this.codigoIne}%3E+dc%3Atitle+%3Fnombre%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

    //Obtenemos id y tipo de localidad antes de nada

    this.resultSvc.getData(this.queryIdWikiData).subscribe((data: any) => {
      // const found = data?.results.bindings.find((element: any) => this.capitalizeString(element['callret-1'].value) == this.lugarBuscado);
      // //console.log(data?.results.bindings.find((element: any) => {
      //   element['callret-1'].value.toUpperCase() === this.lugarBuscado.toUpperCase();
      // }))
      // //console.log(found);

      // this.codigoIne = found.id.value;

      // const urlAnalizada = found.s.value.split('/');
      // this.tipoLocalidad = urlAnalizada[6];

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
            this.map = `https://idearagon.aragon.es/geoserver/VISOR2D/wms?service=WMS&version=1.1.0&request=GetMap&layers=VISOR2D%3ALimAragon,VISOR2D%3AProvincia&bbox=569192.3553%2C4412927.4576%2C810631.1337%2C4754878.6523&width=271&height=384&srs=EPSG%3A25830&format=image/png&CQL_FILTER=1=1;c_prov=22&STYLES=,Comarca_t2m_VISOR2D`;
            this.urlMap = `https://idearagon.aragon.es/visor/index.html?ACTIVELAYER=Provincia&QUERY=C_PROV=22`;
          } else if (this.codigoIne === '7823') {
            this.map = `https://idearagon.aragon.es/geoserver/VISOR2D/wms?service=WMS&version=1.1.0&request=GetMap&layers=VISOR2D%3ALimAragon,VISOR2D%3AProvincia&bbox=569192.3553%2C4412927.4576%2C810631.1337%2C4754878.6523&width=271&height=384&srs=EPSG%3A25830&format=image/png&CQL_FILTER=1=1;c_prov=50&STYLES=,Comarca_t2m_VISOR2D`;
            this.urlMap = `https://idearagon.aragon.es/visor/index.html?ACTIVELAYER=Provincia&QUERY=C_PROV=50`;
          } else {
            this.map = `https://idearagon.aragon.es/geoserver/VISOR2D/wms?service=WMS&version=1.1.0&request=GetMap&layers=VISOR2D%3ALimAragon,VISOR2D%3AProvincia&bbox=569192.3553%2C4412927.4576%2C810631.1337%2C4754878.6523&width=271&height=384&srs=EPSG%3A25830&format=image/png&CQL_FILTER=1=1;c_prov=44&STYLES=,Comarca_t2m_VISOR2D`;
            this.urlMap = `https://idearagon.aragon.es/visor/index.html?ACTIVELAYER=Provincia&QUERY=C_PROV=44`
          }
        }


        this.queryUrlPoligonos = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select++distinct+count%28%3Fs%29+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A%3Fs+%3Fp+%3Fo%3B%0D%0A++++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23linkedTo%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2F${this.tipoLocalidad}%2F${this.codigoIne}%3E%3B%0D%0A++++dc%3Asource+%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2F0d8fab77-91db-4832-8184-ea83a0bc4ca5%2Fresource%2F66c34c59-7d01-4e1c-983c-7edc48602cda%3E.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

        if (this.tipoLocalidad === 'municipio') {
          this.queryUrlContacto = `https://opendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0D%0APREFIX+ns%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fprov%23%3E%0D%0APREFIX+vcard%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23%3E%0D%0A%0D%0ASELECT+%3Femail+%3Ftel+%3Ffax+%3Fdireccion+%3FcodPostal+%0D%0AFROM+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E%0D%0AWHERE+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2F${this.tipoLocalidad}%2F${this.codigoIne}%3E+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23hasSite%3E+%3FsiteAddress%3B%0D%0A+++++dc%3Asource+%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2F02a7f1c1-4b4a-4ef6-b35d-bec17e495476%2Fresource%2F5012cd09-edec-4c01-af43-818508c808d9%3E.%0D%0A%0D%0A++%3FsiteAddress+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23siteAddress%3E+%3Faddress2.%0D%0A%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Aemail+%3Femail+%7D.%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Atel+%3Ftel+%7D.%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Afax+%3Ffax+%7D.%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Astreet-address%3Fdireccion+%7D.%0D%0A+++OPTIONAL+%7B%3Faddress2+vcard%3Apostal-code+%3FcodPostal+%7D.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on
`;
        } else if (this.tipoLocalidad === 'comarca') {
          this.queryUrlContacto = `https://opendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0D%0APREFIX+ns%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fprov%23%3E%0D%0APREFIX+vcard%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23%3E%0D%0A%0D%0ASELECT+%3Femail+%3Ftel+%3Ffax+%3Fdireccion+%3FcodPostal+%0D%0AFROM+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E%0D%0AWHERE+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fcomarca%2FF${this.codigoIne}%3E+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23hasSite%3E+%3FsiteAddress%3B%0D%0A+++++dc%3Asource+%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2F02a7f1c1-4b4a-4ef6-b35d-bec17e495476%2Fresource%2F5012cd09-edec-4c01-af43-818508c808d9%3E.%0D%0A%0D%0A++%3FsiteAddress+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23siteAddress%3E+%3Faddress2.%0D%0A%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Aemail+%3Femail+%7D.%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Atel+%3Ftel+%7D.%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Afax+%3Ffax+%7D.%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Astreet-address%3Fdireccion+%7D.%0D%0A+++OPTIONAL+%7B%3Faddress2+vcard%3Apostal-code+%3FcodPostal+%7D.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`
        } else {
          this.queryUrlContacto = `https://opendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0D%0APREFIX+ns%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fprov%23%3E%0D%0APREFIX+vcard%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23%3E%0D%0A%0D%0ASELECT+%3Femail+%3Ftel+%3Ffax+%3Fdireccion+%3FcodPostal+%0D%0AFROM+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E%0D%0AWHERE+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fdiputacion%2FF${this.codigoIne}%3E+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23hasSite%3E+%3FsiteAddress%3B%0D%0A+++++dc%3Asource+%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2F02a7f1c1-4b4a-4ef6-b35d-bec17e495476%2Fresource%2F5012cd09-edec-4c01-af43-818508c808d9%3E.%0D%0A%0D%0A++%3FsiteAddress+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23siteAddress%3E+%3Faddress2.%0D%0A%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Aemail+%3Femail+%7D.%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Atel+%3Ftel+%7D.%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Afax+%3Ffax+%7D.%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Astreet-address%3Fdireccion+%7D.%0D%0A+++OPTIONAL+%7B%3Faddress2+vcard%3Apostal-code+%3FcodPostal+%7D.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`
        }


        this.queryUrlMiembrosPleno = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select++distinct+%3Fpersona+%3Fcargo+%3FnombrePersona+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A%3Fpuesto+%3Fp+%3Fo%3B%0D%0A+++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23role%3E+%3Frol%3B%0D%0A+++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23postIn%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2F${this.tipoLocalidad}%2F${this.codigoIne}%3E%3B%0D%0Adc%3Asource+%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2F35134487-53ef-4569-ab42-b1d0f5698140%2Fresource%2F89f4dd66-f6c2-4a5b-a44d-ff8df19936bd%3E.%0D%0A%3Frol+dc%3Atitle+%3Fcargo.%0D%0A%3Fpersona+++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23holds%3E+%3Fpuesto.%0D%0AOPTIONAL+%7B+%3Fpersona+%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2Fname%3E+%3FnombrePersona.+%7D%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

        this.queryUrlAlojamientosTuristicos = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select++distinct+count%28%3Fs%29+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A%3Fs+%3Fp+%3Fo%3B%0D%0A++++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23linkedTo%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2F${this.tipoLocalidad}%2F${this.codigoIne}%3E%3B%0D%0A++++dc%3Asource+%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2Fb58bc283-573f-4fa5-9c0c-ff9136eab2c1%2Fresource%2F993c5ebf-5ced-478a-8791-159b2e87e789%3E.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

        this.queryUrlExplotacionesGanaderas = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+count%28distinct%28%3Fs%29%29+%3Fx+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A%3Fs+%3Fx+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2F${this.tipoLocalidad}%2F${this.codigoIne}%3E%3B%0D%0A++++dc%3Asource+%3Fvista.%0D%0A++FILTER%28%3Fvista+IN+%28%0D%0A++++%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2F309b8aaa-406e-455c-ad51-05b9de5498b6%2Fresource%2F599f3eec-b111-4741-8674-9ce324b22334%3E%2C%0D%0A++++%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2F309b8aaa-406e-455c-ad51-05b9de5498b6%2Fresource%2F54f8e0f1-19f5-4f4e-b826-c9b959156756%3E%2C%0D%0A++++%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2F309b8aaa-406e-455c-ad51-05b9de5498b6%2Fresource%2F8db7f751-e48d-4130-8731-2b6691c2ce9b%3E%2C%0D%0A++++%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2F309b8aaa-406e-455c-ad51-05b9de5498b6%2Fresource%2F4fe1b669-1a7f-42f0-a822-79cebe673c46%3E%2C%0D%0A++++%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2F309b8aaa-406e-455c-ad51-05b9de5498b6%2Fresource%2Fbabeae5d-b9c9-4dce-9be8-346f49be565a%3E%2C%0D%0A++++%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2F309b8aaa-406e-455c-ad51-05b9de5498b6%2Fresource%2Fb4db038f-7d96-4135-87ac-022074cd8f6a%3E%2C%0D%0A++++%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2F309b8aaa-406e-455c-ad51-05b9de5498b6%2Fresource%2F8bb11abe-8093-4b9b-82b2-3a0faaf852d4%3E%2C%0D%0A++++%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2F309b8aaa-406e-455c-ad51-05b9de5498b6%2Fresource%2Fb4339e4d-4f9a-453f-bf6a-3cf9f2d08287%3E%2C%0D%0A++++%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2F309b8aaa-406e-455c-ad51-05b9de5498b6%2Fresource%2Fdb9a2d5e-f2af-4af3-90eb-e708604b9688%3E%2C%0D%0A++++%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2F309b8aaa-406e-455c-ad51-05b9de5498b6%2Fresource%2Fd3e080be-e55a-4e92-8605-031e752550db%3E%0D%0A++%29%29.%0D%0A+FILTER+%28%3Fx++IN+%28%0D%0A++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fdimensionproperty%2Fexplotaciones-ganaderas-apicola-dimension%2F5%3E%2C%0D%0A++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fdimensionproperty%2Fexplotaciones-ganaderas-ovino-dimension%2F5%3E%2C%0D%0A++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fdimensionproperty%2Fexplotaciones-ganaderas-porcino-dimension%2F5%3E%2C%0D%0A++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fdimensionproperty%2Fexplotaciones-ganaderas-cunicola-dimension%2F5%3E%2C%0D%0A++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fdimensionproperty%2Fexplotaciones-ganaderas-bovino-dimension%2F5%3E%2C%0D%0A++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fdimensionproperty%2Fexplotaciones-ganaderas-avicola-dimension%2F5%3E%2C%0D%0A++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fdimensionproperty%2Fexplotaciones-ganaderas-otras-dimension%2F5%3E%2C%0D%0A++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fdimensionproperty%2Fexplotaciones-ganaderas-nucleos-zoologicos-dimension%2F5%3E%2C%0D%0A++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fdimensionproperty%2Fexplotaciones-ganaderas-equido-dimension%2F5%3E%0D%0A%29%29.%0D%0A%7D%0D%0Alimit+100&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

        this.queryUrlPlazasHoteleras = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select++distinct+count%28%3Fs%29+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A%3Fs+%3Fp+%3Fo%3B%0D%0A++++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23linkedTo%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2F${this.tipoLocalidad}%2F${this.codigoIne}%3E%3B%0D%0A+++++dc%3Asource+%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2F87b07cd4-c1b0-41c4-b071-c18db7c0cf58%2Fresource%2F8303127d-90c6-4e94-9617-e6e602a0140a%3E.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

        if (this.tipoLocalidad === 'diputacion') {
          this.queryUrlGetCodigoIne = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+%3Fwikidata+%3Faragopedia+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2F${this.tipoLocalidad}%2F${this.codigoIne}%3E+skos%3AexactMatch+%3Fwikidata%3B%0D%0A+++owl%3AsameAs+%3Faragopedia.%0D%0A++FILTER%28regex%28%3Fwikidata%2C+%22http%3A%2F%2Fwww.wikidata.org%2F%22%29%29.%0D%0A++FILTER%28regex%28%3Faragopedia%2C+%22http%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FProvincia%2F%22%29%29.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
        } else {
          this.queryUrlGetCodigoIne = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+%3Fwikidata+%3Faragopedia+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2F${this.tipoLocalidad}%2F${this.codigoIne}%3E+skos%3AexactMatch+%3Fwikidata%3B%0D%0A+++owl%3AsameAs+%3Faragopedia.%0D%0A++FILTER%28regex%28%3Fwikidata%2C+%22http%3A%2F%2Fwww.wikidata.org%2F%22%29%29.%0D%0A++FILTER%28regex%28%3Faragopedia%2C+%22http%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2F${this.capitalizeString(this.tipoLocalidad)}%2F%22%29%29.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

        }

        this.queryUrlEntidadesSingulares = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select++distinct+%3Fs+%3FnombreEntidad+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A%3Fs+dc%3Atitle+%3FnombreEntidad%3B%0D%0A++++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23linkedTo%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2F${this.tipoLocalidad}%2F${this.codigoIne}%3E%3B%0D%0A+++++dc%3Asource+%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2F331c4c50-e0df-4741-9975-5d5552d8875b%2Fresource%2F4b4e2b16-0327-4196-8636-9de97b9d5961%3E.%0D%0A%7D%0D%0Aorder+by+%3Fs%0D%0Alimit+100&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

        this.queryUrlOficinaComarcal = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select++count%28distinct+%3Fs%29+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A%3Fs+%3Fp+%3Fo%3B%0D%0A++++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23linkedTo%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2F${this.tipoLocalidad}%2F${this.codigoIne}%3E%3B%0D%0A++++dc%3Asource+%3Chttps%3A%2F%2Fopendata.aragon.es%2Fdataset%2Fb0faccd6-aa4f-4ab3-b81e-6c9408448127%2Fresource%2F118a6803-7bb1-4191-885d-c2329a9c0a9b%3E.%0D%0A%0D%0A%7D%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`

        //Obtención de datos por ID

        this.resultSvc.getData(this.queryUrlPoligonos).subscribe((data: any) => {
          this.poligonos = data?.results.bindings[0]['callret-0'].value;
          this.dataDownload[0].poligonosIndustriales = this.poligonos;
        });

        this.resultSvc.getData(this.queryUrlContacto).subscribe((data: any) => {

          this.email = data.results.bindings[0].email?.value;

          this.telefono = data.results.bindings[0].tel?.value;
          this.direccion = data.results.bindings[0].direccion?.value.toLowerCase();
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
            this.explotacionesGanaderas = data.results.bindings[0]['callret-0']?.value;
            this.dataDownload[0].explotacionesGanaderas = this.explotacionesGanaderas;
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

        //if (this.tipoLocalidad === 'municipio') {
        this.resultSvc.getData(this.queryUrlGetCodigoIne).subscribe((data) => {
          const urlAnalizada = data?.results.bindings[0].wikidata.value;
          this.idLocalidad = urlAnalizada.split('/')[4];

          this.queryImageWikiData = `https://query.wikidata.org/sparql?query=%0Aselect%20%3Fimg%20where%20%7B%20wd%3A${this.idLocalidad}%20wdt%3AP18%20%3Fimg%20%7D`;

          this.queryUrlPersonasIlustres = `https://query.wikidata.org/sparql?query=SELECT%20%3Fitem%20%3FitemLabel%20%3Fabout%20(count(%3Fx)%20as%20%3Fcont)%0AWHERE%20%0A%7B%0A%20%20%3Fitem%20wdt%3AP19%20wd%3A${this.idLocalidad}.%0A%20%20%3Fitem%20%3Fx%20%20%3Fo.%0A%20%20%3Fabout%20schema%3Aabout%20%3Fitem.%0A%20%20%3Fabout%20schema%3AinLanguage%20%22es%22.%0A%20%20%3Fabout%20schema%3AisPartOf%20%3Chttps%3A%2F%2Fes.wikipedia.org%2F%3E.%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22es%2Cen%22.%20%7D%0A%7D%0Agroup%20by%20%3Fitem%20%3FitemLabel%20%3Fabout%0Aorder%20by%20desc(%3Fcont)%20limit%2020`;

          this.resultSvc.getData(this.queryImageWikiData).subscribe((data: any) => {
            this.imageWikiDataUrl = data?.results.bindings[0].img.value;
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
        //}

        this.resultSvc.getData(this.queryUrlOficinaComarcal).subscribe(data => {
          this.tieneOficinaComarcal = Number(data.results.bindings[0]['callret-0'].value);
        })
      }

    });


    //Queries URLs NOMBRE MUNICIPIO

    this.resultSvc.getData(this.queryNombresIne).subscribe(data => {

      const lastPosition = data.results.bindings.length - 1
      let nombreMunicipio = this.replaceWord(data?.results.bindings[lastPosition].nombre.value);
      this.tituloFicha = this.capitalizeString(nombreMunicipio).replace('Zaragóza', 'Zaragoza').replace('Diputacion', 'Diputación');

      if (this.tipoLocalidad === 'diputacion') {
        nombreMunicipio = data?.results.bindings[lastPosition].nombre.value.replace('ZARAGÓZA', 'ZARAGOZA')
        this.lugarBuscado = nombreMunicipio;
        this.lugarBuscadoParsed = this.capitalizeString(nombreMunicipio.slice(25, nombreMunicipio.length)).replace('Zaragóza', 'Zaragoza');
      } else {
        this.lugarBuscado = this.capitalizeString(nombreMunicipio.toLowerCase());
        this.dataDownload[0].nombre = this.lugarBuscado;
        this.lugarBuscadoParsed = this.replaceCaspe(this.capitalAfterHyphen(this.capitalAfterSlash(this.deleteSpace(this.lugarBuscado))));

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
        }
      }


      ////console.log(this.lugarBuscadoParsed)

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

      if (this.tipoLocalidad === 'diputacion' || this.tipoLocalidad === 'municipio') {
        this.queryUrlExtension = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FrefArea+%3FnameRefArea+str%28%3Fyear%29+AS+%3FnameRefPeriod+xsd%3Aint%28%3Frust%29+as+%3Frustico+xsd%3Aint%28%3Furba%29+as+%3Furbano+where+%7B%0D%0A%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0AFILTER%28%3Fdataset+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019A%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019TC%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019${this.sufijoCuboDatosGlobal}%3E%29%29.%0D%0A%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A%3FrefPeriod+time%3AinXSDgYear+%3Fyear.%0D%0A%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A%3FrefArea+rdfs%3Alabel+%3FnameRefArea.%0D%0AFILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0ABIND+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FMunicipio%2F${this.lugarBuscadoParsed}%3E+AS+%3Fmuni%29.%0D%0A%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComarca%3E+%3Fcomarca.%0D%0A%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComunidadAutonoma%3E+%3Fccaa.%0D%0AFILTER+%28%3FrefArea+IN+%28%3Fmuni%2C+%3Fccaa%29%29.%0D%0AOPTIONAL+%7B+%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23rustico-superficie%3E+%3Frust+%7D+.%0D%0AOPTIONAL+%7B+%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23urbano-superficie%3E+%3Furba+%7D+.%0D%0A%7D%0D%0AORDER+BY+desc%28%3Fyear%29%2C%3FrefArea%0D%0ALIMIT+2%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
      } else {
        this.queryUrlExtension = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FrefArea+%3FnameRefArea+str%28%3Fyear%29+AS+%3FnameRefPeriod+xsd%3Aint%28%3Frust%29+as+%3Frustico+xsd%3Aint%28%3Furba%29+as+%3Furbano+where+%7B%0D%0A%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0AFILTER%28%3Fdataset+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019A%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019TC%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019${this.sufijoCuboDatosGlobal}%3E%29%29.%0D%0A%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A%3FrefPeriod+time%3AinXSDgYear+%3Fyear.%0D%0A%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A%3FrefArea+rdfs%3Alabel+%3FnameRefArea.%0D%0AFILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0ABIND+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FMunicipio%2F${this.lugarBuscadoParsed}%3E+AS+%3Fmuni%29.%0D%0A%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComarca%3E+%3Fcomarca.%0D%0A%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComunidadAutonoma%3E+%3Fccaa.%0D%0AFILTER+%28%3FrefArea+IN+%28%3Fmuni%2C+%3Fccaa%29%29.%0D%0AOPTIONAL+%7B+%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23rustico-superficie%3E+%3Frust+%7D+.%0D%0AOPTIONAL+%7B+%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23urbano-superficie%3E+%3Furba+%7D+.%0D%0A%7D%0D%0AORDER+BY+desc%28%3Fyear%29%2C%3FrefArea%0D%0ALIMIT+2%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
      }
      if (this.tipoLocalidad === 'municipio') {
        this.queryUrlPoblacion = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FrefArea+%3FnameRefArea+%3FnameRefPeriod+%3Fpoblac+where+%7B%0D%0A%0D%0Aselect+distinct+%3FrefArea+%3FnameRefArea+str%28%3Fyear%29+AS+%3FnameRefPeriod+xsd%3Aint%28%3Fpoblacion%29+as+%3Fpoblac+where+%7B%0D%0A%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0AFILTER%28%3Fdataset+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001A%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001TC%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001TM%3E%29%29.%0D%0A%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A%3FrefPeriod+time%3AinXSDgYear+%3Fyear.%0D%0A%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A%3FrefArea+rdfs%3Alabel+%3FnameRefArea.%0D%0AFILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0ABIND+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2F${this.capitalizeString(this.tipoLocalidadGlobal)}%2F${this.lugarBuscadoParsed}%3E+AS+%3Fmuni%29.%0D%0A%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComarca%3E+%3Fcomarca.%0D%0A%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComunidadAutonoma%3E+%3Fccaa.%0D%0AFILTER+%28%3FrefArea+IN+%28%3Fmuni%2C+%3Fcomarca%2C+%3Fccaa%29%29.%0D%0AOPTIONAL+%7B+%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23poblacion%3E+%3Fpoblacion+%7D+.%0D%0A%7D%0D%0AORDER+BY+desc%28%3Fyear%29%2C+%3FrefArea%0D%0ALIMIT+15%0D%0A%7D%0D%0Aorder+by+%3FrefArea%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
      } else if (this.tipoLocalidad === 'comarca') {
        this.queryUrlPoblacion = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FrefArea+%3FnameRefArea+%3FrefPeriod+%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F%22%29+AS+%3FnameRefPeriod%29+sum+%28%3Fpoblac+%29+as+%3Fpoblac++++where+%7B%0D%0A+%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001TC%3E.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0AFILTER+%28%3FrefPeriod+IN+%28%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2017%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2018%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2019%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2020%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2021%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.FILTER+%28%3FrefArea+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FComarca%2F${this.lugarBuscadoParsed}%3E%29%29.%0D%0AOPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23poblacion%3E+%3Fpoblac++%7D+.%0D%0A%7D+%0D%0A%0D%0ALIMIT+300&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`
      } else {
        this.queryUrlPoblacion = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FrefArea+%3FnameRefArea+%3FrefPeriod+%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F%22%29+AS+%3FnameRefPeriod%29+sum+%28%3Fpoblac+%29+as+%3Fpoblac++++where+%7B%0D%0A+%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001TM%3E.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0AFILTER+%28%3FrefPeriod+IN+%28%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2017%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2018%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2019%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2020%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2021%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.FILTER+%28%3FrefArea+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FMunicipio%2F${this.lugarBuscadoParsed}%3E%29%29.%0D%0AOPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23poblacion%3E+%3Fpoblac++%7D+.%0D%0A%7D+%0D%0A%0D%0ALIMIT+300&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`
      }

      this.queryUrlCreativeWork = `https://opendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+schema%3A+%3Chttp%3A%2F%2Fschema.org%2F%3E%0D%0A%0D%0Aselect+%3Ftitle+%3Furl+%3Ftema+%3Fresumen%0D%0Awhere+%7B%0D%0A++%3Fs+a+schema%3ACreativeWork%3B%0D%0A+++++++schema%3Aabout+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2F${this.capitalizeString(this.tipoLocalidadGlobal)}%2F${this.lugarBuscadoParsed}%3E%3B%0D%0A+++++++schema%3Atitle+%3Ftitle%3B%0D%0A+++++++schema%3Aurl+%3Furl%3B%0D%0A+++++++schema%3Aconcept+%3Ftema%3B%0D%0Aschema%3Aabstract+%3Fresumen.%0D%0A%7D%0D%0Alimit+10&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

      this.queryUrlTotalCreativeWork = `https://opendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+schema%3A+%3Chttp%3A%2F%2Fschema.org%2F%3E%0D%0A%0D%0Aselect+%3Ftitle+%3Furl+%3Ftema+%3Fresumen%0D%0Awhere+%7B%0D%0A++%3Fs+a+schema%3ACreativeWork%3B%0D%0A+++++++schema%3Aabout+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2F${this.capitalizeString(this.tipoLocalidadGlobal)}%2F${this.lugarBuscadoParsed}%3E%3B%0D%0A+++++++schema%3Atitle+%3Ftitle%3B%0D%0A+++++++schema%3Aurl+%3Furl%3B%0D%0A+++++++schema%3Aconcept+%3Ftema%3B%0D%0Aschema%3Aabstract+%3Fresumen.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

      this.queryUrlRatioSuelo = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FrefArea+%3FnameRefArea+%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F%22%29+AS+%3FnameRefPeriod%29+xsd%3Aint%28%3Frust%29+as+%3Frustico+xsd%3Aint%28%3Furba%29+as+%3Furbano+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++FILTER%28%3Fdataset+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019A%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019TC%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019TM%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+FILTER+%28%3FrefPeriod+IN+%28%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2018%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2019%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2020%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2021%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+%0D%0A+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0A+BIND+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2F${this.capitalizeString(this.tipoLocalidadGlobal)}%2F${this.lugarBuscadoParsed}%3E+AS+%3Fmuni%29.%0D%0A+%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComarca%3E+%3Fcomarca.%0D%0A+%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComunidadAutonoma%3E+%3Fccaa.%0D%0A+FILTER+%28%3FrefArea+IN+%28%3Fmuni%2C+%3Fccaa%29%29.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23rustico-superficie%3E+%3Frust++%7D+.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23urbano-superficie%3E+%3Furba++%7D+.%0D%0A%7D%0D%0AORDER+BY+desc%28%3FrefPeriod%29%2C%3FrefArea%0D%0ALIMIT+2%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

      this.queryUrlIncendios = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct++%3FrefArea+%3FnameRefArea+sum+%28%3Fincendios+%29+as+%3Fincendios+++sum+%28xsd%3Adouble%28%3Fsuperficie_forestal_afectada%29+%29+as+%3Fsuperficie_forestal_afectada+++%0D%0A+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++FILTER%28%3Fdataset+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F04-040017${this.sufijoCuboDatosGlobal}%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0AFILTER+%28%3FrefPeriod+IN+%28%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2001%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2002%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2003%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2004%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2005%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2006%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2007%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2008%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2009%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2010%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2011%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2012%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2013%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2014%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2015%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2016%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2017%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2018%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2019%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2020%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+%0D%0A+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0A+BIND+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2F${this.capitalizeString(this.tipoLocalidadGlobal)}%2F${this.lugarBuscadoParsed}%3E+AS+%3Fmuni%29.%0D%0A+FILTER+%28%3FrefArea+IN+%28%3Fmuni%29%29.%0D%0AOPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23incendios%3E+%3Fincendios++%7D+.%0D%0AOPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23superficie-forestal-afectada%3E+%3Fsuperficie_forestal_afectada++%7D+.%0D%0A%7D%0D%0Agroup+by+++%3FrefArea+%3FnameRefArea%0D%0ALIMIT+20%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;


      this.queryUrlEsPoblado = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+%3Festa+where%0D%0A%7B%0D%0A++select+distinct+%3FrefArea+%3FrefArea%3D%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2F${this.capitalizeString(this.tipoLocalidadGlobal)}%2F${this.lugarBuscadoParsed}%3E+as+%3Festa++where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001${this.sufijoCuboDatosGlobal}%3E.%0D%0A+++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A++%7B+select+distinct+%3FrefPeriod+where+%7B%0D%0A+++++++++++++++++++++++++++++++++++++++++++++++++++%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001${this.sufijoCuboDatosGlobal}%3E.%0D%0A++++++++++++++++++++++++++++++++++++++++++++++++++++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+++++++++++++++++++++++++++++++++++++++++++++%7D%0D%0A+++++++++++++++++++++++++++++++++++++++++++++ORDER+BY+desc%28%3FrefPeriod%29%0D%0A+++++++++++++++++++++++++++++++++++++++++++++LIMIT+1++%7D%0D%0A%0D%0A+++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+++%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+%0D%0A+++FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0A+++%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComunidadAutonoma%3E+%3Fccaa.%0D%0A+++FILTER+%28%3FrefArea+IN+%28%3Fmuni%29%29.%0D%0A+++OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23poblacion%3E+%3Fpoblacion++%7D+.%0D%0A%7D%0D%0AORDER+BY+desc%28%3FrefPeriod%29%2C+desc%28%3Fpoblacion%29%2C+%3FrefArea%0D%0ALIMIT+20%0D%0A%7D%0D%0Aorder+by+desc+%28%3Festa%29%0D%0Alimit+1&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

      this.queryUrlEdadMedia = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3Fobs+%3FrefArea+%3FnameRefArea+%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F%22%29+AS+%3FnameRefPeriod%29+xsd%3Afloat%28%3Fvalor%29+as+%3Fval+%3Fsexo+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A++%7B+select+distinct+%3FrefPeriod+where+%7B%0D%0A+++++++++++++++++++++++++++++++++++++++++++++++++++%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030006${this.sufijoCuboDatosGlobal}%3E.%0D%0A++++++++++++++++++++++++++++++++++++++++++++++++++++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+++++++++++++++++++++++++++++++++++++++++++++%7D%0D%0A+++++++++++++++++++++++++++++++++++++++++++++ORDER+BY+desc%28%3FrefPeriod%29%0D%0A+++++++++++++++++++++++++++++++++++++++++++++LIMIT+1++%7D%0D%0A%0D%0A+++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+++%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+%0D%0AVALUES+%3Fdataset+%7B+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030006TM%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030006TC%3E++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030006A%3E%7D%0D%0A+++FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0A+++BIND+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2F${this.capitalizeString(this.tipoLocalidadGlobal)}%2F${this.lugarBuscadoParsed}%3E+AS+%3Fmuni%29.%0D%0A+++%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComarca%3E+%3Fcomarca.%0D%0A+++%3Fmuni2+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComarca%3E+%3Fcomarca.%0D%0A+++%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComunidadAutonoma%3E+%3Fccaa.%0D%0A+++FILTER+%28%3FrefArea+IN+%28%3Fmuni%2C+%3Fcomarca%2C+%3Fccaa%29%29.%0D%0A%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fdimension%23sexo%3E+%3Ffoo1.%0D%0A+%3Ffoo1+skos%3AprefLabel+%3Fsexo++.%0D%0A+++OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23edad-media-de-la-poblacion%3E+%3Fvalor++%7D+.%0D%0A%7D%0D%0AORDER+BY+desc%28%3FrefPeriod%29%2C+desc%28%3Fval%29%2C+%3FrefArea%2C+%3Fsexo%0D%0ALIMIT+100%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

      this.queryUrlLocales = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct%0D%0A%3FrefArea+%3FnameRefArea+%3FrefPeriod+str%28%3Fyear%29+AS+%3FnameRefPeriod%0D%0Axsd%3Aint%28%3Fnumero_de_edificios%29+where+%7B%0D%0A%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010009${this.sufijoCuboDatosGlobal}%3E.%0D%0A%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A%3FrefPeriod+time%3AinXSDgYear+%3Fyear.%0D%0A%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.FILTER+%28%3FrefArea+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2F${this.capitalizeString(this.tipoLocalidadGlobal)}%2F${this.lugarBuscadoParsed}%3E%29%29.%0D%0A%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fdimension%23tipo-edificio-detalle%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fkos%2Fiaest%2Ftipo-edificio-detalle%2Flocales%3E.%0D%0A%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23numero-de-edificios%3E+%3Fnumero_de_edificios+.%0D%0A%7D%0D%0Aorder+by+desc%28%3Fyear%29%0D%0ALIMIT+1%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`


      //Obtención de datos NOMBRE MUNICIPIO

      this.resultSvc.getData(this.queryUrlExtension).subscribe((data: any) => {
        if (data?.results.bindings.length !== 0) {
          this.sueloUrbano = data.results.bindings[1].urbano.value;
          this.sueloRural = data.results.bindings[1].rustico.value;
          this.dataDownload[0].sueloRural = this.sueloRural;
          this.dataDownload[0].sueloUrbano = this.sueloUrbano;
        }
      });

      this.resultSvc.getData(this.queryUrlDensidadPoblacion).subscribe((data: any) => {
        this.densidadPoblacion = (Number(data?.results.bindings[0].densidad_de_poblacion_habkm2.value)).toFixed(1);
        this.dataDownload[0].densidad = this.densidadPoblacion;
      });

      this.resultSvc.getData(this.queryUrlTotalCreativeWork).subscribe(data => {
        this.numberOfCreativeWork = data?.results.bindings.length;
      })

      this.resultSvc.getData(this.queryUrlCreativeWork).subscribe((data: any) => {
        this.creativeWork = data?.results.bindings;

        this.dataDownload[0].mencionesEnPublicaciones = this.numberOfCreativeWork;

        this.creativeWork?.forEach((element: any) => {
          let publicaciones = `Titulo: ${element.title.value}; url: ${element.url.value}; Tema: ${element.tema.value}; Abstract: ${element.resumen.value}`;
          this.dataDownload[0].creativeWorks += publicaciones;
        });

      });

      this.resultSvc.getData(this.queryUrlPoblacion).subscribe((data: any) => {
        if (this.tipoLocalidad === 'municipio') {
          ;
          this.poblacion = data?.results.bindings.find((lugar: any) => lugar.nameRefArea.value.toLowerCase() === this.lugarBuscado.replace('Zaragóza', 'Zaragoza').toLowerCase()).poblac.value;
          this.dataDownload[0].habitantes = this.poblacion;
          this.comunidadActual = data?.results.bindings[0].nameRefArea.value;

          this.tablaPoblacion = data?.results.bindings;
          for (let i = 0; i < 5; i++) {
            this.yearsTablaPoblacion.push(data?.results.bindings[i].nameRefPeriod.value);
          }
          for (let i = 5; i < 10; i++) {
            const element = this.tablaPoblacion[i].nameRefArea.value;
            this.comunidad.push(element);
          }
          for (let i = 0; i < 5; i++) {
            const element = this.tablaPoblacion[i].nameRefArea.value;
            this.provincia.push(element);
          }
          for (let i = 10; i < 15; i++) {
            const element = this.tablaPoblacion[i].nameRefArea.value;
            this.municipio.push(element);
          }
        } else if (this.tipoLocalidad === 'comarca') {
          this.poblacion = data.results.bindings[4].poblac.value;
        } else {
          this.poblacion = data.results.bindings[0].poblac.value;
        }

      });


      this.resultSvc.getData(this.queryUrlRatioSuelo).subscribe((data: any) => {
        if (data.results.bindings.length !== 0) {
          let totalUrbano = data?.results.bindings[0].urbano.value;
          let totalRural = data?.results.bindings[0].rustico.value;

          this.porcentajeSueloRural = ((this.sueloRural / totalRural) * 100).toFixed(2);
          this.porcentajeSueloUrbano = ((this.sueloUrbano / totalUrbano) * 100).toFixed(2);

          this.dataDownload[0].porcentajeSueloRural = this.porcentajeSueloRural;
          this.dataDownload[0].porcentajeSueloUrbano = this.porcentajeSueloUrbano;
        }
      });

      this.resultSvc.getData(this.queryUrlIncendios).subscribe((data: any) => {
        this.incendiosUltimosAnos = data?.results.bindings[0].incendios.value;
        this.hectareasQuemadas = data?.results.bindings[0].superficie_forestal_afectada.value;
        this.dataDownload[0].incendiosDesde2022 = this.incendiosUltimosAnos;
        this.dataDownload[0].hectareasAfectadasPorIncendios = this.hectareasQuemadas;
      });

      this.resultSvc.getData(this.queryUrlEsPoblado).subscribe((data) => {
        this.esPoblado = data?.results.bindings[0].esta.value;
        this.dataDownload[0].esDeLosMasPoblados = this.esPoblado;

      });

      this.resultSvc.getData(this.queryUrlEdadMedia).subscribe((data) => {
        if (data.results.bindings.length !== 0) {
          this.edadMediaMujeres = Number(data?.results.bindings[0].val.value).toFixed(2);
          this.edadMediaHombres = Number(data?.results.bindings[1].val.value).toFixed(2);
          this.dataDownload[0].edadMediaHombres = this.edadMediaHombres;
          this.dataDownload[0].edadMediaMujeres = this.edadMediaMujeres;
        }
      });

      this.resultSvc.getData(this.queryUrlLocales).subscribe(data => {
        ////console.log(this.queryUrlLocales);

        this.locales = data.results.bindings[0]['callret-4'].value;
      });

    });

    // DATOS ARAGOPEDIA

    this.queryTemas = "https://opendata.aragon.es/solrWIKI/informesIAEST/select?q=*&rows=2000&omitHeader=true&wt=json"

    this.resultSvc.getData(this.queryTemas).subscribe(data => {
      this.temasAragopedia = data.response.docs;
      let unique = [... new Set(data.response.docs.map((item: { Descripcion: any }) => item.Descripcion))];
      this.temasAragopedia.forEach((tema: any) => {
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

      if (this.tipoLocalidad === 'comarca') {
        this.showTemas = this.temasComarca;
        this.filteredTemas = this.showTemas;

      } else if (this.tipoLocalidad === 'municipio') {
        this.showTemas = this.temasMunicipio;
        this.filteredTemas = this.showTemas;

      } else if (this.tipoLocalidad === 'diputacion') {
        this.showTemas = this.temasProvincia
        this.filteredTemas = this.showTemas
      }

      this.showTemas.shift();
      this.initForm();
    });

  }

  //Métodos
  // capitalizeString(str: any): string {
  //   return str.replace(/\w\S*/g, function (txt: any) {
  //     for (let i = 0; i < txt.length; i++) {
  //       if (txt[i].toLowerCase() !== 'de'
  //         && txt[i].toLowerCase() !== 'del'
  //         && txt[i].toLowerCase() !== 'la'
  //         && txt[i].toLowerCase() !== 'las'
  //         && txt[i].toLowerCase() !== 'los') {
  //         return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  //       }
  //     }

  //   });
  // }

  capitalizeString(str: any): string {
    return str.replace(/\w\S*/g, function (txt: any) {
      for (let i = 0; i < txt.length; i++) {
        if (txt.toLowerCase() === 'el'
          || txt.toLowerCase() === 'y'
          || txt.toLowerCase() === 'del'
          || txt.toLowerCase() === 'de'
          || txt.toLowerCase() === 'las'
          || txt.toLowerCase() === 'los') {
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

  reduceText(text: string): string {
    const reducedText = text.substr(0, 120);
    return (
      this.leerMas ? text : reducedText
    )
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

  createNameForUrl(str: string): string {
    const nameIndex = str.lastIndexOf('/') + 1;
    return str.substring(nameIndex);
  }

  fileDownload() {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: `Ficha de ${this.lugarBuscado}`,
      useBom: true,
      noDownload: false,
      headers: ["Nombre", "Email", "Teléfono", "Dirección", "Código Postal", "Habitantes", "Suelo Rural", "Suelo Urbano", "Densidad de población", "Polígonos Industriales", "Explotaciones Ganaderas", "Plazas Hoteleras", "Incendios desde 2002", "Hectáreas afectadas", "Menciones en publicaciones", "Alojamientos Turísticos", "Imagen de portada", "Porcentaje de suelo rural con respecto Aragón", "Porcentaje de suelo urbano con respecto Aragón", "Es uno de los 20 municipios más poblados", "Edad media de los hombres", "Edad media de las mujeres", "Creative Works", "Miembros del pleno", "Personas ilustres nacidas en el municipio", "Entidades singulares"],
      eol: '\n'
    };

    new ngxCsv(this.dataDownload, `Datos de ${this.lugarBuscado}`, options);
  }


  temaSelected(tema: any) {
    let query: string = 'select distinct ?refArea ?nameRefArea ?refPeriod (strafter(str(?refPeriod), "http://reference.data.gov.uk/id/year/") AS ?nameRefPeriod) '

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

      ////console.log(query);
      ////console.log(encodeURIComponent(query));

      this.sparql(query);

      this.queryTabla = 'https://opendata.aragon.es/sparql?default-graph-uri=&query=' + encodeURIComponent(query) + '&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';

      this.aragopediaSvc.change(this.queryTabla);
    })

  }

  filterData(enteredData: any) {
    this.filteredTemas = this.showTemas.filter((item: any) => {

      ////console.log(item);
      return item.DescripcionMejorada.toLowerCase().indexOf(enteredData.toLowerCase()) > -1
    })
    ////console.log(this.showTemas);
  }




  initForm() {
    this.formGroup = this.fb.group({
      "tema": [this.selectedTema]
    })

    this.formGroup.get('tema')?.valueChanges.subscribe(response => {
      ////console.log(response);
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
      //console.log(data);

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
