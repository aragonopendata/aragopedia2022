// aragopedia-nueva-tabla-datos.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { AragopediaService } from '../aragopedia-tabla-datos/aragopediaService';
import { DomSanitizer } from '@angular/platform-browser';
import { AragopediaSelectorTemasComponent } from '../aragopedia-selector-temas/aragopedia-selector-temas.component';
import { OrderBy } from 'desy-angular';

// Interfaces requeridas para Desy Tables con Paginación
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

interface DatosTabla {
  [key: string]: string;
}

interface ColumnDefinition {
  name?: string;
  prop?: string;
}

@Component({
  selector: 'app-aragopedia-nueva-tabla-datos',
  templateUrl: './aragopedia-nueva-tabla-datos.component.html',
  styleUrls: ['./aragopedia-nueva-tabla-datos.component.scss']
})
export class AragopediaNuevaTablaDatosComponent implements OnInit {
  // Datos de ejemplo para la tabla (en caso de que no haya datos de la API)
  rows: any[] = [];
  OrderBy = OrderBy;
  itemsPerPage: number = 10; 
  currentPage: number = 1;
  totalItems: number = 0;
  totalPages: number = 0; //
  // Estructuras para Desy Table
  columns: ColumnDefinition[] = [];
  visibleRows: any[] = [];
  paginatedRows: any[] = [];
  
  // Parámetros para paginación

  
  // Estado general
  loading: boolean = false;
  ocultarPeriod: boolean = false;
  displayedColumns: string[] = [];
  queryAragopedia: string = "";
  queryAragopediaCSV: string = "";
  linkDescargaJSON: any;
  linkDescargaCSV: any;
  tablaConsulta: Array<any> = [];
  tablaDibujable: any;
  stringelementonameref: any;
  isJqueryWorking: string = "";
  nombresColumnas: any;
  currentSort: any = null;

  @ViewChild(AragopediaSelectorTemasComponent) selectorTemas!: AragopediaSelectorTemasComponent;

  constructor(
    public aragopediaSvc: AragopediaService, 
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.inicializarDatos();
    this.suscribirseAServicios();
  }

  private inicializarDatos() {
    this.loading = true;
    
    // Inicialización de datos por defecto (para evitar errores de null/undefined)
    this.rows = [];
    this.visibleRows = [];
    this.paginatedRows = [];
    this.columns = [];
    this.displayedColumns = [];
    
    // Validación y asignación de URL CSV
    if (this.queryAragopediaCSV && this.validateUrl(this.queryAragopediaCSV)) {
      this.linkDescargaCSV = this.queryAragopediaCSV;
    } else {
      console.log('URL no válida o no disponible para CSV:', this.queryAragopediaCSV);
    }
  }

  private suscribirseAServicios() {
    // Suscripción a nombres de columnas
    this.aragopediaSvc.columnasTablaObserver.subscribe((dataColumnas: any) => {
      if (dataColumnas) {
        this.nombresColumnas = dataColumnas;
      }
    });

    // Suscripción a los datos de temas
    this.aragopediaSvc.queryTemasObserver.subscribe((data: any) => {
      if (!data) {
        this.loading = false;
        return;
      }
      
      this.loading = true;
      
      this.aragopediaSvc.getData(data).subscribe({
        next: (response: any) => {
          this.procesarRespuestaAPI(response);
        },
        error: (error) => {
          console.error('Error al obtener datos:', error);
          this.loading = false;
          // Usar datos de ejemplo como fallback
          this.inicializarDatosEjemplo();
        },
        complete: () => {
          this.loading = false;
        }
      });
    });
  }

  private inicializarDatosEjemplo() {
    // Datos de ejemplo en caso de error o falta de datos
    this.rows = [
      { name: 'Austin', gender: 'Male', company: 'Swimlane' },
      { name: 'Dany', gender: 'Male', company: 'KFC' },
      { name: 'Molly', gender: 'Female', company: 'Burger King' }
    ];
    
    this.columns = [
      { prop: 'name' }, 
      { name: 'Gender', prop: 'gender' }, 
      { name: 'Company', prop: 'company' }
    ];
    
    this.visibleRows = [...this.rows];
    this.totalItems = this.rows.length;
    this.handlePageChange(1);
  }

  private procesarRespuestaAPI(response: any) {
    if (!response || !response.results || !response.results.bindings) {
      console.error('Respuesta API inválida:', response);
      this.inicializarDatosEjemplo();
      return;
    }
    
    const dato = response.results.bindings[0];
    const datos = response.results.bindings;

    if (dato !== undefined) {
      this.configurarColumnasDesdeAPI(dato);
    } else {
      this.displayedColumns = [];
      this.columns = [];
    }

    this.linkDescargaJSON = this.aragopediaSvc.queryTemas;

    // Procesar datos para DESY
    this.procesarDatosParaTabla(datos);
  }

  private configurarColumnasDesdeAPI(dato: any) {
    this.displayedColumns = Object.keys(dato);

    // Preparar columnas para DESY
    this.columns = this.displayedColumns.map(col => {
      return { name: col, prop: col };
    });

    // Manejo especial para columnas nameRefPeriod y mes_y_ano
    this.manejarColumnasEspeciales();
    
    // Eliminar columnas específicas
    this.eliminarColumnasNoDeseadas();
  }

  private manejarColumnasEspeciales() {
    let nameRefPeriod = this.displayedColumns.includes('nameRefPeriod');
    let mes_y_ano = this.displayedColumns.includes('mes_y_ano');
    
    if (nameRefPeriod && mes_y_ano) {
      const index = this.displayedColumns.indexOf('nameRefPeriod');
      if (index !== -1) {
        this.displayedColumns.splice(index, 1);
        
        // También actualizar columns para DESY
        this.columns = this.columns.filter(col => col.prop !== 'nameRefPeriod');
      }
    }
  }

  private eliminarColumnasNoDeseadas() {
    const columnasParaEliminar = ['refArea', 'refPeriod'];
    
    columnasParaEliminar.forEach(colName => {
      const index = this.displayedColumns.indexOf(colName);
      if (index !== -1) {
        this.displayedColumns.splice(index, 1);
        
        // También actualizar columns para DESY
        this.columns = this.columns.filter(col => col.prop !== colName);
      }
    });
  }

  private procesarDatosParaTabla(datos: any[]) {
    // Procesar URLs en los datos
    datos.forEach((item: any) => {
      for (const key in item) {
        if (item[key] && item[key].value) {
          const element = item[key].value;
          
          if (typeof element === 'string' && element.startsWith('http')) {
            const index = element.lastIndexOf('/');
            item[key].value = element.substring(index + 1);
          }
        }
      }
    });

    // Preparar filas para DESY
    this.rows = datos.map((item: any, index: number) => {
      const row: any = { id: 'row-' + index };
      
      for (const key in item) {
        if (item[key] && item[key].value !== undefined) {
          row[key] = item[key].value;
        } else {
          row[key] = '';
        }
      }
      
      return row;
    });
    
    this.visibleRows = [...this.rows];
    this.totalItems = this.rows.length;
    this.handlePageChange(1);
    
    this.tablaConsulta = datos;
  }

  // Método para manejar la paginación
  handlePageChange(page: number) {
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.visibleRows.length);
    this.paginatedRows = this.visibleRows.slice(startIndex, endIndex);
  }
  
  // Método para manejar el recalculo de la tabla (ordenación y filtros)
  handleRecalculateTable(params: TableRecalculateParams) {
    if (!params) return;
    
    let rows = [...this.rows];
    
    // Aplicar filtros
    if (params.filters && params.filters.length > 0) {
      params.filters.forEach(filter => {
        if (filter.filterText && filter.filterText.trim()) {
          rows = rows.filter(row => {
            if (filter.columnIndex < 0 || filter.columnIndex >= this.columns.length) {
              return true; // Índice de columna inválido, no filtrar
            }
            
            const columnName = this.columns[filter.columnIndex].prop || 
                              (this.columns[filter.columnIndex].name || '').toLowerCase();
            
            if (!columnName || !row[columnName]) {
              return true; // No hay datos para filtrar
            }
            
            const cellValue = String(row[columnName] || '').toLowerCase();
            return cellValue.includes(filter.filterText.toLowerCase());
          });
        }
      });
    }
    
    // Aplicar ordenación
    if (params.sort) {
      const columnIndex = params.sort.columnIndex;
      
      if (columnIndex >= 0 && columnIndex < this.columns.length) {
        const columnName = this.columns[columnIndex].prop || 
                          (this.columns[columnIndex].name || '').toLowerCase();
        
        const isAsc = params.sort.order === 'asc';
        
        rows.sort((a, b) => {
          const aValue = String(a[columnName] || '');
          const bValue = String(b[columnName] || '');
          
          // Intentar ordenar numéricamente si son números
          if (this.isNumeric(aValue) && this.isNumeric(bValue)) {
            return isAsc ? 
              parseFloat(aValue) - parseFloat(bValue) : 
              parseFloat(bValue) - parseFloat(aValue);
          } else {
            // Ordenar alfabéticamente
            return isAsc ? 
              aValue.localeCompare(bValue) : 
              bValue.localeCompare(aValue);
          }
        });
        
        this.currentSort = params.sort;
      }
    }
    
    this.visibleRows = rows;
    this.totalItems = rows.length;
    this.handlePageChange(1);
  }

  isNumeric(value: any): boolean {
    if (!value && value !== 0) return false;
    return !isNaN(parseFloat(value)) && isFinite(value.toString().replace(/[€%]/g, '').trim());
  }

  getKeys(element: any, columna: string): string {
    if (!element || !columna) return '';
    return element?.[columna]?.value || '';
  }

  setColumnName(columna: string): string {
    if (!columna) return '';
    return "columna" + columna;
  }

  validateUrl(url: string): boolean {
    if (!url) return false;
    // Verifica que la URL comience con http o https
    return /^https?:\/\//i.test(url);
  }
}