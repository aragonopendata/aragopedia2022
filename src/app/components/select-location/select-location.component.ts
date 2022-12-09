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
  idMunicipio!: string;
  idComarca!: string;
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
    this.idMunicipio = this.municipio.id;
    this.idComarca = this.comarca.selectedId;
  }

  submit() {
    this.provinciaSelected = this.provincia.selectedProvincia;
    this.comarcaSelected = this.comarca.selectedComarca;
    this.municipioSelected = this.municipio.selectedMunicipio;
    this.idMunicipio = this.municipio.selectedId;
    this.idComarca = this.comarca.selectedId;

    console.log(this.idComarca);


    if (this.provinciaSelected === '' && this.comarcaSelected === '' && this.municipioSelected === '') {
      this.error = true;
    } else if (this.provinciaSelected !== '' && this.comarcaSelected === '' && this.municipioSelected === '') {
      this.tipoLocalidad = 'provincia';
      // this.router.navigate([`/${this.tipoLocalidad}/${this.provinciaSelected}`])
      // this.router.navigate([`/${this.tipoLocalidad}/${this.idMunicipio}`])
      this.router.navigate(['detalles'], { queryParams: { tipo: this.tipoLocalidad, id: this.idMunicipio } })
    } else if (this.comarcaSelected !== '' && this.municipioSelected === '') {
      this.tipoLocalidad = 'comarca';
      // this.router.navigate([`/${this.tipoLocalidad}/${this.comarcaSelected}`])
      // this.router.navigate([`/${this.tipoLocalidad}/${this.idComarca}`])
      this.router.navigate(['detalles'], { queryParams: { tipo: this.tipoLocalidad, id: this.idComarca } })
    } else {
      this.tipoLocalidad = 'municipio';
      // this.router.navigate([`/${this.tipoLocalidad}/${this.municipioSelected}`])
      // this.router.navigate([`/${this.tipoLocalidad}/${this.idMunicipio}`])
      this.router.navigate(['detalles'], { queryParams: { tipo: this.tipoLocalidad, id: this.idMunicipio } })
    }

  }

  goToAragon() {
    this.router.navigate(['detalles'], { queryParams: { tipo: 'comunidad', id: '2' } })
  }

}
