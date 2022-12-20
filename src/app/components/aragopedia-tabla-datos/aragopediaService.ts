import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

class Prefix {
    prefix!: string;
    namespace!: string;
}
@Injectable({
    providedIn: "root"
})


export class AragopediaService {
    constructor(private http: HttpClient) { }

    host: string = '';
    repository: string = '';
    PREFIXES: Array<Prefix> = [
        { prefix: '', namespace: '' }
    ]

    getTables() {
        let selectString = `
        
        `;
        let query = "select distinct ?value where {\n";
        query += "{ ?obs0 a qb:Observation .\n";

    }

    // getQuerySPARQL(includeLimit:any) {
    //     var query = "";
    //     var group = " GROUP by ?refArea ?nameRefArea ?refPeriod ";
    //     var typeTerritorialUnit = getTypeTerritorialUnit(selectedItemsType);
    //     if (refPeriodMonth) {
    //         query += 'select distinct ?refArea ?nameRefArea ?refPeriod (strafter(str(?refPeriod), "http://reference.data.gov.uk/id/month/") AS ?nameRefPeriod) ';
    //     } else 
    //     {
    //         query += 'select distinct ?refArea ?nameRefArea ?refPeriod (strafter(str(?refPeriod), "http://reference.data.gov.uk/id/year/") AS ?nameRefPeriod) ';
    //     }

    //     //console.log("DimensionList");
    //     //console.log(dimensionList);
    //     //console.log(dimensionList.length);
    //     var dimensionList = $("#queItemsHidden").html().split("@");
    //     var dimensionListRange = $("#queItemsHiddenRange").html().split("@");
    //     if (dimensionList.includes("http://opendata.aragon.es/def/iaest/dimension#mes-y-ano")) 
    //     {
    //         query = 'select ?refArea ?nameRefArea ';
    //         group = " GROUP by ?refArea ?nameRefArea ";
    //     }
    //     for (var j = 0; j < dimensionList.length; j++) {
    //         if (dimensionList[j] != "") {
    //             if ($("#queColumn" + j).prop('checked')) {
    //                 var aux = dimensionList[j].split("#");
    //                 var nomVar = "?dim" + j + " ";
    //                 if (aux.length == 2) {
    //                     nomVar = aux[1].replace(new RegExp('-', 'g'), '_') + " ";
    //                         // if first char is number => start with _ (avoid future error)
    //                     if (! isNaN(parseInt(nomVar.charAt(0)))) {
    //                         nomVar = "_" + nomVar;
    //                     }
    //                     if (aux[0].includes('medida'))
    //                     {
    //                         nomVar = "sum (?" + nomVar + ") as ?" + nomVar + " ";
    //                     }
    //                     else
    //                     {
    //                         if (nomVar.replace(/ /g, "") != "mes_y_ano")
    //                         {
    //                             nomVar = "?" + nomVar;
    //                             if (!aux[0].includes('medida'))
    //                             {
    //                                 group += nomVar + " ";
    //                             }
    //                         }	
    //                         else
    //                         {
    //                             nomVar = "concat((strafter(xsd:string(?mes_y_ano), ' ')), '/', ?mes_numero, '/01' ) As ?mes_y_ano ";
    //                             group += " ?mes_y_ano ";
    //                         }							
    //                     }
    //                 }
    //                 query += nomVar + " ";

    //             }
    //         }
    //     }
    //      query += " where {\n";
    //     query += " ?obs qb:dataSet <http://opendata.aragon.es/recurso/iaest/dataset/" + $("#idReportQue").val() + typeTerritorialUnit + ">.\n";
    //     var minYear = $('#cuandoDesdeYear').val();
    //     var maxYear = $('#cuandoHastaYear').val();
    //     query += " ?obs <http://purl.org/linked-data/sdmx/2009/dimension#refPeriod> ?refPeriod.\n";

    //     var uriPrefixUK_year = "<http://reference.data.gov.uk/id/year/";
    //     var uriPrefixUK_month = "<http://reference.data.gov.uk/id/month/";
    //     query += "FILTER (?refPeriod IN (";
    //     if (refPeriodMonth) {
    //         isFirst = true;
    //         for (var i = minYear; i <= maxYear; i++) {
    //             for (j = 1; j <= 9; j++) {
    //                 query += (isFirst ? '' : ',') + uriPrefixUK_month + i + "-0" + j +">";
    //                 isFirst = false;
    //             }
    //             for (j = 10; j <= 12; j++) {
    //                 query += ',' + uriPrefixUK_month + i + "-" + j +">";
    //             }
    //         }
    //     } else {
    //         query += uriPrefixUK_year + minYear + ">";
    //         minYear++;
    //         for (var i = (minYear); i <= maxYear; i++) {
    //             query += ',' + uriPrefixUK_year + i + ">";
    //         }
    //     }
    //     query += ")).\n";
    //     if($("#idReportQue").val() != "05-050105") {
    //         query += " ?obs <http://purl.org/linked-data/sdmx/2009/dimension#refArea> ?refArea.\n";
    //     }
    //     query += " ?refArea rdfs:label ?nameRefArea.";
    //     query += ' FILTER ( lang(?nameRefArea) = "es" ).';

    //     if (typeTerritorialUnit != "A") {
    //         if (selectedItems.length > 0) {
    //             var uriPrefix = "<http://opendata.aragon.es/recurso/territorio/" + selectedItemsType + "/";
    //             var arrayCode = getArrayNames(selectedItemsType);
    //             query += "FILTER (?refArea IN (";
    //             var currentItem = uriPrefix + getAragopediaURIfromName(arrayCode[selectedItems[0]], selectedItemsType) + ">";
    //             query += currentItem;
    //             for (var i = 1; i < selectedItems.length; i++) {
    //                 var currentItem = uriPrefix + getAragopediaURIfromName(arrayCode[selectedItems[i]], selectedItemsType) + ">"; 
    //                 query += "," + currentItem;
    //             }
    //             query += ")).\n";
    //         }
    //     }

    //     for (var j = 0; j < dimensionList.length; j++) {
    //         if (dimensionList[j] != "") 
    //         {
    //             var aux = dimensionList[j].split("#");
    //             var nomVar = "?dim" + j + " ";
    //             if (aux.length == 2) {
    //                 nomVar = aux[1].replace(new RegExp('-', 'g'), '_') + " ";
    //                     // if first char is number => start with _ (avoid future error)
    //                 if (! isNaN(parseInt(nomVar.charAt(0)))) {
    //                     nomVar = "_" + nomVar;
    //                 }
    //                 nomVar = "?" + nomVar;
    //             }

    //             if (dimensionList[j].indexOf("http://opendata.aragon.es/def/iaest/dimension") != -1) 
    //             {
    //                 if (dimensionListRange[j] == "http://www.w3.org/2004/02/skos/core#Concept") 
    //                 {								
    //                     query += "OPTIONAL { ?obs <" + dimensionList[j] + "> ?foo" + j + ".\n";
    //                     query += " ?foo" + j + " skos:prefLabel " + nomVar + " } .\n";
    //                 } 
    //                 else 
    //                 {
    //                     if (nomVar.replace(/ /g, "") != "?mes_y_ano")
    //                     {
    //                         query += "OPTIONAL {  ?obs <" + dimensionList[j] + "> " + nomVar + " } .\n";
    //                     }
    //                     else
    //                     {
    //                         query += "OPTIONAL {  ?obs <" + dimensionList[j] + "> ?mes_y_ano ";
    //                         query += "bind(" ;
    //                         query += " if(contains(str(?mes_y_ano ), 'Enero'),'01',";
    //                         query += " if(contains(str(?mes_y_ano ), 'Febrero'),'02',";
    //                         query += " if(contains(str(?mes_y_ano ), 'Marzo'),'03',";
    //                         query += " if(contains(str(?mes_y_ano ), 'Abril'),'04',";
    //                         query += " if(contains(str(?mes_y_ano ), 'Mayo'),'05',";
    //                         query += " if(contains(str(?mes_y_ano ), 'Junio'),'06',";
    //                         query += " if(contains(str(?mes_y_ano ), 'Julio'),'07',";
    //                         query += " if(contains(str(?mes_y_ano ), 'Agosto'),'08',";
    //                         query += " if(contains(str(?mes_y_ano ), 'Septiembre'),'09',";
    //                         query += " if(contains(str(?mes_y_ano ), 'Octubre'),'10',";
    //                         query += " if(contains(str(?mes_y_ano ), 'Noviembre'),'11',";
    //                         query += " if(contains(str(?mes_y_ano ), 'Diciembre'),'12',";
    //                         query += " '0'";
    //                         query += " )))))))))))) ";
    //                         query += " as ?mes_numero )"; 
    //                         query += " } .\n";	
    //                         group += " ?mes_numero ";
    //                     }
    //                 }
    //             } 
    //             else 
    //             {
    //                 query += "OPTIONAL {  ?obs <" + dimensionList[j] + "> " + nomVar + " } .\n";
    //             }
    //         }
    //     }
    //     if (dimensionList.includes("http://opendata.aragon.es/def/iaest/dimension#mes-y-ano")) 
    //     {	
    //         query += "} \n";
    //         query += group;	
    //         query += "ORDER BY DESC(?mes_y_ano )\n";
    //     }
    //     else
    //     {
    //         query += "} \n";
    //         query += group;		
    //         query += "ORDER BY ASC(?refArea) DESC(?refPeriod)\n";
    //     }
    //     if (includeLimit) 
    //     {
    //         query += "LIMIT 300\n";
    //     }
    //     console.log(query);
    //     return query;
    // }


    public getData(query: string): Observable<any> {
        return this.http.get(query);
    }


}