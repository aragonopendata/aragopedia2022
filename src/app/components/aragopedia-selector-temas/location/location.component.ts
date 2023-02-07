import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AragopediaService } from '../../aragopedia-tabla-datos/aragopediaService';
import { ComarcasComponent } from './comarcas/comarcas.component';
import { LocationServiceService } from './location-service.service';
import { MunicipiosComponent } from './municipios/municipios.component';
import { ProvinciasComponent } from './provincias/provincias.component';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  activeAragon: boolean = false;

  constructor(private router: Router, private _route: ActivatedRoute, public locationService: LocationServiceService, public aragopediaService: AragopediaService) { }
  locationForm = new FormGroup('');

  searchValue!: string;

  provinciaSelected: any = '';
  municipioSelected: any = '';
  comarcaSelected: any = '';
  idMunicipio!: any;
  idComarca!: any;
  idProvincia!: any;
  tipoLocalidad!: string;
  error: boolean = false;
  provinciasActive: boolean = true;
  comarcasActive: boolean = true;
  municipiosActive: boolean = true;
  selected!: string;
  URLcalled: boolean = false;

  @ViewChild(ProvinciasComponent) provincia: any;
  @ViewChild(MunicipiosComponent) municipio: any;
  @ViewChild(ComarcasComponent) comarca: any;

  ngOnInit(): void {

    ////console.log(this._route.queryParams);

    this._route.queryParams.subscribe(params => {
      if (!this.URLcalled) {
        if (params['tipo'] == 'provincia') {
          this.locationService.changeProvincia(this.locationService.provincia)
        } else if (params['tipo'] == 'comarca') {

          this.locationService.changeComarca(this.locationService.comarcaNombre, this.locationService.comarcaId)
        } else if (params['tipo'] == 'municipio') {

          this.locationService.changeMunicipio(this.locationService.municipioNombre, this.locationService.municipioId)
        } else if (params['tipo'] == 'comunidad') {

          this.goToAragon()
        }
      }
    })
    this.locationService.provinciaObserver.subscribe((provincia: any) => {

      //this.provincia = provincia;
      this.selectProvincia(provincia);

    });

    this.locationService.comarcaObserver.subscribe((comarca: any) => {

      this.selectComarca(this.locationService.comarcaNombre, this.locationService.comarcaId)

    })

    this.locationService.municipioObserver.subscribe((municipio: any) => {

      this.selectMunicipio(this.locationService.municipioNombre, this.locationService.municipioId)



      /*
            this.tipoLocalidad = params['tipo'];
      
            if (this.tipoLocalidad === 'provincia') {
              this.provincia.selectedProvincia = params['id'];
              this.provincia.selectedId = params['id'];
              //////console.log(this.provincia)
              this.selectProvincia();
            } else if (this.tipoLocalidad === 'comarca') {
              this.comarca.selectedComarca = params['id'];
              this.selectComarca();
            } else if (this.tipoLocalidad === 'municipio') {
              this.municipio.selectedMunicipio = params['id'];
              this.selectMunicipio();
            } 
      
            //////console.log(this.provinciaSelected);
            //////console.log(this.comarcaSelected);
            //////console.log(this.municipioSelected);
      */
    });
  }


  // locationSelected(): void {
  //   this.provinciaSelected = this.provincia.selectedProvincia;
  //   this.comarcaSelected = this.comarca.selectedComarca;
  //   this.municipioSelected = this.municipio.selectedMunicipio;
  //   this.idMunicipio = this.municipio.id;
  //   this.idComarca = this.comarca.selectedId;
  //   this.idProvincia = this.provincia.selectedId;
  //   //////console.log('Provincia: ', this.provinciaSelected, 'Comarca: ', this.comarcaSelected, 'Municipio: ', this.municipioSelected, this.selected);
  // }

  selectProvincia(provincia: any) {

    this.activeAragon = false

    this.provincia = provincia
    this.provinciaSelected = this.provincia.nombre;
    this.idProvincia = this.provincia.id;
    this.selected = this.provinciaSelected;

    this.comarcaSelected = '';
    this.idComarca = '';

    this.municipioSelected = '';
    this.idMunicipio = '';
    if (this.provinciaSelected !== '' && this.provinciaSelected !== undefined) {
      // ////console.log(this.provinciaSelected)
      this.updateTemas('Provincia')

    }
  }
  selectComarca(newComarcaName: any, newComarcaId: any) {

    this.activeAragon = false

    this.comarcaSelected = newComarcaName;
    this.idComarca = newComarcaId;
    this.selected = this.comarcaSelected

    this.provinciaSelected = '';
    this.idProvincia = '';

    this.municipioSelected = '';
    this.idMunicipio = '';
    if (this.comarcaSelected != '') {
      // ////console.log(this.comarcaSelected)
      this.updateTemas('Comarca')
    }
  }
  selectMunicipio(newMunicipioName: any, newMunicipioId: any) {

    this.activeAragon = false

    this.municipioSelected = newMunicipioName;
    this.idMunicipio = newMunicipioId;
    this.selected = this.municipioSelected;

    this.comarcaSelected = '';
    this.idComarca = '';

    this.provinciaSelected = '';
    this.idProvincia = '';

    ////console.log(this.aragopediaService.lastZona)

    if (this.municipioSelected != '') {
      this.aragopediaService.lastZona = this.municipioSelected;
      this.updateTemas('Municipio')
    }
  }

  updateTemas(tipoZona: string) {
    this.aragopediaService.changeTriggerSubmitObserver(tipoZona);
  }

  goToAragon() {
    this.municipioSelected = '';
    this.idMunicipio = '';
    this.selected = '';

    this.comarcaSelected = '';
    this.idComarca = '';

    this.provinciaSelected = '';
    this.idProvincia = '';

    this.locationService.changeMunicipio('', '');
    this.locationService.changeProvincia('');
    this.locationService.changeComarca('', '');

    this.activeAragon = true
    this.updateTemas('ComunidadAutonoma')

    //this.router.navigate(['detalles/aragon'], { queryParams: { tipo: 'comunidad', id: '2' } })
  }


}
