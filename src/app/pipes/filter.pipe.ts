import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    if (this.removeAccents(arg) === '' || arg.length < 3) return value;
    const results = [];
    for (const result of value) {
      if (this.removeAccents(result.title.toLowerCase()).indexOf(this.removeAccents(arg.toLowerCase())) > -1) {
        results.push(result);
      }
    }
    return results;
  }

  removeAccents(str: any): any {
    const acentos: any = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'Á': 'A', 'É': 'É', 'Í': 'I', 'Ó': 'O', 'Ú': 'U' };
    return str.split('').map((letra: any) => acentos[letra] || letra).join('').toString();
  }

}

