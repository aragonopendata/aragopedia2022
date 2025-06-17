import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class QueryLinkService {

  constructor(private router: Router) { }

  /**
   * Genera la URL de navegación para la página de resultados de query
   * @param queryUrl URL original de la query SPARQL (en formato HTML)
   * @param title Título descriptivo de la consulta
   * @param description Descripción opcional de la consulta
   * @param context Contexto del territorio (municipio, comarca, provincia)
   * @returns URL de navegación para usar con routerLink
   */
  generateQueryResultsUrl(
    queryUrl: string, 
    title: string, 
    description?: string, 
    context?: string
  ): string {
    const queryParams: any = {
      url: queryUrl,
      title: title
    };

    if (description) {
      queryParams.description = description;
    }

    if (context) {
      queryParams.context = context;
    }

    // Crear URL con query parameters
    const urlTree = this.router.createUrlTree(['/query-results'], {
      queryParams: queryParams
    });

    return this.router.serializeUrl(urlTree);
  }

  /**
   * Navega directamente a la página de resultados
   * @param queryUrl URL original de la query SPARQL
   * @param title Título descriptivo
   * @param description Descripción opcional
   * @param context Contexto del territorio
   */
  navigateToQueryResults(
    queryUrl: string, 
    title: string, 
    description?: string, 
    context?: string
  ): void {
    const queryParams: any = {
      url: queryUrl,
      title: title
    };

    if (description) {
      queryParams.description = description;
    }

    if (context) {
      queryParams.context = context;
    }

    this.router.navigate(['/query-results'], {
      queryParams: queryParams
    });
  }

  /**
   * Genera títulos descriptivos basados en el tipo de dato
   * @param dataType Tipo de dato de la query
   * @param territoryName Nombre del territorio
   * @returns Título descriptivo
   */
  generateTitle(dataType: string, territoryName?: string): string {
    const titles: { [key: string]: string } = {
      'sueloUrbano': 'Suelo urbano',
      'sueloRural': 'Suelo rural', 
      'habitantes': 'Población',
      'densidad': 'Densidad de población',
      'poligonos': 'Polígonos industriales',
      'explotacionesGanaderas': 'Explotaciones ganaderas',
      'incendios': 'Incendios forestales',
      'hectareasAfectadas': 'Hectáreas afectadas por incendios',
      'publicaciones': 'Menciones en publicaciones',
      'alojamientosHoteleros': 'Alojamientos hoteleros',
      'alojamientosRurales': 'Alojamientos de turismo rural',
      'municipios': 'Municipios en el territorio',
      'porcentajeSueloRural': 'Porcentaje de suelo rural',
      'porcentajeSueloUrbano': 'Porcentaje de suelo urbano',
      'esPoblado': 'Análisis demográfico',
      'edadMedia': 'Edad media de la población',
      'tieneOficinaComarcal': 'Oficinas comarcales',
      'tablaPoblacion': 'Evolución de la población',
      'miembrosPleno': 'Miembros del pleno',
      'datosContacto': 'Datos de contacto',
      'entidadesSingulares': 'Entidades singulares',
      'personasIlustres': 'Personas ilustres',
      'presupuestos': 'Información presupuestaria',
      'mascotas': 'Animales de compañía'
    };

    const baseTitle = titles[dataType] || 'Datos estadísticos';
    
    if (territoryName) {
      return `${baseTitle} - ${territoryName}`;
    }
    
    return baseTitle;
  }

  /**
   * Genera descripciones para las consultas
   * @param dataType Tipo de dato
   * @param territoryName Nombre del territorio
   * @returns Descripción
   */
  generateDescription(dataType: string, territoryName?: string): string {
    const descriptions: { [key: string]: string } = {
      'sueloUrbano': 'Superficie destinada a uso urbano expresada en hectáreas',
      'sueloRural': 'Superficie destinada a uso rural expresada en hectáreas',
      'habitantes': 'Datos demográficos de población por años',
      'densidad': 'Número de habitantes por kilómetro cuadrado',
      'poligonos': 'Polígonos industriales registrados en el territorio',
      'explotacionesGanaderas': 'Explotaciones ganaderas activas',
      'incendios': 'Incendios forestales registrados desde 2001',
      'hectareasAfectadas': 'Superficie forestal afectada por incendios',
      'publicaciones': 'Referencias del territorio en publicaciones oficiales',
      'alojamientosHoteleros': 'Establecimientos hoteleros registrados',
      'alojamientosRurales': 'Alojamientos de turismo rural',
      'municipios': 'Municipios que forman parte del territorio',
      'porcentajeSueloRural': 'Porcentaje que representa el suelo rural respecto al total de Aragón',
      'porcentajeSueloUrbano': 'Porcentaje que representa el suelo urbano respecto al total de Aragón',
      'esPoblado': 'Análisis comparativo de densidad poblacional',
      'edadMedia': 'Edad media de la población por sexo',
      'tieneOficinaComarcal': 'Disponibilidad de oficina comarcal',
      'tablaPoblacion': 'Serie histórica de evolución demográfica',
      'miembrosPleno': 'Composición del pleno territorial',
      'datosContacto': 'Información de contacto oficial',
      'entidadesSingulares': 'Entidades menores registradas',
      'personasIlustres': 'Personas destacadas nacidas en el territorio',
      'presupuestos': 'Información sobre presupuestos municipales',
      'mascotas': 'Registro de animales de compañía'
    };

    const baseDescription = descriptions[dataType] || 'Consulta de datos estadísticos';
    
    if (territoryName) {
      return `${baseDescription} correspondientes a ${territoryName}`;
    }
    
    return baseDescription;
  }
}
