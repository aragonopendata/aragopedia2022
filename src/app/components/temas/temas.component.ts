import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TemasService } from './temas.service';

@Component({
  selector: 'app-temas',
  templateUrl: './temas.component.html',
  styleUrls: ['./temas.component.scss']
})
export class TemasComponent implements OnInit {

  constructor(public temasSvc: TemasService) { }

  temasGroup = new FormGroup('');
  temasSeleccionados: string[] = [];

  temas: string[] = [];

  ngOnInit(): void {
    this.temasSvc.getTemas().subscribe(data => {

      const temasProv = data.results.bindings;

      for (let i = 0; i < temasProv.length; i++) {
        let tema = temasProv[i].tema.value;
        this.temas.push(tema);
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
    console.log(this.temasSeleccionados);
  }

}