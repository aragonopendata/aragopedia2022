import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-select-provincia',
  templateUrl: './provincias.component.html',
  styleUrls: ['./provincias.component.scss'],
})

export class SelectProvinciaComponent implements OnInit {
  myControlProvincias = new FormControl('');

  provincias: string[] = ['Huesca', 'Zaragoza', 'Teruel'];
  filteredProvincias!: Observable<string[]>;

  ngOnInit(): void {
    this.filteredProvincias = this.myControlProvincias.valueChanges.pipe(
      debounceTime(500),
      startWith(''),
      map(val => this._filterProvincias(val || '')),
    );

  }

  private _filterProvincias(val: string): string[] {
    const formatVal = val.toLowerCase();

    return this.provincias.filter(option => option.toLowerCase().indexOf(formatVal) === 0);
  }

}