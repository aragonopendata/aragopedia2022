import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryResultsService } from './query-results.service';

@Component({
  selector: 'app-query-results',
  templateUrl: './query-results.component.html',
  styleUrls: ['./query-results.component.scss']
})
export class QueryResultsComponent implements OnInit {

  // Parámetros de entrada
  queryUrl: string = '';
  title: string = '';
  description: string = '';
  context: string = ''; // municipio, comarca, provincia

  // Estado de carga
  loading: boolean = false;
  error: string = '';

  // Datos de la query
  sparqlQuery: string = '';
  tableData: { columns: string[], rows: any[] } = { columns: [], rows: [] };
  totalResults: number = 0;

  // Estado de la interfaz
  showQuery: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private queryService: QueryResultsService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.queryUrl = params['url'] || '';
      this.title = params['title'] || 'Resultados de consulta';
      this.description = params['description'] || '';
      this.context = params['context'] || '';

      if (this.queryUrl) {
        this.loadQueryResults();
      } else {
        this.error = 'URL de consulta no proporcionada';
      }
    });
  }

  /**
   * Carga y procesa los resultados de la query SPARQL
   */
  private loadQueryResults(): void {
    this.loading = true;
    this.error = '';

    // Extraer y formatear la query SPARQL
    this.sparqlQuery = this.queryService.formatSparqlQuery(
      this.queryService.extractSparqlQuery(this.queryUrl)
    );

    // Convertir URL a formato JSON para obtener datos estructurados
    const jsonUrl = this.queryService.convertHtmlToJsonUrl(this.queryUrl);

    // Ejecutar la query
    this.queryService.executeQuery(jsonUrl).subscribe({
      next: (data) => {
        this.processResults(data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al ejecutar query:', error);
        this.error = 'Error al cargar los resultados de la consulta';
        this.loading = false;
      }
    });
  }

  /**
   * Procesa los resultados de la query para mostrar en tabla
   */
  private processResults(data: any): void {
    // Si no hay datos, crear una tabla con valor "0"
    if (!data || !data.results || !data.results.bindings || data.results.bindings.length === 0) {
      this.createEmptyTableWithZero();
      this.totalResults = 1; // Contar como 1 resultado para que se muestre la tabla
      return;
    }

    // Procesar resultados normalmente
    this.tableData = this.queryService.processResultsForTable(data);
    this.totalResults = this.tableData.rows.length;
  }

  /**
   * Crea una tabla con una sola celda que muestra "0" cuando no hay resultados
   */
  private createEmptyTableWithZero(): void {
    // Determinar qué columna usar basándose en el tipo de query
    const columnName = this.determineColumnNameForEmptyResult();
    
    this.tableData = {
      columns: [columnName],
      rows: [{
        [columnName]: {
          value: '0',
          type: 'literal',
          datatype: 'http://www.w3.org/2001/XMLSchema#integer'
        }
      }]
    };
  }

  /**
   * Determina el nombre de columna apropiado cuando no hay resultados
   */
  private determineColumnNameForEmptyResult(): string {
    // Intentar determinar el tipo de query basándose en el título o la query misma
    const titleLower = this.title.toLowerCase();
    const queryLower = this.sparqlQuery.toLowerCase();
    
    // Mapear títulos a nombres de columna apropiados
    if (titleLower.includes('población') || titleLower.includes('habitantes')) {
      return 'poblacion';
    } else if (titleLower.includes('incendios')) {
      return 'incendios';
    } else if (titleLower.includes('polígonos') || titleLower.includes('poligonos')) {
      return 'poligonos';
    } else if (titleLower.includes('alojamientos')) {
      return 'alojamientos';
    } else if (titleLower.includes('explotaciones')) {
      return 'explotaciones';
    } else if (titleLower.includes('hectáreas') || titleLower.includes('hectareas')) {
      return 'hectareas';
    } else if (titleLower.includes('superficie') || titleLower.includes('suelo')) {
      return 'superficie';
    } else if (titleLower.includes('municipios')) {
      return 'municipios';
    } else if (titleLower.includes('mascotas') || titleLower.includes('animales')) {
      return 'mascotas';
    } else if (titleLower.includes('menciones') || titleLower.includes('publicaciones')) {
      return 'menciones';
    } else if (queryLower.includes('count')) {
      return 'total';
    } else {
      // Valor por defecto
      return 'resultado';
    }
  }

  /**
   * Alterna la visibilidad de la query SPARQL
   */
  toggleQueryVisibility(): void {
    this.showQuery = !this.showQuery;
  }

  /**
   * Copia la query SPARQL al clipboard
   */
  copyQueryToClipboard(): void {
    navigator.clipboard.writeText(this.sparqlQuery).then(() => {
      // Aquí podrías mostrar un toast de confirmación
      console.log('Query copiada al clipboard');
    }).catch(err => {
      console.error('Error al copiar query:', err);
    });
  }

  /**
   * Navega de vuelta a la página anterior
   */
  goBack(): void {
    window.history.back();
  }

  /**
   * Navega a la página de inicio
   */
  goHome(): void {
    this.router.navigate(['/']);
  }

  /**
   * Abre la URL original de la query en una nueva pestaña
   */
  openOriginalQuery(): void {
    window.open(this.queryUrl, '_blank');
  }

  /**
   * Determina el contexto para los breadcrumbs
   */
  getContextName(): string {
    switch (this.context) {
      case 'municipio':
        return 'Municipio';
      case 'comarca':
        return 'Comarca';
      case 'provincia':
      case 'diputacion':
        return 'Provincia';
      default:
        return 'Territorio';
    }
  }

  /**
   * Exporta los resultados a CSV
   */
  exportToCSV(): void {
    // Siempre permitir exportación, incluso si solo hay un "0"
    const csvContent = this.generateCSVContent();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${this.title.replace(/\s+/g, '_')}_resultados.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  /**
   * Genera el contenido CSV
   */
  private generateCSVContent(): string {
    const headers = this.tableData.columns.map(col => this.queryService.formatColumnName(col));
    const csvRows = [headers.join(';')];

    this.tableData.rows.forEach(row => {
      const values = this.tableData.columns.map(col => {
        const cellValue = this.queryService.formatCellValue(row[col]);
        return `"${cellValue.replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(';'));
    });

    return csvRows.join('\n');
  }
}