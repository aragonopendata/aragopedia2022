import { Component, ViewChild, OnInit, ChangeDetectorRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AragopediaService } from './aragopediaService';
import { DomSanitizer } from '@angular/platform-browser';
import { AragopediaSelectorTemasComponent } from '../aragopedia-selector-temas/aragopedia-selector-temas.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { OrderBy } from 'desy-angular';

// Definimos el enum localmente para evitar problemas de importación
export enum OrderByEnum {
  NONE = 'none',
  ASC = 'asc',
  DESC = 'desc'
}

interface DatosTabla {
  [key: string]: string;
}

interface Columna {
  nombre: string;
  matColumnDef: string;
}

// Definición de interfaces para los parámetros de recalculación de la tabla
interface TableFilter {
  columnIndex: number;
  filterText: string;
}

interface TableSort {
  columnIndex: number;
  order: string;
}

interface TableRecalculateParams {
  filters: TableFilter[];
  sort: TableSort | null;
}

@Component({
  selector: 'app-aragopedia-tabla-datos',
  templateUrl: './aragopedia-tabla-datos.component.html',
  styleUrls: ['./aragopedia-tabla-datos.component.scss'],
})
export class AragopediaTablaDatosComponent implements OnInit, OnChanges {
  // Nuevos inputs para datos directos
  @Input() directData: any[] = []; // Datos directos para query-results
  @Input() directColumns: string[] = []; // Columnas directas
  @Input() showDownloadButtons: boolean = true; // Controlar si mostrar botones de descarga
  @Input() tableTitle: string = 'Datos estadísticos'; // Título personalizable

  // Exponemos el enum para usarlo en el template
  OrderBy = OrderBy;
  // Exponemos Math para usarlo en el template
  Math = Math;
  
  ocultarPeriod: boolean = false;
  displayedColumns!: string[];
  columnasTabla: Array<Columna> = [
    { nombre: 'Localidad', matColumnDef: 'nameRefArea' },
    { nombre: 'Fecha subida', matColumnDef: 'nameRefPeriod' },
  ];
  rawRowsData: Array<{ id: string, cellsList: { text: string, classes?: string }[] }> = [];
  filteredRowsData = [...this.rawRowsData];
  // Variables para la tabla DESY
  headCells: any[] = [];
  rowsData: any[] = [];
  visibleRowsData: any[] = [];
  paginatedRowsData: any[] = [];
  tituloTabla: string = '';
  
  queryAragopedia: string = '';
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
  
  // Parámetros de paginación
  itemsPerPage: number = 10; 
  currentPage: number = 1;
  totalItems: number = 0;
  totalPages: number = 0;
  maxVisiblePages: number = 5;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  
  // Variables para ordenación
  currentSort: any = null;

  /** 
   * Calcula los números de página que deben mostrarse
   * basado en la página actual y el máximo de botones visibles
   */
  get visiblePages(): number[] {
    const pages: number[] = [];
    
    if (this.totalPages <= 1) {
      return this.totalPages === 1 ? [1] : [];
    }
    
    // Si hay menos páginas que el máximo a mostrar, mostrar todas
    if (this.totalPages <= this.maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    
    // Calcular el rango de páginas a mostrar
    const halfVisible = Math.floor(this.maxVisiblePages / 2);
    
    let startPage = Math.max(1, this.currentPage - halfVisible);
    let endPage = Math.min(this.totalPages, startPage + this.maxVisiblePages - 1);
    
    // Ajustar si estamos cerca del final
    if (endPage - startPage + 1 < this.maxVisiblePages) {
      startPage = Math.max(1, endPage - this.maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(AragopediaSelectorTemasComponent) selectorTemas!: AragopediaSelectorTemasComponent;

  constructor(public aragopediaSvc: AragopediaService, private sanitizer: DomSanitizer, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.validateUrl(this.queryAragopediaCSV)) {
      this.linkDescargaCSV = this.queryAragopediaCSV;
    } else {
      console.log('url no válida o no segura', this.queryAragopediaCSV);
    }

    // Si hay datos directos, procesarlos inmediatamente
    if (this.directData && this.directData.length > 0) {
      this.processDirectData();
      return;
    }

    // Flujo original con el servicio
    this.setupServiceSubscriptions();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Detectar cambios en los datos directos
    if (changes['directData'] && this.directData && this.directData.length > 0) {
      this.processDirectData();
    }
  }

  /**
   * Procesa datos directos para query-results
   */
  private processDirectData() {
    this.loading = true;
    this.tituloTabla = this.tableTitle;

    // Configurar columnas
    if (this.directColumns && this.directColumns.length > 0) {
      this.displayedColumns = this.directColumns;
      this.setupDirectColumns();
    }

    // Procesar datos
    this.prepareDirectRowsData(this.directData);
    
    this.totalItems = this.rowsData.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.handlePageChange(1);
    
    this.loading = false;
  }

  /**
   * Configura las columnas para datos directos
   */
  private setupDirectColumns() {
    this.columnasTabla = [];
    this.headCells = [];

    this.directColumns.forEach((columnName) => {
      // Formatear nombre de columna
      const formattedName = this.formatColumnName(columnName);
      
      const columnaAux: Columna = {
        nombre: formattedName,
        matColumnDef: columnName
      };
      
      this.columnasTabla.push(columnaAux);
      
      // Añadir a headCells para DESY - todas las columnas alineadas a la izquierda
      this.headCells.push({
        text: formattedName,
        hasFilter: false,
        orderBy: 'asc',
        classes: '' // Sin clases especiales, todo alineado a la izquierda
      });
    });
  }

  /**
   * Prepara datos de filas para datos directos
   */
  private prepareDirectRowsData(data: any[]) {
    this.rowsData = [];
    
    data.forEach((row: any, index: number) => {
      const cellsList: any[] = [];
      
      // Para cada columna, crear una celda
      this.directColumns.forEach(columnName => {
        // Para datos directos que ya vienen formateados desde query-results.service.ts,
        // usar directamente el valor formateado en lugar de aplicar getCellValue()
        const cellValue = row[columnName]?.value || '—';
        const originalValue = row[columnName]?.originalValue || row[columnName]?.value || '';
        
        cellsList.push({
          text: cellValue, // Usar el valor ya formateado desde el servicio
          originalValue: originalValue, // Guardar el valor original para detectar URLs
          classes: '' // Quitar alineación a la derecha para que todo vaya a la izquierda
        });
      });
      
      this.rowsData.push({
        id: 'row-' + index,
        cellsList: cellsList
      });
    });
    
    this.visibleRowsData = [...this.rowsData];
  }

  /**
   * Obtiene el valor formateado de una celda
   */
  private getCellValue(cellData: any): string {
    if (!cellData || !cellData.value) {
      return '—';
    }
  
    const value = cellData.value;
    
    // Si es una URL, mostrarla completa en lugar de extraer la parte final
    if (this.isUrl(value)) {
      return value; // Devolver la URL completa
    }
  
    // Si es un número, formatearlo
    if (cellData.type === 'literal' && cellData.datatype && 
        (cellData.datatype.includes('integer') || cellData.datatype.includes('decimal'))) {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        return num.toLocaleString('es-ES');
      }
    }
  
    return value;
  }

  /**
   * Formatea el nombre de una columna
   */
  private formatColumnName(columnName: string): string {
    return columnName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Determina si una columna es numérica
   */
  private isNumericColumn(columnName: string): boolean {
    return columnName.toLowerCase().includes('rate') || 
           columnName.toLowerCase().includes('count') ||
           columnName.toLowerCase().includes('number');
  }

  /**
   * Determina si un valor es una URL
   */
  public isUrl(value: string): boolean {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Configura las suscripciones al servicio (flujo original)
   */
  private setupServiceSubscriptions() {
    this.aragopediaSvc.columnasTablaObserver.subscribe((dataColumnas: any) => {
      this.nombresColumnas = dataColumnas;
    });

    this.aragopediaSvc.queryTemasObserver.subscribe((data: any) => {
      this.loading = true;
      
      this.aragopediaSvc.getData(data).subscribe((response: any) => {
        var dato = response.results.bindings[0];
        let datos = response.results.bindings;
        
        // Obtener el título de la tabla si está disponible
        try {
          this.tituloTabla = this.aragopediaSvc.tipoLocalidad || 'Datos estadísticos';
        } catch (e) {
          this.tituloTabla = 'Datos estadísticos';
        }

        if (dato !== undefined) {
          this.displayedColumns = Object.keys(dato);

          let columnasNormalized: Array<String> = [];

          this.displayedColumns.forEach((element: any) => {
            columnasNormalized.push(this.normalizeColumnName(element));
          });

          let auxColumnas = [
            { nombre: 'Área', matColumnDef: 'nameRefArea' },
            { nombre: 'Fecha subida', matColumnDef: 'nameRefPeriod' }
          ];

          // Preparamos las columnas para DESY
          this.headCells = [];
          
          this.nombresColumnas.forEach((element: any) => {
            if (this.displayedColumns.includes(this.normalizeColumnName(element['callret-2'].value))) {
              let columnaAux: Columna = {
                nombre: element['callret-2'].value,
                matColumnDef: this.normalizeColumnName(element['callret-2'].value)
              };
              auxColumnas.push(columnaAux);
              
              // Añadimos la columna a headCells para DESY con orderBy='asc' para habilitar la ordenación
              // y hasFilter=false para eliminar los buscadores
              this.headCells.push({
                text: element['callret-2'].value,
                hasFilter: false,
                orderBy: 'asc',
                classes: element['callret-2'].value.includes('Rate') ? 'text-right' : ''
              });
            }
          });
          
          this.columnasTabla = auxColumnas;
          
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
            this.displayedColumns.splice(this.displayedColumns.indexOf('nameRefPeriod'), 1);
          }
        } else {
          this.displayedColumns = [];
          this.headCells = [];
        }

        if (this.displayedColumns.includes('refArea')) {
          this.displayedColumns.splice(this.displayedColumns.indexOf('refArea'), 1);
        }
        
        if (this.displayedColumns.includes('refPeriod')) {
          this.displayedColumns.splice(this.displayedColumns.indexOf('refPeriod'), 1);
        }

        this.linkDescargaJSON = this.aragopediaSvc.queryTemas;

        // Preparamos los datos para DESY
        this.prepareRowsData(response.results.bindings);
        
        this.dataSrc = new MatTableDataSource(response.results.bindings);
        this.sortedData = new MatTableDataSource(this.dataSrc.data.slice());

        if (this.paginator) {
          this.sortedData.paginator = this.paginator;
        }
        
        this.loading = false;
        this.totalItems = this.rowsData.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.handlePageChange(1);
      });
    });
  }

  // Prepara los datos de filas para el formato que espera DESY (flujo original)
  prepareRowsData(data: any[]) {
    this.rowsData = [];
    
    data.forEach((row: any, index: number) => {
      const cellsList: any[] = [];
      
      // Para cada columna, crear una celda
      this.columnasTabla.forEach(columna => {
        cellsList.push({
          text: row[columna.matColumnDef]?.value || '',
          classes: columna.nombre.includes('Rate') ? 'text-right' : ''
        });
      });
      
      this.rowsData.push({
        id: 'row-' + index,
        cellsList: cellsList
      });
    });
    
    this.visibleRowsData = [...this.rowsData];
  }

  // Método para manejar la paginación
  handlePageChange(page: number) {
    // Asegurarse de que la página está dentro de los límites
    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;
    
    console.log('Paginador: cambio a página', page);
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.visibleRowsData.length);
    this.paginatedRowsData = this.visibleRowsData.slice(startIndex, endIndex);
    
    // Actualizar el total de páginas
    this.totalPages = Math.ceil(this.visibleRowsData.length / this.itemsPerPage);
    this.cd.detectChanges();
  }
  
  // Método para manejar la recalculación de la tabla (filtrado y ordenación)
  handleRecalculateTable(params: TableRecalculateParams) {
    let rows = [...this.rowsData];
    
    // Aplicar filtros
    if (params.filters?.length) {
      params.filters.forEach(f => {
        if (f.filterText.trim()) {
          rows = rows.filter(row =>
            row.cellsList[f.columnIndex].text
               .toString()
               .toLowerCase()
               .includes(f.filterText.toLowerCase())
          );
        }
      });
    }
    
    // Aplicar ordenación
    if (params.sort) {
      const columnIndex = params.sort.columnIndex;
      const isAsc = params.sort.order === 'asc';
      
      rows.sort((a, b) => {
        const aValue = a.cellsList[columnIndex].text;
        const bValue = b.cellsList[columnIndex].text;
        
        if (this.isNumeric(aValue) && this.isNumeric(bValue)) {
          return isAsc 
            ? parseFloat(aValue) - parseFloat(bValue) 
            : parseFloat(bValue) - parseFloat(aValue);
        } else {
          if (isAsc) {
            return aValue.localeCompare(bValue);
          } else {
            return bValue.localeCompare(aValue);
          }
        }
      });
      
      this.currentSort = params.sort;
    }

    // Si hay filtros activos o se ha cambiado la ordenación, volver a la primera página
    if ((params.filters?.some(f => f.filterText.trim())) || params.sort) {
      this.currentPage = 1;
    }
  
    // Actualizar datos visibles y paginación
    this.visibleRowsData = rows;
    this.totalItems = rows.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    
    // Actualizo la página actual
    this.handlePageChange(this.currentPage);
    this.cd.detectChanges();
  }

  // Cambiar el número de elementos por página
  setItemsPerPage(numItems: number) {
    this.itemsPerPage = numItems;
    this.totalPages = Math.ceil(this.visibleRowsData.length / this.itemsPerPage);
    this.handlePageChange(1); // Volver a la primera página cuando cambia el tamaño
  }

  isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value.toString().replace(/[€%]/g, '').trim());
  }

  getKeys(element: any, columna: string): string {
    let value: string = element?.[columna]?.value;
    return value || '';
  }

  setColumnName(columna: string): string {
    return 'columna' + columna;
  }

  normalizeColumnName(columnName: string): string {
    let auxName = columnName
      .replace(/[\u0300-\u036f]/g, '')
      .normalize('NFD')
      .replaceAll(' ', '_')
      .replaceAll('-', '_')
      .toLowerCase()
      .replace(/[^\w\s]/gi, '');
      
    if (auxName.startsWith('n_')) {
      let nameEnd = auxName.substring(2);
      auxName = 'nÂº_' + nameEnd;
    }
    return auxName;
  }

  sortData(sort: Sort) {
    const column = sort.active;
    
    this.dataSrc.data.map((element: any) => {
      for (const key in element) {
        if (element[key].value === '10 o más') {
          element[key].value = 10;
        } else if (!isNaN(Number(element[key].value))) {
          element[key].value = Number(element[key].value);
        }
      }
    });

    const isAsc = sort.direction === 'asc';
    const data = this.dataSrc.data.slice();
    
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      this.sortedData = new MatTableDataSource(data);
      this.sortedData.paginator = this.paginator;
      return;
    }
    
    data.sort((a: any, b: any) => {
      if (typeof a[column]?.value === 'number') {
        if (sort.active) {
          return isAsc ? a[column]?.value - b[column]?.value : b[column]?.value - a[column]?.value;
        } else {
          return 0;
        }
      } else if (typeof a[column]?.value === 'string') {
        if (sort.active) {
          if (isAsc) {
            if (a[column]?.value < b[column]?.value) {
              return -1;
            }
            if (a[column]?.value > b[column]?.value) {
              return 1;
            }
          } else {
            if (!a[column]?.value || !b[column]?.value) {
              return 0;
            }
            if (a[column]?.value > b[column]?.value) {
              return -1;
            }
            if (a[column]?.value < b[column]?.value) {
              return 1;
            }
          }
          return 0;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    });
    
    this.sortedData = new MatTableDataSource(data);
    this.sortedData.paginator = this.paginator;
    return this.sortedData;
  }

  exportHtmlQuery(query: string) {
    const jsonFormat = 'application%2Fsparql-results%2Bjson';
    const htmlFormat = 'text%2Fhtml';

    const count = '+count+';
    const countDistinct = '+count%28distinct%28%3Fs%29%29++';
    const distinct = '+distinct%28%3Fs%29++';

    const htmlQuery = query
      ?.replace(jsonFormat, htmlFormat)
      .replace(count, '+')
      .replace(countDistinct, distinct)
      .replace('+count%28distinct+%3Fs%29+', '+distinct+%3Fs+')
      .replace('+count%28+distinct+%3Fs%29+', '+distinct+%3Fs+')
      .replace('https://query.wikidata.org/sparql?query=', 'https://query.wikidata.org/#');
      
    return htmlQuery;
  }

  exportCsvQuery(query: string) {
    const jsonFormat = 'application%2Fsparql-results%2Bjson';
    const csvFormat = 'text%2Fcsv';

    const count = '+count+';
    const countDistinct = '+count%28distinct%28%3Fs%29%29++';
    const distinct = '+distinct%28%3Fs%29++';

    const csvQuery = query
      ?.replace(jsonFormat, csvFormat)
      .replace(count, '+')
      .replace(countDistinct, distinct)
      .replace('+count%28distinct+%3Fs%29+', '+distinct+%3Fs+')
      .replace('+count%28+distinct+%3Fs%29+', '+distinct+%3Fs+')
      .replace('https://query.wikidata.org/sparql?query=', 'https://query.wikidata.org/#');
      
    return csvQuery;
  }

  validateUrl(url: string): boolean {
    return /^https?:\/\//i.test(url);
  }
}