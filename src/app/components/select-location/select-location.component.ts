import { Component, ViewChild } from '@angular/core';
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

export class SelectLocationComponent {
  constructor(private router: Router, public locationSvc: SelectLocationService) { }
  locationForm = new FormGroup('');

  searchValue!: string;

  provinciaSelected!: string;
  municipioSelected!: string;
  comarcaSelected!: string;
  idMunicipio!: string;
  idComarca!: string;
  idProvincia!: string;
  tipoLocalidad!: string;
  error: boolean = false;



  @ViewChild(SelectProvinciaComponent) provincia: any;
  @ViewChild(SelectMunicipioComponent) municipio: any;
  @ViewChild(SelectComarcaComponent) comarca: any;

  locationSelected(): void {
    this.provinciaSelected = this.provincia.selectedProvincia;
    this.comarcaSelected = this.comarca.selectedComarca;
    this.municipioSelected = this.municipio.selectedMunicipio;
    this.idMunicipio = this.municipio.id;
    this.idComarca = this.comarca.selectedId;
    this.idProvincia = this.provincia.selectedId;
    //////console.log(this.idMunicipio);


  }

  submit() {
    this.provinciaSelected = this.provincia.selectedProvincia;
    this.comarcaSelected = this.comarca.selectedComarca;
    this.municipioSelected = this.municipio.selectedMunicipio;
    this.idMunicipio = this.municipio.selectedId;
    this.idComarca = this.comarca.selectedId;
    this.idProvincia = this.provincia.selectedId;

    if (this.provinciaSelected === '' && this.comarcaSelected === '' && this.municipioSelected === '') {
      this.error = true;
    } else if (this.provinciaSelected !== '' && this.comarcaSelected === '' && this.municipioSelected === '') {
      this.tipoLocalidad = 'provincia';
      this.router.navigate(['detalles'], { queryParams: { tipo: this.tipoLocalidad, id: this.idProvincia } })
    } else if (this.comarcaSelected !== '' && this.municipioSelected === '') {
      this.tipoLocalidad = 'comarca';
      this.router.navigate(['detalles'], { queryParams: { tipo: this.tipoLocalidad, id: this.idComarca } })
    } else {
      this.tipoLocalidad = 'municipio';
      this.router.navigate(['detalles'], { queryParams: { tipo: this.tipoLocalidad, id: this.idMunicipio } })
      //////console.log(this.idMunicipio);

    }

  }

  goToAragon() {
    this.router.navigate(['detalles/aragon'], { queryParams: { tipo: 'comunidad', id: '2' } })
  }

}
