import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    if (arg === '' || arg.length < 3) return value;
    const results = [];
    for (const result of value) {
      if (result.title.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        results.push(result);
      }
    }
    return results;
  }

}