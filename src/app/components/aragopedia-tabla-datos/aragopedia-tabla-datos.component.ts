import { Component, NgModule, OnInit, Sanitizer, ViewChild, AfterViewInit } from '@angular/core';
import { AragopediaService } from './aragopediaService';
import { DomSanitizer } from '@angular/platform-browser';
import { AragopediaSelectorTemasComponent } from '../aragopedia-selector-temas/aragopedia-selector-temas.component';
// import * as $ from 'jquery';
declare var $: any;
interface DatosTabla {
  [key: string]: string;
}

@Component({
  selector: 'app-aragopedia-tabla-datos',
  templateUrl: './aragopedia-tabla-datos.component.html',
  styleUrls: ['./aragopedia-tabla-datos.component.scss'],

})
export class AragopediaTablaDatosComponent {

  constructor(public aragopediaSvc: AragopediaService, private sanitizer: DomSanitizer) { }

  displayedColumns!: string[];
  queryAragopedia: string = "";
  queryAragopediaCSV!: string;
  linkDescargaJSON!: any;
  linkDescargaCSV!: any;
  tablaConsulta!: Array<any>;
  tablaDibujable!: any;
  stringelementonameref!: any;
  isJqueryWorking!: string;


  @ViewChild(AragopediaSelectorTemasComponent) selectorTemas!: AragopediaSelectorTemasComponent;

  ngOnInit() {
    console.log(this.aragopediaSvc.queryTemas)


    this.linkDescargaCSV = this.sanitizer.bypassSecurityTrustUrl(this.queryAragopediaCSV);

    this.aragopediaSvc.queryTemasObserver.subscribe((data: any) => {
      this.aragopediaSvc.getData(data).subscribe((response: any) => {
        console.log(response)
        //var tipodato: any = data.results.bindings;
        var dato = response.results.bindings[0]

        this.displayedColumns = Object.keys(dato);

        const blobConfigJSON = new Blob(
          [JSON.stringify(response.results.bindings)],
          { type: 'text/json;charset=utf-8' }
        )

        this.linkDescargaJSON = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blobConfigJSON));
        this.tablaConsulta = response.results.bindings;

      })

    });

  }

  ngAfterViewInit() {
    console.log(this.aragopediaSvc.queryTemas)

  }

  receiveQuery($event: any) {
    this.queryAragopedia = $event;
    console.log(this.queryAragopedia);

  }

  mostrarTabla() {

    console.log(this.selectorTemas.queryTabla);
  }



  getKeys(element: any, columna: string): string {

    let value: string = element?.[columna].value;

    return value;
  }

  setColumnName(columna: string): string {
    return "columna" + columna;
  }

  createCSV() {

  }

}
