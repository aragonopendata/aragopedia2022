import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TemasService } from './temas.service';

@Component({
  selector: 'app-temas',
  templateUrl: './temas.component.html',
  styleUrls: ['./temas.component.scss']
})

export class TemasComponent implements OnInit {

  constructor(public temasSvc: TemasService) {
  }

  temasCtrl = new FormControl('', []);
  temasGroup = new FormGroup([]);

  temasSeleccionados: string[] = [];
  queryTemasUrl!: string;

  temas: string[] = [];
  temasUnicos!: string[];
  //temasConIconos: any = undefined || [{}];

  temasConIconos: any = [{}]

  iconosTemas: string[] = [
    'ciencia.png',
    'comercio.png',
    'cultura.png',
    'deporte.png',
    'economia.png',
    'educacion.png',
    'empleo.png',
    'energia.png',
    'hacienda.png',
    'industria.png',
    'justicia.png',
    'medioambiente.png',
    'mediorural.png',
    'salud.png',
    'sectorpublico.png',
    'seguridad.png',
    'sociedad.png',
    'transporte.png',
    'turismo.png',
    'infraestructuras.png',
    'vivienda.png'
  ];

  ngOnInit(): void {
    this.queryTemasUrl = 'https://opendata.aragon.es/sparql?default-graph-uri=&query=PREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0D%0A%0D%0ASELECT+DISTINCT+count%28%3FuriTema+as+%3Fcnt%29+%3Ftipo+%3FlabelTema+%3FuriTema+WHERE+%7B%0D%0A++%3FuriTema+a+skos%3AConcept.%0D%0A++%3FuriTema+skos%3AprefLabel+%3FlabelTema.%0D%0A++FILTER%28CONTAINS%28STR%28%3FuriTema%29%2C+%22datos.gob.es%22%29%29%0D%0A++BIND%28%22skos%3AConcept%22+AS+%3Ftipo%29.%0D%0A%7D%0D%0A%0D%0Aorder+by+%3FlabelTema&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on'

    this.temasSvc.getResults(this.queryTemasUrl).subscribe(data => {
      const temasProv = data.results.bindings;
      for (let i = 0; i < temasProv.length; i++) {
        let tema = temasProv[i].labelTema.value;
        this.temas.push(tema);
        this.temasUnicos = [... new Set(this.temas)];

        this.temasUnicos.forEach((element: any, i: any) => {
          this.temasConIconos[i] = { title: element, icon: this.iconosTemas[i] }
        });
      }
      
    });
  }

  removeItemFromArr(arr: any, item: any) {
    let i = arr.indexOf(item);
    arr.splice(i, 1);
  }

  onChange(event: any) {
    event.checked ?
      this.temasSeleccionados.push(event.name) :
      this.removeItemFromArr(this.temasSeleccionados, event.name);
  }

}
