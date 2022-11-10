import { Component } from '@angular/core';
import { ResultService } from './result.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})

export class ResultComponent {
  map: string = 'https://idearagon.aragon.es/Visor2D?service=WMS&version=1.1.0&request=GetMap&layers=VISOR2D%3ALimAragon,VISOR2D%3AMunicipio_t2m&bbox=569192.3553%2C4412927.4576%2C810631.1337%2C4754878.6523&width=271&height=384&srs=EPSG%3A25830&format=image/png&CQL_FILTER=1=1;c_muni_ine=44001';

  constructor(public resultSvc: ResultService, private _route: ActivatedRoute) { }

  poblacion: any;
  comunidadActual: any;
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
  miembrosPleno: any;
  alojamientosTuristicos: any;
  oficinasTurismo: any;
  comunidad: string[] = [];
  provincia: string[] = [];
  municipio: string[] = [];
  porcentajeSueloUrbano: any;
  porcentajeSueloRural: any;
  densidadPoblacion: any
  lugarBuscado: any;

  //Queries variables
  queryUrlDensidadPoblacion!: string;
  queryUrlSueloUrbano!: string;
  queryUrlPoblacion!: string;
  queryUrlPoligonos!: string;
  queryUrlContacto!: string;
  queryUrlCreativeWork!: string;
  queryUrlMiembrosPleno!: string;
  queryUrlAlojamientosTuristicos!: string;
  queryUrlRatioSuelo!: string;


  ngOnInit() {

    this.lugarBuscado = this.capitalizeString(this._route.snapshot.paramMap.get('municipio'));

    //Queries URLs

    this.queryUrlDensidadPoblacion = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FrefArea+%3FnameRefArea+%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F%22%29+AS+%3FnameRefPeriod%29++%3Fdensidad_de_poblacion_habkm2+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++FILTER%28%3Fdataset+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F02-020001TM%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+FILTER+%28%3FrefPeriod+IN+%28%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2016%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2017%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2018%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2019%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2020%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2021%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+%0D%0A+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0A+BIND+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FMunicipio%2F${this.lugarBuscado}%3E+AS+%3Fmuni%29.%0D%0A+FILTER+%28%3FrefArea+IN+%28%3Fmuni%29%29.%0D%0AOPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23densidad-de-poblacion-habkm2%3E+%3Fdensidad_de_poblacion_habkm2++%7D+.%0D%0A%7D%0D%0Aorder+by++desc%28%3FrefPeriod%29%0D%0ALIMIT+1%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

    this.queryUrlSueloUrbano = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+xsd%3Aint%28%3Frust%29+as+%3Frustico+xsd%3Aint%28%3Furba%29+as+%3Furbano+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++FILTER%28%3Fdataset+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019A%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019TC%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019TM%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+FILTER+%28%3FrefPeriod+IN+%28%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2018%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2019%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2020%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2021%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+%0D%0A+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0A+BIND+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FMunicipio%2F${this.lugarBuscado}%3E+AS+%3Fmuni%29.%0D%0A+%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComarca%3E+%3Fcomarca.%0D%0A+%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComunidadAutonoma%3E+%3Fccaa.%0D%0A+FILTER+%28%3FrefArea+IN+%28%3Fmuni%2C+%3Fccaa%29%29.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23rustico-superficie%3E+%3Frust++%7D+.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23urbano-superficie%3E+%3Furba++%7D+.%0D%0A%7D%0D%0AORDER+BY+desc%28%3FrefPeriod%29%2C%3FrefArea%0D%0ALIMIT+2%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

    this.queryUrlPoblacion = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FrefArea+%3FnameRefArea+%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F%22%29+AS+%3FnameRefPeriod%29+xsd%3Aint%28%3Fpoblacion%29+as+%3Fpoblac+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++FILTER%28%3Fdataset+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001A%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001TC%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001TM%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+FILTER+%28%3FrefPeriod+IN+%28%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2017%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2018%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2019%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2020%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2021%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+%0D%0A+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0A+BIND+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FMunicipio%2F${this.lugarBuscado}%3E+AS+%3Fmuni%29.%0D%0A+%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComarca%3E+%3Fcomarca.%0D%0A+%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComunidadAutonoma%3E+%3Fccaa.%0D%0A+FILTER+%28%3FrefArea+IN+%28%3Fmuni%2C+%3Fcomarca%2C+%3Fccaa%29%29.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23poblacion%3E+%3Fpoblacion++%7D+.%0D%0A%7D%0D%0AORDER+BY+%3FrefArea%2C+desc%28%3FrefPeriod%29%0D%0ALIMIT+15%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

    this.queryUrlPoligonos = 'https://opendata.aragon.es/sparql?default-graph-uri=http%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2&query=select++distinct+count%28%3Fs%29+where+%7B%0D%0A%3Fs+%3Fp+%3Fo%3B%0D%0A++++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23linkedTo%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fmunicipio%2F22048%3E%3B%0D%0A++++ns%3AwasUsedBy+%3Fproc.%0D%0A%3Fproc+ns%3AwasAssociatedWith+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F104%3E.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';

    this.queryUrlContacto = 'https://opendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0D%0APREFIX+ns%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fprov%23%3E%0D%0APREFIX+vcard%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23%3E%0D%0A%0D%0ASELECT+%3Femail+%3Ftel+%3Ffax+%3Fdireccion+%3FcodPostal+%0D%0AFROM+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E%0D%0AWHERE+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fmunicipio%2F50001%3E+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23hasSite%3E+%3FsiteAddress%3B%0D%0A+++++++ns%3AwasUsedBy+%3Fprocedencia.+%0D%0A++++++%3Fprocedencia+ns%3AwasAssociatedWith+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F11%3E.+%0D%0A%0D%0A++%3FsiteAddress+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23siteAddress%3E+%3Faddress2.%0D%0A%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Aemail+%3Femail+%7D.%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Atel+%3Ftel+%7D.%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Afax+%3Ffax+%7D.%0D%0A++OPTIONAL+%7B%3Faddress2+vcard%3Astreet-address%3Fdireccion+%7D.%0D%0A+++OPTIONAL+%7B%3Faddress2+vcard%3Apostal-code+%3FcodPostal+%7D.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';

    this.queryUrlCreativeWork = `https://opendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+schema%3A+%3Chttp%3A%2F%2Fschema.org%2F%3E%0D%0A%0D%0Aselect+%3Ftitle+%3Furl+%3Ftema+%3Fresumen%0D%0Awhere+%7B%0D%0A++%3Fs+a+schema%3ACreativeWork%3B%0D%0A+++++++schema%3Aabout+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FMunicipio%2F${this.lugarBuscado}%3E%3B%0D%0A+++++++schema%3Atitle+%3Ftitle%3B%0D%0A+++++++schema%3Aurl+%3Furl%3B%0D%0A+++++++schema%3Aconcept+%3Ftema%3B%0D%0Aschema%3Aabstract+%3Fresumen.%0D%0A%7D%0D%0Alimit+10&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;


    this.queryUrlMiembrosPleno = 'https://opendata.aragon.es/sparql?default-graph-uri=http%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2&query=select++distinct+%3Fpersona+%3Fcargo+%3FnombrePersona+where+%7B%0D%0A%3Fpuesto+%3Fp+%3Fo%3B%0D%0A+++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23role%3E+%3Frol%3B%0D%0A+++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23postIn%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fmunicipio%2F22048%3E%3B%0D%0A++++ns%3AwasUsedBy+%3Fproc.%0D%0A%3Frol+dc%3Atitle+%3Fcargo.%0D%0A%3Fpersona+++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23holds%3E+%3Fpuesto.%0D%0AOPTIONAL+%7B+%3Fpersona+%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2Fname%3E+%3FnombrePersona.+%7D%0D%0A%3Fproc+ns%3AwasAssociatedWith+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F3%3E.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';

    this.queryUrlAlojamientosTuristicos = `https://opendata.aragon.es/sparql?default-graph-uri=http%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2&query=select++distinct+count%28%3Fs%29+where+%7B%0D%0A%3Fs+%3Fp+%3Fo%3B%0D%0A++++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23linkedTo%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fmunicipio%2F44001%3E%3B%0D%0A++++ns%3AwasUsedBy+%3Fproc.%0D%0A%3Fproc+ns%3AwasAssociatedWith+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F73%3E.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

    this.queryUrlRatioSuelo = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FrefArea+%3FnameRefArea+%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F%22%29+AS+%3FnameRefPeriod%29+xsd%3Aint%28%3Frust%29+as+%3Frustico+xsd%3Aint%28%3Furba%29+as+%3Furbano+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++FILTER%28%3Fdataset+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019A%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019TC%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019TM%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+FILTER+%28%3FrefPeriod+IN+%28%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2018%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2019%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2020%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2021%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+%0D%0A+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0A+BIND+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FMunicipio%2F${this.lugarBuscado}%3E+AS+%3Fmuni%29.%0D%0A+%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComarca%3E+%3Fcomarca.%0D%0A+%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComunidadAutonoma%3E+%3Fccaa.%0D%0A+FILTER+%28%3FrefArea+IN+%28%3Fmuni%2C+%3Fccaa%29%29.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23rustico-superficie%3E+%3Frust++%7D+.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23urbano-superficie%3E+%3Furba++%7D+.%0D%0A%7D%0D%0AORDER+BY+desc%28%3FrefPeriod%29%2C%3FrefArea%0D%0ALIMIT+2%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

    this.resultSvc.getSueloUrbanoData(this.queryUrlSueloUrbano).subscribe((data: any) => {
      this.sueloUrbano = data.results.bindings[1].urbano.value
      this.sueloRural = data.results.bindings[1].rustico.value
    });

    this.resultSvc.getDensidadData(this.queryUrlDensidadPoblacion).subscribe((data: any) => {
      this.densidadPoblacion = (Number(data.results.bindings[0].densidad_de_poblacion_habkm2.value)).toFixed(1);
    });

    this.resultSvc.getPoligonos(this.queryUrlPoligonos).subscribe((data: any) => {
      this.poligonos = data.results.bindings[0]['callret-0'].value;
    });

    this.resultSvc.getDatosContacto(this.queryUrlContacto).subscribe((data) => {
      this.email = data.results.bindings[0].email.value;
      this.telefono = data.results.bindings[0].tel.value;
      this.direccion = data.results.bindings[0].direccion.value.toLowerCase();
      this.codPostal = data.results.bindings[0].codPostal.value;
    });

    this.resultSvc.getCreativeWorkd(this.queryUrlCreativeWork).subscribe((data) => {
      this.creativeWork = data.results.bindings;
      console.log(this.creativeWork);

    });

    this.resultSvc.getMiembrosPleno(this.queryUrlMiembrosPleno).subscribe((data) => {
      this.miembrosPleno = data.results.bindings;
    });

    this.resultSvc.getAlojamientosTuristicos(this.queryUrlAlojamientosTuristicos).subscribe((data) => {
      this.alojamientosTuristicos = data.results.bindings[0]['callret-0'].value;
    });

    this.resultSvc.getOficinasTurismo(this.queryUrlAlojamientosTuristicos).subscribe((data) => {
      this.oficinasTurismo = data.results.bindings[0]['callret-0'].value;
    });

    this.resultSvc.getPoblacionData(this.queryUrlPoblacion).subscribe((data: any) => {
      this.poblacion = data.results.bindings.find((lugar: any) => lugar.nameRefArea.value === this.lugarBuscado).poblac.value;
      this.comunidadActual = data.results.bindings[0].nameRefArea.value;
      console.log(this.comunidadActual);

      this.tablaPoblacion = data.results.bindings;
      for (let i = 0; i < 5; i++) {
        this.yearsTablaPoblacion.push(data.results.bindings[i].nameRefPeriod.value);
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
    });


    this.resultSvc.getRatioSuelo(this.queryUrlRatioSuelo).subscribe((data) => {
      let totalUrbano = data.results.bindings[0].urbano.value;
      let totalRural = data.results.bindings[0].rustico.value;
      this.porcentajeSueloRural = ((this.sueloRural / totalRural) * 100).toFixed(2);
      this.porcentajeSueloUrbano = ((this.sueloUrbano / totalUrbano) * 100).toFixed(2);
    });

  }

  //Métodos
  capitalizeString(str: any): string {
    return str.replace(/\w\S*/g, function (txt: any) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

}
