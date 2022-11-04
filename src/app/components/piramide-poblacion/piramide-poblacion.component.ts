import { Component, OnInit } from '@angular/core';
import { dateFormat } from 'dc';
import { PiramidePoblacionService } from './piramide-poblacion.service.spec';
import { ItemPiramide } from './itemPiramide';
import { Item } from 'devextreme/ui/accordion';

@Component({
  selector: 'app-piramide-poblacion',
  templateUrl: './piramide-poblacion.component.html',
  styleUrls: ['./piramide-poblacion.component.scss']
})
export class PiramidePoblacionComponent implements OnInit {

  constructor(public piramidePoblacionSvc: PiramidePoblacionService) { }

  max: number = 1;
  piramidePoblacion: any;
  piramideHombres: Array<ItemPiramide> = [

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

    this.piramidePoblacionSvc.getPiramidePoblacion().subscribe((data: any) => {

      this.piramidePoblacion = data.results.bindings
      console.log(this.piramidePoblacion);

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

      console.log(this.piramideMujeres)
      console.log(this.piramideHombres)
    });

  }

}
