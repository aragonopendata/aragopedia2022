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
  temasConIconos: any = undefined || [{}];

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

    this.queryTemasUrl = 'https://opendata.aragon.es/sparql?default-graph-uri=&query=select+sum%28%3Fcnt%29+%3Ftipo+%3FlabelTema+%3FuriTema+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where%0D%0A%7B%0D%0A%3FuriTema+a+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23Concept%3E%3B%0D%0A++++%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23prefLabel%3E+%3FlabelTema%3B%0D%0A++++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fprov%23wasUsedBy%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fprocedencia%2FE2F7D8F3-6578-15FA-D429-F957DC7D61EF%3E.%0D%0A%7B%0D%0Aselect+distinct+count%28distinct+%3Fs%29+as+%3Fcnt+%3Ftipo++%3FlabelTema+%7B%0D%0A%3Fs+%3FpTema+%3Ftema.%0D%0A%3Fs+a+%3Ftipo.%0D%0A%3Ftema+skos%3AprefLabel+%3FlabelTema.%0D%0A%0D%0A+VALUES+%3FpTema+%7B+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23classification%3E+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%3E+%7D.%0D%0A%0D%0AVALUES+%3Ftipo+%7B+%0D%0A%3Chttp%3A%2F%2Fschema.org%2FCreativeWork%3E%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23Dataset%3E%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23Organization%3E%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23Location%3E%0D%0A%3Chttp%3A%2F%2Fschema.org%2FEvent%3E%0D%0A%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23dataSet%3E%0D%0A%7D%0D%0A%7D%0D%0Agroup+by+%3Ftipo+%3FlabelTema%0D%0A%7D%0D%0Aunion%0D%0A%7B%0D%0Aselect+distinct+count%28distinct+%3Fs%29+as+%3Fcnt+%3Ftipo++%3FlabelTema+%7B%0D%0A%3Fs+%3FpTema+%3FlabelTema.%0D%0A%3Fs+a+%3Ftipo.%0D%0A%0D%0A+VALUES+%3FpTema+%7B++%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23theme%3E+%7D.%0D%0A%0D%0AVALUES+%3Ftipo+%7B+%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fdcat%23Dataset%3E%0D%0A%7D%0D%0A%7D%0D%0Agroup+by+%3Ftipo+%3FlabelTema%0D%0A%0D%0A%7D%0D%0AFILTER+%28regex%28%3FuriTema%2C+%22http%3A%2F%2Fdatos.gob.es%2Fkos%2Fsector-publico%2Fsector%2F%22%29%29.%0D%0A%7D%0D%0Agroup+by+%3Ftipo+%3FlabelTema+%3FuriTema%0D%0Aorder+by+%3FlabelTema&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';

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