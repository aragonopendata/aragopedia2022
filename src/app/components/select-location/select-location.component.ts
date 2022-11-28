import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectComarcaComponent } from './comarcas/comarcas.component';
import { SelectMunicipioComponent } from './municipios/municipios.component';
import { SelectProvinciaComponent } from './provincias/provincias.component';
import { SelectLocationService } from './select-location.service';



@Component({
  selector: 'app-select-location',
  templateUrl: './select-location.component.html',
  styleUrls: ['./select-location.component.scss'],
})

export class SelectLocationComponent implements OnInit {
  constructor(private router: Router, public locationSvc: SelectLocationService) { }
  locationForm = new FormGroup('');

  searchValue!: string;

  provinciaSelected!: string;
  municipioSelected!: string;
  comarcaSelected!: string;
  tipoLocalidad!: string;
  error: boolean = false;

  @ViewChild(SelectProvinciaComponent) provincia: any;
  @ViewChild(SelectMunicipioComponent) municipio: any;
  @ViewChild(SelectComarcaComponent) comarca: any;

  ngOnInit(): void {

  }


  locationSelected(): void {
    this.provinciaSelected = this.provincia.selectedProvincia;
    this.comarcaSelected = this.comarca.selectedComarca;
    this.municipioSelected = this.municipio.selectedMunicipio;
    console.log('Provincia: ' + this.provinciaSelected + '| Comarca: ' + this.comarcaSelected + '| Municipio: ' + this.municipioSelected);
  }

  submit() {
    this.provinciaSelected = this.provincia.selectedProvincia;
    this.comarcaSelected = this.comarca.selectedComarca;
    this.municipioSelected = this.municipio.selectedMunicipio;

    if (this.provinciaSelected === '' && this.comarcaSelected === '' && this.municipioSelected === '') {
      this.error = true;
    } else if (this.provinciaSelected !== '' && this.comarcaSelected === '' && this.municipioSelected === '') {
      this.tipoLocalidad = 'provincia';
      this.router.navigate([`/${this.tipoLocalidad}/${this.provinciaSelected}`])
    } else if (this.comarcaSelected !== '' && this.municipioSelected === '') {
      this.tipoLocalidad = 'comarca';
      this.router.navigate([`/${this.tipoLocalidad}/${this.comarcaSelected}`])
    } else {
      this.tipoLocalidad = 'municipio';
      this.router.navigate([`/${this.tipoLocalidad}/${this.municipioSelected}`])
    }

  }

}
