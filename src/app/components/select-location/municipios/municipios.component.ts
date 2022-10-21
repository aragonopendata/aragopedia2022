import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-select-municipio',
  templateUrl: './municipios.component.html',
  styleUrls: ['./municipios.component.scss'],
})

export class SelectMunicipioComponent implements OnInit {

  municipioSelected: string = '0';
  getMunicipio: string = '';

  capturar() {
    this.municipioSelected = this.getMunicipio
    console.log(this.getMunicipio);
  }


  myControlMunicipios = new FormControl('');

  municipios: string[] = ['Ababuj', 'Abanto', 'Abejuela', 'Abiego', 'Abizanda', 'Acered', 'Adahuesca', 'Aguarón', 'Aguatón', 'Aguaviva', 'Aguilar del Alfambra', 'Aguilón', 'Agón', 'Agüero', 'Ainzón', 'Alacón', 'Aladrén', 'Alagón', 'Alarba', 'Alba', 'Albalate de Cinca', 'Albalate del Arzobispo', 'Albalatillo', 'Albarracín', 'Albelda'];
  filteredMunicipios!: Observable<string[]>;

  ngOnInit(): void {
    this.filteredMunicipios = this.myControlMunicipios.valueChanges.pipe(
      startWith(''),
      map(val => this._filterMunicipios(val || '')),
    );
  }

  private _filterMunicipios(val: string): string[] {
    const formatVal = val.toLowerCase();

    return this.municipios.filter(option => option.toLowerCase().indexOf(formatVal) === 0);
  }

}