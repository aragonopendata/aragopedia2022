import { Component, OnInit } from '@angular/core';
import { ngxCsv } from 'ngx-csv';
import { ResultService } from '../result.service';

@Component({
  selector: 'app-ficha-aragon',
  templateUrl: './ficha-aragon.component.html',
  styleUrls: ['../result.component.scss']
})
export class FichaAragonComponent implements OnInit {

  constructor(public resultSvc: ResultService) { }

  temp = undefined;

  lugarBuscado: any;
  lugarBuscadoParsed!: string;
  idLocalidad: any;
  tipoLocalidad!: string;
  comunidadActual: any;
  poblacion: any;
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
  explotacionesGanaderas!: string;
  plazasHoteleras!: string;
  codigoIne: any;
  leerMas: boolean = false;
  personasIlustres: any;
  cantidadPersonasIlustres!: number;


  //Queries variables
  queryIdWikiData!: string;
  queryImageWikiData!: string;
  queryUrlDensidadPoblacion!: string;
  queryUrlExtension!: string;
  queryUrlPoblacion!: string;
  queryUrlPoligonos!: string;
  queryUrlCreativeWork!: string;
  queryUrlAlojamientosTuristicos!: string;
  queryUrlRatioSuelo!: string;
  queryUrlIncendios!: string;
  queryUrlEdadMedia!: string;
  queryUrlExplotacionesGanaderas!: string;
  queryUrlPlazasHoteleras!: string;
  queryUrlGetCodigoIne!: string;
  queryUrlPersonasIlustres!: string;
  queryNombresIne!: string;

  // Download data

  dataDownload = this.temp || [{ nombre: '', email: '', telefono: '', direccion: '', codigoPostal: '', habitantes: '', sueloRural: '', sueloUrbano: '', densidad: '', poligonosIndustriales: '', explotacionesGanaderas: '', plazasHoteleras: '', incendiosDesde2022: '', hectareasAfectadasPorIncendios: '', mencionesEnPublicaciones: '', alojamientosTuristicos: '', urlImagen: '', porcentajeSueloRural: '', porcentajeSueloUrbano: '', esDeLosMasPoblados: '', edadMediaHombres: '', edadMediaMujeres: '', creativeWorks: '', miembrosPleno: '', personasIlustres: '', entidadesSingulares: '' }];



  ngOnInit() {

    //Query id-localidades-tipo
    this.queryIdWikiData = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+%3Fs+str%28%3Fnombre%29+%3Fid+%3Fclasif%0D%0Awhere++%7B%0D%0A++++++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23classification%3E+%3Fclasif.+%0D%0A++++++%3Fs+dc%3Aidentifier+%3Fid.+%0D%0A+++++%3Fs+dc%3Atitle+%3Fnombre.%0D%0A+++++VALUES+%3Fclasif+%7B%3Chttps%3A%2F%2Fwww.geonames.org%2Fontology%23A.ADM2%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fkos%2Fcomarca%3E+%3Chttps%3A%2F%2Fwww.geonames.org%2Fontology%23P.PPL%3E%7D%0D%0A%7D%0D%0Aorder+by+asc%28%3Fclasif%29+%3Fid+%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

    //Sacamos el nombre del municipio a través del codigo INE
    this.codigoIne = '2';
    this.queryNombresIne = `https://opendata.aragon.es/sparql?default-graph-uri=&query=prefix+dbpedia%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2F%3E+%0D%0Aprefix+org%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23%3E%0D%0Aprefix+aragopedia%3A+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23%3E%0D%0A%0D%0Aselect+%3Fnombre+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E++where+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fcomunidad%2F${this.codigoIne}%3E+dc%3Atitle+%3Fnombre%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

    //Obtenemos id y tipo de localidad antes de nada

    this.resultSvc.getData(this.queryIdWikiData).subscribe((data: any) => {
      // const found = data.results.bindings.find((element: any) => this.capitalizeString(element['callret-1'].value) == this.lugarBuscado);
      // console.log(data.results.bindings.find((element: any) => {
      //   element['callret-1'].value.toUpperCase() === this.lugarBuscado.toUpperCase();
      // }))
      // console.log(found);

      // this.codigoIne = found.id.value;

      // const urlAnalizada = found.s.value.split('/');
      // this.tipoLocalidad = urlAnalizada[6];

      if (this.codigoIne !== undefined) {

        //Queries con ID
        this.map = `https://idearagon.aragon.es/geoserver/VISOR2D/wms?service=WMS&version=1.1.0&request=GetMap&layers=VISOR2D%3ALimAragon&bbox=569192.3553%2C4412927.4576%2C810631.1337%2C4754878.6523&width=271&height=384&srs=EPSG%3A25830&format=image/png`;

        this.urlMap = `https://idearagon.aragon.es/visor/index.html`

        this.queryUrlPoligonos = `https://opendata.aragon.es/sparql?default-graph-uri=http%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2&query=select++distinct+count%28%3Fs%29+where+%7B%0D%0A%3Fs+%3Fp+%3Fo%3B%0D%0A++++ns%3AwasUsedBy+%3Fproc.%0D%0A%3Fproc+ns%3AwasAssociatedWith+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F104%3E.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

        this.queryUrlAlojamientosTuristicos = `https://opendata.aragon.es/sparql?default-graph-uri=http%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2&query=select++distinct+count%28%3Fs%29+where+%7B%0D%0A%3Fs+%3Fp+%3Fo%3B%0D%0A++++%0D%0A++++ns%3AwasUsedBy+%3Fproc.%0D%0A%3Fproc+ns%3AwasAssociatedWith+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F73%3E.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

        this.queryUrlExplotacionesGanaderas = `https://opendata.aragon.es/sparql?default-graph-uri=http%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2&query=select+count%28distinct%28%3Fs%29%29+%3Fx+where+%7B%0D%0A%3Fs+%3Fx+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fcomunidad%2F${this.codigoIne}%3E%3B%0D%0A++++ns%3AwasUsedBy+%3Fproc.%0D%0A%3Fproc+ns%3AwasAssociatedWith+%3Fvista.%0D%0A++FILTER%28%3Fvista+IN+%28%0D%0A+++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F294%3E%2C%0D%0A+++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F295%3E%2C%0D%0A+++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F296%3E%2C%0D%0A+++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F297%3E%2C%0D%0A+++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F298%3E%2C%0D%0A+++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F299%3E%2C%0D%0A+++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F300%3E%2C%0D%0A+++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F301%3E%2C%0D%0A+++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F302%3E%2C%0D%0A+++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F303%3E%0D%0A++%29%29.%0D%0A+FILTER+%28%3Fx++IN+%28%0D%0A++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fdimensionproperty%2Fexplotaciones-ganaderas-apicola-dimension%2F5%3E%2C%0D%0A++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fdimensionproperty%2Fexplotaciones-ganaderas-ovino-dimension%2F5%3E%2C%0D%0A++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fdimensionproperty%2Fexplotaciones-ganaderas-porcino-dimension%2F5%3E%2C%0D%0A++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fdimensionproperty%2Fexplotaciones-ganaderas-cunicola-dimension%2F5%3E%2C%0D%0A++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fdimensionproperty%2Fexplotaciones-ganaderas-bovino-dimension%2F5%3E%2C%0D%0A++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fdimensionproperty%2Fexplotaciones-ganaderas-avicola-dimension%2F5%3E%2C%0D%0A++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fdimensionproperty%2Fexplotaciones-ganaderas-otras-dimension%2F5%3E%2C%0D%0A++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fdimensionproperty%2Fexplotaciones-ganaderas-nucleos-zoologicos-dimension%2F5%3E%2C%0D%0A++++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fdimensionproperty%2Fexplotaciones-ganaderas-equido-dimension%2F5%3E%0D%0A%29%29.%0D%0A%7D%0D%0Alimit+100&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

        this.queryUrlPlazasHoteleras = `https://opendata.aragon.es/sparql?default-graph-uri=http%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2&query=select++distinct+count%28%3Fs%29+where+%7B%0D%0A%3Fs+%3Fp+%3Fo%3B%0D%0A++++ns%3AwasUsedBy+%3Fproc.%0D%0A%3Fproc+ns%3AwasAssociatedWith+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdatos%2Fcatalogo%2Fdataset%2Fga-od-core%2F65%3E.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

        this.queryUrlGetCodigoIne = `https://opendata.aragon.es/sparql?default-graph-uri=http%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2&query=select+%3Fwikidata+%3Faragopedia+where+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fcomunidad%2F${this.codigoIne}%3E+skos%3AexactMatch+%3Fwikidata%3B%0D%0A+++owl%3AsameAs+%3Faragopedia.%0D%0A++FILTER%28regex%28%3Fwikidata%2C+%22http%3A%2F%2Fwww.wikidata.org%2F%22%29%29.%0D%0A++FILTER%28regex%28%3Faragopedia%2C+%22http%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FComunidadAutonoma%2F%22%29%29.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

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
          this.explotacionesGanaderas = data.results.bindings[0]['callret-0'].value;
          this.dataDownload[0].explotacionesGanaderas = this.explotacionesGanaderas;
        });

        this.resultSvc.getData(this.queryUrlPlazasHoteleras).subscribe((data) => {
          this.plazasHoteleras = data.results.bindings[0]['callret-0'].value;
          this.dataDownload[0].plazasHoteleras = this.plazasHoteleras;
        });

        this.resultSvc.getData(this.queryUrlGetCodigoIne).subscribe((data) => {
          const urlAnalizada = data.results.bindings[0].wikidata.value;
          this.idLocalidad = urlAnalizada.split('/')[4];

          this.queryImageWikiData = `https://query.wikidata.org/sparql?query=%0Aselect%20%3Fimg%20where%20%7B%20wd%3A${this.idLocalidad}%20wdt%3AP18%20%3Fimg%20%7D`;

          this.queryUrlPersonasIlustres = `https://query.wikidata.org/sparql?query=SELECT%20%3Fitem%20%3FitemLabel%20%3Fabout%20(count(%3Fx)%20as%20%3Fcont)%0AWHERE%20%0A%7B%0A%20%20%3Fitem%20wdt%3AP19%20wd%3A${this.idLocalidad}.%0A%20%20%3Fitem%20%3Fx%20%20%3Fo.%0A%20%20%3Fabout%20schema%3Aabout%20%3Fitem.%0A%20%20%3Fabout%20schema%3AinLanguage%20%22es%22.%0A%20%20%3Fabout%20schema%3AisPartOf%20%3Chttps%3A%2F%2Fes.wikipedia.org%2F%3E.%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22es%2Cen%22.%20%7D%0A%7D%0Agroup%20by%20%3Fitem%20%3FitemLabel%20%3Fabout%0Aorder%20by%20desc(%3Fcont)`;

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

      }

    });


    //Queries URLs NOMBRE MUNICIPIO

    this.resultSvc.getData(this.queryNombresIne).subscribe(data => {
      this.lugarBuscado = 'Aragón';
      this.dataDownload[0].nombre = this.lugarBuscado;
      this.lugarBuscadoParsed = 'Ababuj';


      // Queries con nombres

      this.queryUrlDensidadPoblacion = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FrefArea+%3FnameRefArea+%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F%22%29+AS+%3FnameRefPeriod%29++%3Fdensidad_de_poblacion_habkm2+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++FILTER%28%3Fdataset+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F02-020001A%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+FILTER+%28%3FrefPeriod+IN+%28%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2016%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2017%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2018%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2019%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2020%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2021%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+%0D%0A+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0A+BIND+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FComunidad%2FAragón%3E+AS+%3Fmuni%29.%0D%0A+FILTER+%28%3FrefArea+IN+%28%3Fmuni%29%29.%0D%0AOPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23densidad-de-poblacion-habkm2%3E+%3Fdensidad_de_poblacion_habkm2++%7D+.%0D%0A%7D%0D%0Aorder+by++desc%28%3FrefPeriod%29%0D%0ALIMIT+1%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

      this.queryUrlExtension = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+xsd%3Aint%28%3Frust%29+as+%3Frustico+xsd%3Aint%28%3Furba%29+as+%3Furbano+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++FILTER%28%3Fdataset+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019A%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019TC%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019TM%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+FILTER+%28%3FrefPeriod+IN+%28%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2018%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2019%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2020%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2021%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+%0D%0A+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0A+BIND+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FMunicipio%2F${this.lugarBuscadoParsed}%3E+AS+%3Fmuni%29.%0D%0A+%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComarca%3E+%3Fcomarca.%0D%0A+%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComunidadAutonoma%3E+%3Fccaa.%0D%0A+FILTER+%28%3FrefArea+IN+%28%3Fmuni%2C+%3Fccaa%29%29.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23rustico-superficie%3E+%3Frust++%7D+.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23urbano-superficie%3E+%3Furba++%7D+.%0D%0A%7D%0D%0AORDER+BY+desc%28%3FrefPeriod%29%2C%3FrefArea%0D%0ALIMIT+2%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

      this.queryUrlPoblacion = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FrefArea+%3FnameRefArea+%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F%22%29+AS+%3FnameRefPeriod%29+xsd%3Aint%28%3Fpoblacion%29+as+%3Fpoblac+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++FILTER%28%3Fdataset+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001A%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001TC%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030001TM%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+FILTER+%28%3FrefPeriod+IN+%28%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2017%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2018%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2019%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2020%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2021%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+%0D%0A+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0A+BIND+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FMunicipio%2F${this.lugarBuscadoParsed}%3E+AS+%3Fmuni%29.%0D%0A+%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComarca%3E+%3Fcomarca.%0D%0A+%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComunidadAutonoma%3E+%3Fccaa.%0D%0A+FILTER+%28%3FrefArea+IN+%28%3Fmuni%2C+%3Fcomarca%2C+%3Fccaa%29%29.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23poblacion%3E+%3Fpoblacion++%7D+.%0D%0A%7D%0D%0AORDER+BY+%3FrefArea%2C+desc%28%3FrefPeriod%29%0D%0ALIMIT+15%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

      this.queryUrlCreativeWork = `https://opendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+schema%3A+%3Chttp%3A%2F%2Fschema.org%2F%3E%0D%0A%0D%0Aselect+%3Ftitle+%3Furl+%3Ftema+%3Fresumen%0D%0Awhere+%7B%0D%0A++%3Fs+a+schema%3ACreativeWork%3B%0D%0A+++++++schema%3Aabout+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FComunidadAutonoma%2FArag%C3%B3n%3E%3B%0D%0A+++++++schema%3Atitle+%3Ftitle%3B%0D%0A+++++++schema%3Aurl+%3Furl%3B%0D%0A+++++++schema%3Aconcept+%3Ftema%3B%0D%0Aschema%3Aabstract+%3Fresumen.%0D%0A%7D%0D%0Alimit+10&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

      this.queryUrlRatioSuelo = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FrefArea+%3FnameRefArea+%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F%22%29+AS+%3FnameRefPeriod%29+xsd%3Aint%28%3Frust%29+as+%3Frustico+xsd%3Aint%28%3Furba%29+as+%3Furbano+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++FILTER%28%3Fdataset+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019A%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019TC%3E%2C%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F01-010019TM%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+FILTER+%28%3FrefPeriod+IN+%28%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2018%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2019%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2020%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2021%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+%0D%0A+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0A+BIND+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FMunicipio%2F${this.lugarBuscadoParsed}%3E+AS+%3Fmuni%29.%0D%0A+%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComarca%3E+%3Fcomarca.%0D%0A+%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComunidadAutonoma%3E+%3Fccaa.%0D%0A+FILTER+%28%3FrefArea+IN+%28%3Fmuni%2C+%3Fccaa%29%29.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23rustico-superficie%3E+%3Frust++%7D+.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23urbano-superficie%3E+%3Furba++%7D+.%0D%0A%7D%0D%0AORDER+BY+desc%28%3FrefPeriod%29%2C%3FrefArea%0D%0ALIMIT+2%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

      this.queryUrlIncendios = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct++%3FrefArea+%3FnameRefArea+sum+%28%3Fincendios+%29+as+%3Fincendios+++sum+%28xsd%3Adouble%28%3Fsuperficie_forestal_afectada%29+%29+as+%3Fsuperficie_forestal_afectada+++%0D%0A+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++FILTER%28%3Fdataset+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F04-040017A%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0AFILTER+%28%3FrefPeriod+IN+%28%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2001%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2002%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2003%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2004%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2005%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2006%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2007%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2008%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2009%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2010%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2011%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2012%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2013%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2014%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2015%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2016%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2017%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2018%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2019%3E%2C%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2020%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+%0D%0A+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0A%0D%0AOPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23incendios%3E+%3Fincendios++%7D+.%0D%0AOPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23superficie-forestal-afectada%3E+%3Fsuperficie_forestal_afectada++%7D+.%0D%0A%7D%0D%0Agroup+by+++%3FrefArea+%3FnameRefArea%0D%0ALIMIT+20%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

      this.queryUrlEdadMedia = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3Fobs+%3FrefArea+%3FnameRefArea+%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F%22%29+AS+%3FnameRefPeriod%29+xsd%3Afloat%28%3Fvalor%29+as+%3Fval+%3Fsexo+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A++%7B+select+distinct+%3FrefPeriod+where+%7B%0D%0A+++++++++++++++++++++++++++++++++++++++++++++++++++%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030006A%3E.%0D%0A++++++++++++++++++++++++++++++++++++++++++++++++++++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+++++++++++++++++++++++++++++++++++++++++++++%7D%0D%0A+++++++++++++++++++++++++++++++++++++++++++++ORDER+BY+desc%28%3FrefPeriod%29%0D%0A+++++++++++++++++++++++++++++++++++++++++++++LIMIT+1++%7D%0D%0A%0D%0A+++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+++%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+%0D%0AVALUES+%3Fdataset+%7B+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030006A%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030006TC%3E++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030006A%3E%7D%0D%0A+++FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0A%0D%0A+++%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComarca%3E+%3Fcomarca.%0D%0A+++%3Fmuni2+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComarca%3E+%3Fcomarca.%0D%0A+++%3Fmuni+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23enComunidadAutonoma%3E+%3Fccaa.%0D%0A+++FILTER+%28%3FrefArea+IN+%28%3Fmuni%2C+%3Fcomarca%2C+%3Fccaa%29%29.%0D%0A%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fdimension%23sexo%3E+%3Ffoo1.%0D%0A+%3Ffoo1+skos%3AprefLabel+%3Fsexo++.%0D%0A+++OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23edad-media-de-la-poblacion%3E+%3Fvalor++%7D+.%0D%0A%7D%0D%0AORDER+BY+desc%28%3FrefPeriod%29%2C+desc%28%3Fval%29%2C+%3FrefArea%2C+%3Fsexo%0D%0ALIMIT+100%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`


      //Obtención de datos NOMBRE MUNICIPIO

      this.resultSvc.getData(this.queryUrlExtension).subscribe((data: any) => {
        this.sueloUrbano = data.results.bindings[0].urbano.value;
        this.sueloRural = data.results.bindings[0].rustico.value;
        this.dataDownload[0].sueloRural = this.sueloRural;
        this.dataDownload[0].sueloUrbano = this.sueloUrbano;
      });

      this.resultSvc.getData(this.queryUrlDensidadPoblacion).subscribe((data: any) => {
        this.densidadPoblacion = (Number(data.results.bindings[0].densidad_de_poblacion_habkm2.value)).toFixed(1);
        this.dataDownload[0].densidad = this.densidadPoblacion;
      });

      this.resultSvc.getData(this.queryUrlCreativeWork).subscribe((data: any) => {
        this.creativeWork = data.results.bindings;
        this.numberOfCreativeWork = data.results.bindings.length;
        this.dataDownload[0].mencionesEnPublicaciones = this.numberOfCreativeWork;

        this.creativeWork.forEach((element: any) => {
          let publicaciones = `Titulo: ${element.title.value}; url: ${element.url.value}; Tema: ${element.tema.value}; Abstract: ${element.resumen.value}`;
          this.dataDownload[0].creativeWorks += publicaciones;
        });

      });

      this.resultSvc.getData(this.queryUrlPoblacion).subscribe((data: any) => {
        this.poblacion = data.results.bindings.find((lugar: any) => lugar.nameRefArea.value === this.lugarBuscado).poblac.value;
        this.dataDownload[0].habitantes = this.poblacion;

        this.comunidadActual = data.results.bindings[0].nameRefArea.value;

        this.tablaPoblacion = data.results.bindings;
        for (let i = 0; i < 5; i++) {
          this.yearsTablaPoblacion.push(data.results.bindings[i].nameRefPeriod.value);
        }
        for (let i = 5; i < 10; i++) {
          const element = this.tablaPoblacion[i].nameRefArea.value;
          this.comunidad.push(element);
        }
      });


      this.resultSvc.getData(this.queryUrlRatioSuelo).subscribe((data: any) => {

        let totalUrbano = data.results.bindings[0].urbano.value;
        let totalRural = data.results.bindings[0].rustico.value;

        this.porcentajeSueloRural = ((this.sueloRural / totalRural) * 100).toFixed(2);
        this.porcentajeSueloUrbano = ((this.sueloUrbano / totalUrbano) * 100).toFixed(2);

        this.dataDownload[0].porcentajeSueloRural = this.porcentajeSueloRural;
        this.dataDownload[0].porcentajeSueloUrbano = this.porcentajeSueloUrbano;
      });

      this.resultSvc.getData(this.queryUrlIncendios).subscribe((data: any) => {
        this.incendiosUltimosAnos = data.results.bindings[0].incendios.value;
        this.hectareasQuemadas = data.results.bindings[0].superficie_forestal_afectada.value;
        this.dataDownload[0].incendiosDesde2022 = this.incendiosUltimosAnos;
        this.dataDownload[0].hectareasAfectadasPorIncendios = this.hectareasQuemadas;
      });

      this.resultSvc.getData(this.queryUrlEdadMedia).subscribe((data) => {
        this.edadMediaMujeres = Number(data.results.bindings[0].val.value).toFixed(2);
        this.edadMediaHombres = Number(data.results.bindings[1].val.value).toFixed(2);
        this.dataDownload[0].edadMediaHombres = this.edadMediaHombres;
        this.dataDownload[0].edadMediaMujeres = this.edadMediaMujeres;
      })
    });



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

  reduceText(text: string): string {
    const reducedText = text.substr(0, 120);
    return (
      this.leerMas ? text : reducedText
    )
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

}
