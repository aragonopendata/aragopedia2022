import { Component, OnInit } from '@angular/core';
import { PiramidePoblacionService } from './piramide-poblacion.service.spec';
import { ItemPiramide } from './itemPiramide';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-piramide-poblacion',
  templateUrl: './piramide-poblacion.component.html',
  styleUrls: ['./piramide-poblacion.component.scss']
})
export class PiramidePoblacionComponent implements OnInit {

  constructor(public piramidePoblacionSvc: PiramidePoblacionService, private _route: ActivatedRoute) { }

  max: number = 1;
  piramidePoblacion: any;
  queryPiramidePoblacion!: string;
  lugarBuscado!: string;
  lugarBuscadoParsed!: string;
  tipoLocalidad!: string;
  sufijoCuboDatos!: string;
  codigoIne!: string;
  queryNombresIne!: string;
  linkToQuery!: string;
  yearPiramide!: string;
  piramideHombres: Array<ItemPiramide> = [

    { sexo: "Hombres", personas: 0, grupo: "95 y más" },
    { sexo: "Hombres", personas: 0, grupo: "90 a 94" },
    { sexo: "Hombres", personas: 0, grupo: "85 a 89" },
    { sexo: "Hombres", personas: 0, grupo: "80 a 84" },
    { sexo: "Hombres", personas: 0, grupo: "75 a 79" },
    { sexo: "Hombres", personas: 0, grupo: "70 a 74" },
    { sexo: "Hombres", personas: 0, grupo: "65 a 69" },
    { sexo: "Hombres", personas: 0, grupo: "60 a 64" },
    { sexo: "Hombres", personas: 0, grupo: "55 a 59" },
    { sexo: "Hombres", personas: 0, grupo: "50 a 54" },
    { sexo: "Hombres", personas: 0, grupo: "45 a 49" },
    { sexo: "Hombres", personas: 0, grupo: "40 a 44" },
    { sexo: "Hombres", personas: 0, grupo: "35 a 39" },
    { sexo: "Hombres", personas: 0, grupo: "30 a 34" },
    { sexo: "Hombres", personas: 0, grupo: "25 a 29" },
    { sexo: "Hombres", personas: 0, grupo: "20 a 24" },
    { sexo: "Hombres", personas: 0, grupo: "15 a 19" },
    { sexo: "Hombres", personas: 0, grupo: "10 a 14" },
    { sexo: "Hombres", personas: 0, grupo: "05 a 09" },
    { sexo: "Hombres", personas: 0, grupo: "00 a 04" },
  ];

  piramideMujeres: Array<ItemPiramide> = [
    { sexo: "Mujeres", personas: 0, grupo: "95 y más" },
    { sexo: "Mujeres", personas: 0, grupo: "90 a 94" },
    { sexo: "Mujeres", personas: 0, grupo: "85 a 89" },
    { sexo: "Mujeres", personas: 0, grupo: "80 a 84" },
    { sexo: "Mujeres", personas: 0, grupo: "75 a 79" },
    { sexo: "Mujeres", personas: 0, grupo: "70 a 74" },
    { sexo: "Mujeres", personas: 0, grupo: "65 a 69" },
    { sexo: "Mujeres", personas: 0, grupo: "60 a 64" },
    { sexo: "Mujeres", personas: 0, grupo: "55 a 59" },
    { sexo: "Mujeres", personas: 0, grupo: "50 a 54" },
    { sexo: "Mujeres", personas: 0, grupo: "45 a 49" },
    { sexo: "Mujeres", personas: 0, grupo: "40 a 44" },
    { sexo: "Mujeres", personas: 0, grupo: "35 a 39" },
    { sexo: "Mujeres", personas: 0, grupo: "30 a 34" },
    { sexo: "Mujeres", personas: 0, grupo: "25 a 29" },
    { sexo: "Mujeres", personas: 0, grupo: "20 a 24" },
    { sexo: "Mujeres", personas: 0, grupo: "15 a 19" },
    { sexo: "Mujeres", personas: 0, grupo: "10 a 14" },
    { sexo: "Mujeres", personas: 0, grupo: "05 a 09" },
    { sexo: "Mujeres", personas: 0, grupo: "00 a 04" },
  ];

  ngOnInit() {


    // this.codigoIne = this.capitalizeString(this._route.snapshot.paramMap.get('municipio'));
    // this.lugarBuscadoParsed = this.deleteSpace(this._route.snapshot.paramMap.get('municipio'));
    this._route.queryParams.subscribe(params => {
      this.tipoLocalidad = params['tipo'];
      this.codigoIne = params['id'];
    });

    if (this.tipoLocalidad === 'municipio') {
      this.sufijoCuboDatos = 'TM';
    } else if (this.tipoLocalidad === 'comarca') {
      this.sufijoCuboDatos = 'TC';
    } else if (this.tipoLocalidad === 'comunidad') {
      this.sufijoCuboDatos = 'A';
    }
    else {
      this.sufijoCuboDatos = 'TP';
    }

    if (this.tipoLocalidad === 'municipio') {
      this.piramideHombres = [
        { sexo: "Hombres", personas: 0, grupo: "90 ó más" },
        { sexo: "Hombres", personas: 0, grupo: "85 a 90" },
        { sexo: "Hombres", personas: 0, grupo: "80 a 84" },
        { sexo: "Hombres", personas: 0, grupo: "75 a 79" },
        { sexo: "Hombres", personas: 0, grupo: "70 a 74" },
        { sexo: "Hombres", personas: 0, grupo: "65 a 69" },
        { sexo: "Hombres", personas: 0, grupo: "60 a 64" },
        { sexo: "Hombres", personas: 0, grupo: "55 a 59" },
        { sexo: "Hombres", personas: 0, grupo: "50 a 54" },
        { sexo: "Hombres", personas: 0, grupo: "45 a 49" },
        { sexo: "Hombres", personas: 0, grupo: "40 a 44" },
        { sexo: "Hombres", personas: 0, grupo: "35 a 39" },
        { sexo: "Hombres", personas: 0, grupo: "30 a 34" },
        { sexo: "Hombres", personas: 0, grupo: "25 a 29" },
        { sexo: "Hombres", personas: 0, grupo: "20 a 24" },
        { sexo: "Hombres", personas: 0, grupo: "15 a 19" },
        { sexo: "Hombres", personas: 0, grupo: "10 a 14" },
        { sexo: "Hombres", personas: 0, grupo: "05 a 09" },
        { sexo: "Hombres", personas: 0, grupo: "00 a 04" },
      ];

      this.piramideMujeres = [
        { sexo: "Mujeres", personas: 0, grupo: "90 ó más" },
        { sexo: "Mujeres", personas: 0, grupo: "85 a 90" },
        { sexo: "Mujeres", personas: 0, grupo: "80 a 84" },
        { sexo: "Mujeres", personas: 0, grupo: "75 a 79" },
        { sexo: "Mujeres", personas: 0, grupo: "70 a 74" },
        { sexo: "Mujeres", personas: 0, grupo: "65 a 69" },
        { sexo: "Mujeres", personas: 0, grupo: "60 a 64" },
        { sexo: "Mujeres", personas: 0, grupo: "55 a 59" },
        { sexo: "Mujeres", personas: 0, grupo: "50 a 54" },
        { sexo: "Mujeres", personas: 0, grupo: "45 a 49" },
        { sexo: "Mujeres", personas: 0, grupo: "40 a 44" },
        { sexo: "Mujeres", personas: 0, grupo: "35 a 39" },
        { sexo: "Mujeres", personas: 0, grupo: "30 a 34" },
        { sexo: "Mujeres", personas: 0, grupo: "25 a 29" },
        { sexo: "Mujeres", personas: 0, grupo: "20 a 24" },
        { sexo: "Mujeres", personas: 0, grupo: "15 a 19" },
        { sexo: "Mujeres", personas: 0, grupo: "10 a 14" },
        { sexo: "Mujeres", personas: 0, grupo: "05 a 09" },
        { sexo: "Mujeres", personas: 0, grupo: "00 a 04" },
      ];
    }

    this.queryNombresIne = `https://opendata.aragon.es/sparql?default-graph-uri=&query=prefix+dbpedia%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2F%3E+%0D%0Aprefix+org%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23%3E%0D%0Aprefix+aragopedia%3A+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2FAragopedia%23%3E%0D%0A%0D%0Aselect+%3Fnombre+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E++where+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2F${this.tipoLocalidad}%2F${this.codigoIne}%3E+dc%3Atitle+%3Fnombre%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

    this.piramidePoblacionSvc.getPiramidePoblacion(this.queryNombresIne).subscribe(data => {
      const lastPosition = data.results.bindings.length - 1;

      const nombreMunicipio = this.replaceWord(data.results.bindings[lastPosition].nombre.value);
      if (this.tipoLocalidad === 'diputacion') {
        this.lugarBuscado = nombreMunicipio;
        this.lugarBuscadoParsed = this.capitalizeString(nombreMunicipio.slice(25, nombreMunicipio.length));
      } else {
        this.lugarBuscado = nombreMunicipio;

        this.lugarBuscadoParsed = this.replaceCaspe(this.capitalAfterHyphen(this.capitalAfterSlash(this.deleteSpace(this.capitalizeString(this.lugarBuscado)))));
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
        } else if (this.lugarBuscadoParsed === 'Villarroya_de_La_Sierra') {
          this.lugarBuscadoParsed = 'Villarroya_de_la_Sierra';
        }
      };


      if (this.tipoLocalidad === 'diputacion') {
        this.queryPiramidePoblacion = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3Fyear+%3Fgrupo+%3Fsexo+abs%28xsd%3Aint%28%3Fvalor%29%29+as+%3Fpersonas+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030004${this.sufijoCuboDatos}%3E%3B%0D%0A+++++++++++++%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FProvincia%2F${this.lugarBuscadoParsed}%3E%3B%0D%0A+++++++++++++%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A%0D%0A++%7B+select+distinct+%3FrefPeriod+where+%7B%0D%0A+++++++++++++++++++++++++++++++++++++++++++++++++++%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030004${this.sufijoCuboDatos}%3E.%0D%0A++++++++++++++++++++++++++++++++++++++++++++++++++++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+++++++++++++++++++++++++++++++++++++++++++++%7D%0D%0A+++++++++++++++++++++++++++++++++++++++++++++ORDER+BY+desc%28%3FrefPeriod%29%0D%0A+++++++++++++++++++++++++++++++++++++++++++++LIMIT+1++%7D%0D%0A%0D%0A%3FrefPeriod+time%3AinXSDgYear+%3Fyear.%0D%0A%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fdimension%23sexo%3E+%3FsexoVal++%7D+.%0D%0A+%3FsexoVal+skos%3AprefLabel+%3Fsexo.%0D%0AFILTER+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Fkos%2Fiaest%2Fsexo%2Fmujeres%3E+AS+%3FsexoVal%29.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fdimension%23edad-grupos-quinquenales%3E+%3FgrupoVal++%7D+.%0D%0A+%3FgrupoVal+skos%3AprefLabel+%3Fgrupo.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23personas%3E+%3Fvalor+%7D+.%0D%0A%7D%0D%0AORDER+BY++desc%28%3Fgrupo%29%2C+%3Fsexo%0D%0ALIMIT+200&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
        this.linkToQuery = this.exportHtmlQuery(this.queryPiramidePoblacion)
      } else if (this.tipoLocalidad === 'comunidad') {
        this.queryPiramidePoblacion = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3Fyear+%3Fgrupo+%3Fsexo+abs%28xsd%3Aint%28%3Fvalor%29%29+as+%3Fpersonas+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030004A%3E%3B%0D%0A+++++++++++++%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FComunidadAutonoma%2FArag%C3%B3n%3E%3B%0D%0A+++++++++++++%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A++%7B+select+distinct+%3FrefPeriod+where+%7B%0D%0A+++++++++++++++++++++++++++++++++++++++++++++++++++%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030004A%3E.%0D%0A++++++++++++++++++++++++++++++++++++++++++++++++++++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+++++++++++++++++++++++++++++++++++++++++++++%7D%0D%0A+++++++++++++++++++++++++++++++++++++++++++++ORDER+BY+desc%28%3FrefPeriod%29%0D%0A+++++++++++++++++++++++++++++++++++++++++++++LIMIT+1++%7D%0D%0A%3FrefPeriod+time%3AinXSDgYear+%3Fyear.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fdimension%23sexo%3E+%3FsexoVal++%7D+.%0D%0A+%3FsexoVal+skos%3AprefLabel+%3Fsexo.%0D%0AFILTER+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Fkos%2Fiaest%2Fsexo%2Fmujeres%3E+AS+%3FsexoVal%29.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fdimension%23edad-grupos-quinquenales%3E+%3FgrupoVal++%7D+.%0D%0A+%3FgrupoVal+skos%3AprefLabel+%3Fgrupo.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23personas%3E+%3Fvalor+%7D+.%0D%0A%7D%0D%0AORDER+BY++desc%28%3Fgrupo%29%2C+%3Fsexo%0D%0ALIMIT+200&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
        this.linkToQuery = this.exportHtmlQuery(this.queryPiramidePoblacion)
      } else if (this.tipoLocalidad === 'municipio') {
        this.queryPiramidePoblacion = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3Fyear+%3Fgrupo+%3Fsexo+abs%28xsd%3Aint%28%3Fvalor%29%29+as+%3Fpersonas+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030018TM%3E%3B%0D%0A+++++++++++++%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FMunicipio%2F${this.lugarBuscadoParsed}%3E%3B%0D%0A+++++++++++++%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A++%7B+select+distinct+%3FrefPeriod+where+%7B%0D%0A+++++++++++++++++++++++++++++++++++++++++++++++++++%3Fobs+qb%3AdataSet+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030018TM%3E.%0D%0A++++++++++++++++++++++++++++++++++++++++++++++++++++%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+++++++++++++++++++++++++++++++++++++++++++++%7D%0D%0A+++++++++++++++++++++++++++++++++++++++++++++ORDER+BY+desc%28%3FrefPeriod%29%0D%0A+++++++++++++++++++++++++++++++++++++++++++++LIMIT+1++%7D%0D%0A%3FrefPeriod+time%3AinXSDgYear+%3Fyear.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fdimension%23sexo%3E+%3FsexoVal++%7D+.%0D%0A+%3FsexoVal+skos%3AprefLabel+%3Fsexo.%0D%0AFILTER+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Fkos%2Fiaest%2Fsexo%2Fmujeres%3E+AS+%3FsexoVal%29.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fdimension%23edad-grupos-quinquenales%3E+%3FgrupoVal++%7D+.%0D%0A+%3FgrupoVal+skos%3AprefLabel+%3Fgrupo.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23personas%3E+%3Fvalor+%7D+.%0D%0A%7D%0D%0AORDER+BY++desc%28%3Fgrupo%29%2C+%3Fsexo%0D%0ALIMIT+200&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;
        this.linkToQuery = this.exportHtmlQuery(this.queryPiramidePoblacion)

      }



      this.piramidePoblacionSvc.getPiramidePoblacion(this.queryPiramidePoblacion).subscribe((data: any) => {
        if (data.results.bindings.length !== 0) {
          this.piramidePoblacion = data.results.bindings;
          this.yearPiramide = this.piramidePoblacion[0].year.value;

          this.piramidePoblacion.forEach((element: any) => {
            let auxDatoPiramide: ItemPiramide = { sexo: "", personas: 0, grupo: "" };

            auxDatoPiramide.grupo = element.grupo.value;
            auxDatoPiramide.sexo = element.sexo.value;
            auxDatoPiramide.personas = element.personas.value;

            if ((element.sexo.value) == "Mujeres") {
              if (this.piramideMujeres.find(v => v.grupo === auxDatoPiramide.grupo) && this.piramideMujeres.find(v => v.grupo === auxDatoPiramide.grupo) != undefined) {

                this.piramideMujeres.find(v => v.grupo == auxDatoPiramide.grupo)!.personas = Number(element.personas.value);

              }
            } else {
              if (this.piramideHombres.find(v => v.grupo === auxDatoPiramide.grupo) && this.piramideHombres.find(v => v.grupo === auxDatoPiramide.grupo) != undefined) {

                this.piramideHombres.find(v => v.grupo == auxDatoPiramide.grupo)!.personas = Number(element.personas.value);

              }
            }
          });

          let maxHombres = Math.max.apply(Math, this.piramideHombres.map(function (o) { return o.personas; }))
          let maxMujeres = Math.max.apply(Math, this.piramideMujeres.map(function (o) { return o.personas; }))

          this.max = Math.max(maxHombres, maxMujeres);
        }
      });
    })

  }

  //Métodos
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
        else if (txt.toLowerCase() !== 'de'
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

  deleteSpace(str: any): string {
    return str.split(' ').join('_');
  }

  exportHtmlQuery(query: string) {
    const jsonFormat = 'application%2Fsparql-results%2Bjson';
    const htmlFormat = 'text%2Fhtml';
    const htmlQuery = query?.replace(jsonFormat, htmlFormat);

    return htmlQuery;
  }

  capitalAfterSlash(str: string): string {
    const index = str.indexOf('/');
    const replacement = str[index + 1].toUpperCase();
    return str.replace(str[index + 1], replacement).replace('-sierra', '-Sierra');
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

  replaceWord(str: string): string {
    return str
      .replace('ARAGON', 'ARAGÓN')
      .replace('ARAGO', 'ARAGÓ')
      .replace('GALLEGO', 'GÁLLEGO')
      .replace('MARTIN', 'MARTÍN')
      .replace('GUDAR', 'GÚDAR')
      .replace('ALBARRACIN', 'ALBARRACÍN')
      .replace('VALDEJALON', 'VALDEJALÓN')
      .replace('ZARAGÓZA', 'ZARAGOZA')
      .replace('/', '-')
  }

  replaceCaspe(str: string): string {
    return str
      .replace('-baix', '/Baix')
      .replace('-Baix', '/Baix')
      .replace('-Plana', '/Plana')
      .replace('Matarraña-', 'Matarraña/')
  }
}
