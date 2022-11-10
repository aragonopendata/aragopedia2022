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
  piramideHombres: Array<ItemPiramide> = [

    { sexo: "Hombres", personas: 0, grupo: "90 ó más" },
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
    { sexo: "Mujeres", personas: 0, grupo: "90 ó más" },
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

    this.lugarBuscado = this.capitalizeString(this._route.snapshot.paramMap.get('municipio'));

    this.queryPiramidePoblacion = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+distinct+%3FrefArea+%3FnameRefArea+%28strafter%28str%28%3FrefPeriod%29%2C+%22http%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F%22%29+AS+%3FnameRefPeriod%29+%3Fgrupo+%3Fsexo+xsd%3Aint%28%3Fvalor%29+as+%3Fpersonas+where+%7B%0D%0A+++%3Fobs+qb%3AdataSet+%3Fdataset.%0D%0A+++FILTER%28%3Fdataset+IN+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fiaest%2Fdataset%2F03-030018TM%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refPeriod%3E+%3FrefPeriod.%0D%0A+FILTER+%28%3FrefPeriod+IN+%28%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fyear%2F2011%3E%29%29.%0D%0A+%3Fobs+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea%3E+%3FrefArea.%0D%0A+%3FrefArea+rdfs%3Alabel+%3FnameRefArea.+%0D%0A+FILTER+%28+lang%28%3FnameRefArea%29+%3D+%22es%22+%29.%0D%0A+BIND+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FMunicipio%2F${this.lugarBuscado}%3E+AS+%3Fmuni%29.%0D%0A+FILTER+%28%3FrefArea+IN+%28%3Fmuni%29%29.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fdimension%23sexo%3E+%3FsexoVal++%7D+.%0D%0A+%3FsexoVal+skos%3AprefLabel+%3Fsexo.%0D%0AFILTER+%28%3Chttp%3A%2F%2Fopendata.aragon.es%2Fkos%2Fiaest%2Fsexo%2Fmujeres%3E+AS+%3FsexoVal%29.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fdimension%23edad-grupos-quinquenales%3E+%3FgrupoVal++%7D+.%0D%0A+%3FgrupoVal+skos%3AprefLabel+%3Fgrupo.%0D%0A+OPTIONAL+%7B++%3Fobs+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fiaest%2Fmedida%23personas%3E+%3Fvalor+%7D+.%0D%0A%7D%0D%0AORDER+BY++desc%28%3FrefPeriod%29%2Cdesc%28%3Fgrupo%29%2C+%3Fsexo%0D%0ALIMIT+200&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

    this.piramidePoblacionSvc.getPiramidePoblacion(this.queryPiramidePoblacion).subscribe((data: any) => {

      this.piramidePoblacion = data.results.bindings

      this.piramidePoblacion.forEach((element: any) => {

        var auxDatoPiramide: ItemPiramide = { sexo: "", personas: 0, grupo: "" };

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

      var maxHombres = Math.max.apply(Math, this.piramideHombres.map(function (o) { return o.personas; }))
      var maxMujeres = Math.max.apply(Math, this.piramideMujeres.map(function (o) { return o.personas; }))

      this.max = Math.max(maxHombres, maxMujeres);
    });

  }

  //Métodos
  capitalizeString(str: any): string {
    return str.replace(/\w\S*/g, function (txt: any) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

}
