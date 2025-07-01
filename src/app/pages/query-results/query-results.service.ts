import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QueryResultsService {

  constructor(private http: HttpClient) { }

  /**
   * Ejecuta una query SPARQL y retorna los resultados en formato JSON
   */
  executeQuery(queryUrl: string): Observable<any> {
    return this.http.get(queryUrl);
  }

  /**
   * Convierte una URL de query HTML a formato JSON para obtener datos estructurados
   */
  convertHtmlToJsonUrl(htmlUrl: string): string {
    return htmlUrl.replace('text%2Fhtml', 'application%2Fsparql-results%2Bjson');
  }

  /**
   * Decodifica y extrae la query SPARQL original desde una URL
   */
  extractSparqlQuery(queryUrl: string): string {
    try {
      const url = new URL(queryUrl);
      const queryParam = url.searchParams.get('query');
      
      if (queryParam) {
        return decodeURIComponent(queryParam)
          .replace(/\+/g, ' ')
          .trim();
      }
      
      return 'Query SPARQL no encontrada en la URL';
    } catch (error) {
      console.error('Error al extraer query SPARQL:', error);
      return 'Error al decodificar la query SPARQL';
    }
  }

  

  /**
   * Formatea la query SPARQL para mejor legibilidad
   */
  formatSparqlQuery(query: string): string {
    return query
      .replace(/select/gi, 'SELECT')
      .replace(/where/gi, 'WHERE')
      .replace(/from/gi, 'FROM')
      .replace(/order by/gi, 'ORDER BY')
      .replace(/group by/gi, 'GROUP BY')
      .replace(/limit/gi, 'LIMIT')
      .replace(/filter/gi, 'FILTER')
      .replace(/optional/gi, 'OPTIONAL')
      .replace(/prefix/gi, 'PREFIX')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Procesa los resultados SPARQL para generar datos de tabla
   */
  processResultsForTable(data: any): { columns: string[], rows: any[] } {
    if (!data || !data.results || !data.results.bindings || data.results.bindings.length === 0) {
      return { columns: [], rows: [] };
    }
  
    const bindings = data.results.bindings;
    const columns = Object.keys(bindings[0]);
    
    const rows = bindings.map((binding: any) => {
      const row: any = {};
      columns.forEach(col => {
        if (binding[col]) {
          const originalData = {
            value: binding[col].value,
            type: binding[col].type || 'literal',
            datatype: binding[col].datatype
          };
          
          // Aplicar formateo directamente aquí
          const formattedValue = this.formatCellValueForDisplay(originalData);
          
          row[col] = {
            value: formattedValue, // Usar el valor formateado
            originalValue: binding[col].value, // Guardar el valor original por si acaso
            type: binding[col].type || 'literal',
            datatype: binding[col].datatype
          };
        } else {
          row[col] = { value: '', type: 'literal' };
        }
      });
      return row;
    });
  
    return { columns, rows };
  }

  

  /**
   * Formatea un valor específicamente para mostrar en la tabla
   */
  private formatCellValueForDisplay(cellData: any): string {
    if (!cellData || cellData.value === null || cellData.value === undefined) {
      return '';
    }
  
    const value = cellData.value.toString();
    
    // Si está vacío, devolver cadena vacía
    if (value.trim() === '') {
      return '';
    }
  
    // Si es una URL, mostrarla completa (OPCIÓN 1)
    if (this.isUrl(value)) {
      return value; // Mostrar la URL completa sin modificar
    }
  
    // Si es un número, formatearlo
    if (cellData.type === 'literal' && cellData.datatype && 
        (cellData.datatype.includes('integer') || 
         cellData.datatype.includes('decimal') || 
         cellData.datatype.includes('double') ||
         cellData.datatype.includes('float'))) {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        return num.toLocaleString('es-ES', {
          maximumFractionDigits: 2,
          minimumFractionDigits: 0
        });
      }
    }
  
    // Si es una fecha, formatearla
    if (cellData.datatype && cellData.datatype.includes('date')) {
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('es-ES');
        }
      } catch {
        // Si no se puede parsear como fecha, devolver valor original
      }
    }
  
    // Para texto normal, limitar longitud si es muy largo
    if (value.length > 150) {
      return value.substring(0, 147) + '...';
    }
  
    return value;
  }

  /**
   * Formatea el nombre de una columna para mostrar en la tabla
   */
  formatColumnName(columnName: string): string {
    // Mapa de nombres específicos para mejorar la legibilidad
    const columnMappings: { [key: string]: string } = {
      'nameRefArea': 'Territorio',
      'nameRefPeriod': 'Año',
      'refArea': 'Área de Referencia',
      'refPeriod': 'Período',
      'poblac': 'Población',
      'densidad': 'Densidad',
      'sueloUrbano': 'Suelo Urbano',
      'sueloRural': 'Suelo Rural',
      'hectareasAfectadas': 'Hectáreas Afectadas',
      'incendios': 'Incendios',
      'numeroEdificios': 'Número de Edificios',
      'superficie': 'Superficie',
      'edadMedia': 'Edad Media',
      'explotaciones': 'Explotaciones',
      'alojamientos': 'Alojamientos',
      'telefono': 'Teléfono',
      'email': 'Email',
      'direccion': 'Dirección',
      'codPostal': 'Código Postal',
      'nombrePersona': 'Nombre',
      'cargo': 'Cargo',
      'nombreEntidad': 'Entidad',
      'title': 'Título',
      'url': 'URL',
      'resumen': 'Resumen',
      'tema': 'Tema'
    };

    // Verificar si existe un mapeo específico
    if (columnMappings[columnName]) {
      return columnMappings[columnName];
    }

    // Formateo genérico
    return columnName
      .replace(/([A-Z])/g, ' $1') // Separar palabras camelCase
      .replace(/^./, str => str.toUpperCase()) // Capitalizar primera letra
      .replace(/_/g, ' ') // Reemplazar guiones bajos por espacios
      .replace(/\b\w/g, l => l.toUpperCase()) // Capitalizar cada palabra
      .replace(/\s+/g, ' ') // Normalizar espacios
      .trim();
  }

  /**
   * Determina si un valor es una URL
   */
  isUrl(value: string): boolean {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Extrae un nombre legible de una URL
   */
  extractReadableNameFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(part => part.length > 0);
      
      if (pathParts.length > 0) {
        const lastPart = pathParts[pathParts.length - 1];
        
        // Decodificación múltiple para manejar casos como "Arag%C3%B3n"
        let decodedName = lastPart;
        
        // Aplicar decodeURIComponent múltiples veces si es necesario
        try {
          decodedName = decodeURIComponent(decodedName);
          // Verificar si todavía contiene caracteres codificados y decodificar de nuevo
          if (decodedName.includes('%')) {
            decodedName = decodeURIComponent(decodedName);
          }
        } catch (e) {
          // Si falla la decodificación, usar el valor original
          decodedName = lastPart;
        }
        
        // Limpiar y formatear el nombre
        return decodedName
          .replace(/_/g, ' ')
          .replace(/%20/g, ' ')
          .replace(/([a-z])([A-Z])/g, '$1 $2') // Separar camelCase
          .trim();
      }
      
      return urlObj.hostname;
    } catch {
      return url;
    }
  }

  /**
 * Formatea un valor para mostrar en la tabla
 */
  formatCellValue(cellData: any): string {
    if (!cellData || cellData.value === null || cellData.value === undefined) {
      return '';
    }

    const value = cellData.value.toString();
    
    // Si está vacío, devolver cadena vacía
    if (value.trim() === '') {
      return '';
    }

    // Si es una URL, mostrarla completa en lugar de extraer el nombre
    if (this.isUrl(value)) {
      return value; // Devolver la URL completa
    }

    // Si es un número, formatearlo
    if (cellData.type === 'literal' && cellData.datatype && 
        (cellData.datatype.includes('integer') || 
        cellData.datatype.includes('decimal') || 
        cellData.datatype.includes('double') ||
        cellData.datatype.includes('float'))) {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        // Formatear con separadores de miles estilo español
        return num.toLocaleString('es-ES', {
          maximumFractionDigits: 2,
          minimumFractionDigits: 0
        });
      }
    }

    // Si es una fecha, formatearla
    if (cellData.datatype && cellData.datatype.includes('date')) {
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('es-ES');
        }
      } catch {
        // Si no se puede parsear como fecha, devolver valor original
      }
    }

    // Para texto normal, limitar longitud si es muy largo
    if (value.length > 100) {
      return value.substring(0, 97) + '...';
    }

    return value;
  }

  /**
   * Obtiene la URL original de un valor si es una URL
   */
  getOriginalUrl(cellData: any): string {
    if (cellData && cellData.value && this.isUrl(cellData.value)) {
      return cellData.value;
    }
    return '';
  }

  /**
   * Determina si una celda debería mostrarse como enlace
   */
  shouldDisplayAsLink(cellData: any): boolean {
    return cellData && cellData.value && this.isUrl(cellData.value);
  }
}