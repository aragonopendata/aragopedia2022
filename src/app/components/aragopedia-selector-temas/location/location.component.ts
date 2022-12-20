import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComarcasComponent } from './comarcas/comarcas.component';
import { MunicipiosComponent } from './municipios/municipios.component';
import { ProvinciasComponent } from './provincias/provincias.component';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

  constructor() { }
  locationForm = new FormGroup('');

  searchValue!: string;

  provinciaSelected: string = '';
  municipioSelected: string = '';
  comarcaSelected: string = '';
  idMunicipio!: string;
  idComarca!: string;
  idProvincia!: string;
  tipoLocalidad!: string;
  error: boolean = false;
  provinciasActive: boolean = true;
  comarcasActive: boolean = true;
  municipiosActive: boolean = true;
  selected!: string;

  @ViewChild(ProvinciasComponent) provincia: any;
  @ViewChild(MunicipiosComponent) municipio: any;
  @ViewChild(ComarcasComponent) comarca: any;

  ngOnInit(): void {

  }


  // locationSelected(): void {
  //   this.provinciaSelected = this.provincia.selectedProvincia;
  //   this.comarcaSelected = this.comarca.selectedComarca;
  //   this.municipioSelected = this.municipio.selectedMunicipio;
  //   this.idMunicipio = this.municipio.id;
  //   this.idComarca = this.comarca.selectedId;
  //   this.idProvincia = this.provincia.selectedId;
  //   console.log('Provincia: ', this.provinciaSelected, 'Comarca: ', this.comarcaSelected, 'Municipio: ', this.municipioSelected, this.selected);
  // }

  selectProvincia() {
    this.provinciaSelected = this.provincia.selectedProvincia;
    this.idProvincia = this.provincia.selectedId;
    this.selected = this.provinciaSelected;
  }
  selectComarca() {
    this.comarcaSelected = this.comarca.selectedComarca;
    this.idComarca = this.comarca.selectedId;
    this.selected = this.comarcaSelected
  }
  selectMunicipio() {
    this.municipioSelected = this.municipio.selectedMunicipio;
    this.idMunicipio = this.municipio.selectedId;
    this.selected = this.municipioSelected;
  }

}
