import { Component, NgModule, OnInit, Sanitizer, ViewChild, AfterViewInit } from '@angular/core';
import { AragopediaService } from './aragopediaService';
import { DomSanitizer } from '@angular/platform-browser';
import { AragopediaSelectorTemasComponent } from '../aragopedia-selector-temas/aragopedia-selector-temas.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { timeout } from 'rxjs';
// import * as $ from 'jquery';
declare var $: any;
interface DatosTabla {
  [key: string]: string;
}
interface Columna {
  nombre: string;
  matColumnDef: string;
}

@Component({
  selector: 'app-aragopedia-tabla-datos',
  templateUrl: './aragopedia-tabla-datos.component.html',
  styleUrls: ['./aragopedia-tabla-datos.component.scss'],

})
export class AragopediaTablaDatosComponent {

  constructor(public aragopediaSvc: AragopediaService, private sanitizer: DomSanitizer) { }

  ocultarPeriod: boolean = false;
  displayedColumns!: string[];
  columnasTabla: Array<Columna> = [{ nombre: 'Localidad', matColumnDef: 'nameRefArea' }, { nombre: 'Fecha subida', matColumnDef: 'nameRefPeriod' }];
  queryAragopedia: string = "";
  queryAragopediaCSV!: string;
  linkDescargaJSON!: any;
  linkDescargaCSV!: any;
  tablaConsulta!: MatTableDataSource<any>;
  tablaDibujable!: any;
  stringelementonameref!: any;
  isJqueryWorking!: string;
  nombresColumnas!: any;
  dataSrc!: MatTableDataSource<any>;
  sortedData: any;
  loading: boolean = false;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('empTbSort') empTbSort = new MatSort();

  @ViewChild(AragopediaSelectorTemasComponent) selectorTemas!: AragopediaSelectorTemasComponent;

  ngOnInit() {

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

          let columnasNormalized: Array<String> = [];

          this.displayedColumns.forEach((element: any) => {

            columnasNormalized.push(this.normalizeColumnName(element))
          });

          let auxColumnas = [{ nombre: 'Localidad', matColumnDef: 'nameRefArea' }, { nombre: 'Fecha subida', matColumnDef: 'nameRefPeriod' }]

          this.nombresColumnas.forEach((element: any) => {
            //console.log(this.normalizeColumnName(element['callret-2'].value))
            if (this.displayedColumns.includes(this.normalizeColumnName(element['callret-2'].value))) {
              let columnaAux: Columna = { nombre: element['callret-2'].value, matColumnDef: this.normalizeColumnName(element['callret-2'].value) }
              auxColumnas.push(columnaAux);
            }
          });
          //console.log(this.displayedColumns)
          //console.log(auxColumnas)
          //console.log(this.columnasTabla)
          this.columnasTabla = auxColumnas;
          let nameRefPeriod = false;
          let mes_y_ano = false;
          this.displayedColumns.forEach((titulo: any) => { //Cambiar al tratamiento por objetos
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

        /*         datos.forEach((item: any) => {
                  for (const key in item) {
                    const element = item[key].value;
        
                    if (element.startsWith('http')) {
                      const index = element.lastIndexOf('/')
                      element.substring(index);
                      item[key].value = element.substring(index + 1);
                    }
        
                  }
                }); */

        this.dataSrc = new MatTableDataSource(response.results.bindings);
        this.sortedData = new MatTableDataSource(this.dataSrc.data.slice());

        this.sortedData.paginator = this.paginator;
        this.dataSrc.sort = this.empTbSort;
      })

    });

  }

  getKeys(element: any, columna: string): string {
    // console.log(element)
    let value: string = element?.[columna]?.value;
    return value
  }

  setColumnName(columna: string): string {
    return "columna" + columna;
  }

  normalizeColumnName(columnName: string) {
    let auxName = columnName.replace(/[\u0300-\u036f]/g, "").normalize("NFD").replaceAll(" ", "_").toLowerCase().replace(/[^\w\s]/gi, '')
    if (auxName.startsWith("n_")) {

      let nameEnd = auxName.substring(2);
      auxName = "nÂº_" + nameEnd
    }
    return auxName

  }


  sortData(sort: Sort) {
    // this.loading = true;
    const column = sort.active;
    this.dataSrc.data.map(element => {
      for (const key in element) {
        isNaN(Number(element[key].value)) ? element[key].value = element[key].value : element[key].value = Number(element[key].value);
      }
    });

    const isAsc = sort.direction === 'asc';
    const data = this.dataSrc.data.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      this.sortedData = new MatTableDataSource(data)
      this.sortedData.paginator = this.paginator;
      return;
    }
    data.sort((a: any, b: any) => {

      if (typeof a[column]?.value === 'number') {
        if (sort.active) {
          return (isAsc ? a[column].value - b[column].value : b[column].value - a[column].value);
        } else {
          return 0;
        }
      } else if (typeof a[column]?.value === 'string') {

        if (sort.active) {
          if (a[column].value < b[column].value) {
            this.loading = false;
            return -1;
          }
          if (a[column].value > b[column].value) {
            this.loading = false;
            return 1;
          }

          return 0;
        } else {
          // this.loading = false;

          return 0;
        }
      } else {
        return 0
      }

    });
    // this.loading = false;
    this.sortedData = new MatTableDataSource(data)
    this.sortedData.paginator = this.paginator;
    return this.sortedData;
  }
}



function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

