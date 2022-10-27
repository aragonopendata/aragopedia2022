import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SelectLocationService } from '../select-location.service';


@Component({
  selector: 'app-select-municipio',
  templateUrl: './municipios.component.html',
  styleUrls: ['./municipios.component.scss'],
})

export class SelectMunicipioComponent implements OnInit {
  constructor(public locationSvc: SelectLocationService) { }

  selected: string = '';
  myControlMunicipios = new FormControl('');

  municipios: string[] = ['Ababuj', 'Ababuj', 'Ababuj', 'Ababuj', 'Ababuj',]

  filteredMunicipios!: Observable<string[]>;

  ngOnInit(): void {
    this.filteredMunicipios = this.myControlMunicipios.valueChanges.pipe(
      startWith(''),
      map(val => this._filterMunicipios(val || '')),
    );

    // this.locationSvc.getMunicipios().subscribe(data => {
    //   const municipiosProv = data.results.bindings;
    //   for (let i = 0; i < municipiosProv.length; i++) {
    //     let municipio = municipiosProv[i].muni.value;
    //     this.municipios.push(municipio);
    //   }
    //   console.log(this.municipios);

    // });

  }

  private _filterMunicipios(val: string): string[] {
    const formatVal = val.toLowerCase();
    return this.municipios.filter(option => option.toLowerCase().indexOf(formatVal) === 0);
  }

}