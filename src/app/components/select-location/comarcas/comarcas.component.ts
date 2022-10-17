import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-select-comarca',
  templateUrl: './comarcas.component.html',
  styleUrls: ['./comarcas.component.scss'],
})

export class SelectComarcaComponent implements OnInit {
  myControlComarcas = new FormControl('');

  comarcas: string[] = ['Alto Gállego', 'Andorra-Siera de Arcos', 'Aranda', 'Bajo Aragón', ' Bajo Aragón-Caspe / Baix Aragó-Casp', 'Bajo Cinca / Baix Cinca', 'Bajo Martín', 'Campo de Belchite', 'Campo de Borja', 'Campo de Cariñena', 'Campo de Daroca', 'Cinca Medio', 'Cinco Villas', 'Comunidad de Calatayud', 'Comunidad de Teruel', 'Cuencas Mineras', 'D.C. Zaragoza', 'Gúdar-Javalambre', 'Hoya de Huesca / Plana de Uesca', 'Jiloca', 'La Jacetania', 'La Litera / La Llitera', 'La Ribagorza', 'Los Monegros', 'Maestrazgo', 'Matarraña / Matarranya', 'Ribera Alta del Ebro', 'Ribera Baja del Ebro', 'Sierra del Albarracín', 'Sobrarbe', 'Somontano de Barbastro', 'Tarazona y el Moncayo', 'Valdejalón'];
  filteredComarcas!: Observable<string[]>;

  ngOnInit(): void {

    this.filteredComarcas = this.myControlComarcas.valueChanges.pipe(
      debounceTime(500),
      startWith(''),
      map(val => this._filterComarcas(val || '')),
    );
  }

  private _filterComarcas(val: string): string[] {
    const formatVal = val.toLowerCase();

    return this.comarcas.filter(option => option.toLowerCase().indexOf(formatVal) === 0);
  }

}