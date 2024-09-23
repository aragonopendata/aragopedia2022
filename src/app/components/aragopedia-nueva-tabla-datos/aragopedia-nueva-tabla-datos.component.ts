import { Component, NgModule, OnInit, Sanitizer, ViewChild, AfterViewInit } from '@angular/core';
import { AragopediaService } from '../aragopedia-tabla-datos/aragopediaService';
import { DomSanitizer } from '@angular/platform-browser';
import { AragopediaSelectorTemasComponent } from '../aragopedia-selector-temas/aragopedia-selector-temas.component';

declare var $: any;
interface DatosTabla {
  [key: string]: string;
}

@Component({
  selector: 'app-aragopedia-nueva-tabla-datos',
  templateUrl: './aragopedia-nueva-tabla-datos.component.html',
  styleUrls: ['./aragopedia-nueva-tabla-datos.component.scss']
})
export class AragopediaNuevaTablaDatosComponent {

  constructor(public aragopediaSvc: AragopediaService, private sanitizer: DomSanitizer) { }

  rows = [
    { name: 'Austin', genderEmployee: 'Male', company: 'Swimlane' },
    { name: 'Dany', genderEmployee: 'Male', company: 'KFC' },
    { name: 'Molly', genderEmployee: 'Female', company: 'Burger King' }
  ];
  columns = [{ prop: 'name' }, { name: 'Gender employee' }, { name: 'Company' }];

  ocultarPeriod: boolean = false;
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

    this.linkDescargaCSV = this.sanitizer.bypassSecurityTrustUrl(this.queryAragopediaCSV);

    this.aragopediaSvc.columnasTablaObserver.subscribe((dataColumnas: any) => {
      this.nombresColumnas = dataColumnas;
      console.log(this.nombresColumnas);
    });

    this.aragopediaSvc.queryTemasObserver.subscribe((data: any) => {
      this.aragopediaSvc.getData(data).subscribe((response: any) => {
        var dato = response.results.bindings[0]
        let datos = response.results.bindings;

        if (dato !== undefined) {
          this.displayedColumns = Object.keys(dato);

          let nameRefPeriod = false;
          let mes_y_ano = false;
          this.displayedColumns.forEach((titulo: any) => {
            if (titulo === 'nameRefPeriod') {
              nameRefPeriod = true;
            } else if (titulo === 'mes_y_ano') {
              mes_y_ano = true;
            }
          });
          if (nameRefPeriod && mes_y_ano) {
            this.displayedColumns.splice((this.displayedColumns.indexOf('nameRefPeriod')), 1);
          }
        }
        else {
          this.displayedColumns = [];
        }

        this.displayedColumns.splice((this.displayedColumns.indexOf('refArea')), 1);
        this.displayedColumns.splice((this.displayedColumns.indexOf('refPeriod')), 1);

        this.linkDescargaJSON = this.aragopediaSvc.queryTemas;

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
      console.log(this.tablaConsulta)
    });

  }

  getKeys(element: any, columna: string): string {
    let value: string = element?.[columna]?.value;
    return value
  }

  setColumnName(columna: string): string {
    return "columna" + columna;
  }

}