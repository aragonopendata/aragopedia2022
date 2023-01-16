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
  nombresColumnas!: any;


  @ViewChild(AragopediaSelectorTemasComponent) selectorTemas!: AragopediaSelectorTemasComponent;

  ngOnInit() {
    //console.log(this.aragopediaSvc.queryTemas)


    this.linkDescargaCSV = this.sanitizer.bypassSecurityTrustUrl(this.queryAragopediaCSV);

    this.aragopediaSvc.columnasTablaObserver.subscribe((dataColumnas: any) => {
      this.nombresColumnas = dataColumnas;
    });

    this.aragopediaSvc.queryTemasObserver.subscribe((data: any) => {
      this.aragopediaSvc.getData(data).subscribe((response: any) => {
        var dato = response.results.bindings[0]
        let datos = response.results.bindings;

        if (dato !== undefined) {
          this.displayedColumns = Object.keys(dato);
        }
        else {
          this.displayedColumns = [];
        }

        this.displayedColumns.splice((this.displayedColumns.indexOf('refArea')), 1);
        this.displayedColumns.splice((this.displayedColumns.indexOf('refPeriod')), 1);

        //console.log(this.displayedColumns)

        this.linkDescargaJSON = this.aragopediaSvc.queryTemas;
        console.log(this.linkDescargaJSON)

        datos.forEach((item: any) => {
          for (const key in item) {
            const element = item[key].value;

            if (element.startsWith('http')) {
              const index = element.lastIndexOf('/')
              element.substring(index);
              item[key].value = element.substring(index + 1);
            }

          }
        });

        this.tablaConsulta = response.results.bindings;

      })

    });

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