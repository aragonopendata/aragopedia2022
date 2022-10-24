import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SelectComarcaComponent } from './comarcas/comarcas.component';
import { SelectMunicipioComponent } from './municipios/municipios.component';
import { SelectProvinciaComponent } from './provincias/provincias.component';


@Component({
  selector: 'app-select-location',
  templateUrl: './select-location.component.html',
  styleUrls: ['./select-location.component.scss'],
})

export class SelectLocationComponent {

  locationForm = new FormGroup('');

  provinciaSelected!: string;
  municipioSelected!: string;
  comarcaSelected!: string;

  @ViewChild(SelectProvinciaComponent) provincia: any;
  @ViewChild(SelectMunicipioComponent) municipio: any;
  @ViewChild(SelectComarcaComponent) comarca: any;

  ngAfterViewInit() {
    this.provinciaSelected = this.provincia.selected;
    this.municipioSelected = this.municipio.selected;
    this.comarcaSelected = this.comarca.selected;
  }

  locationSelected(): void {
    console.log('Provincia: ' + this.provincia.selected + '| Comarca: ' + this.comarca.selected + '| Municipio: ' + this.municipio.selected);
  }

}
