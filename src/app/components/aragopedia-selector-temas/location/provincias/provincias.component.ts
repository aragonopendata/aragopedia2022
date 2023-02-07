import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationServiceService } from '../location-service.service';

interface Provincia {
  nombreCompleto: string;
  nombre: string;
  id: string;
  url: string;
  codigoIne: string;
}

@Component({
  selector: 'app-provincias',
  templateUrl: './provincias.component.html',
  styleUrls: ['./provincias.component.scss']
})
export class ProvinciasComponent implements OnInit {



  constructor(private router: Router, private _route: ActivatedRoute, private fb: FormBuilder, public locationService: LocationServiceService) { }

  formControlProvincia = new FormControl('');

  selected: string = '';
  formGroup!: FormGroup;
  selectedProvincia!: string;
  provincias!: string[];
  filteredProvincias: any;
  idLocalidad!: string;
  selectedId: string = '';
  queryIdWikiData!: string;
  URLparameters: any = [];
  provinciasParsed: Provincia[] = [
    {
      nombreCompleto: 'Diputación Provincial de Zaragoza',
      nombre: 'Zaragoza',
      url: 'http://opendata.aragon.es/recurso/sector-publico/organizacion/diputacion/7823',
      id: '7823',
      codigoIne: ''
    },
    {
      nombreCompleto: 'Diputación Provincial de Huesca',
      nombre: 'Huesca',
      url: 'http://opendata.aragon.es/recurso/sector-publico/organizacion/diputacion/7824',
      id: '7824',
      codigoIne: ''
    },
    {
      nombreCompleto: 'Diputación Provincial de Teruel',
      nombre: 'Teruel',
      url: 'http://opendata.aragon.es/recurso/sector-publico/organizacion/diputacion/7825',
      id: '7825',
      codigoIne: ''
    }
  ];

  ngOnInit(): void {
    this.initForm();
    this.getNames();

    this.locationService.provinciaObserver.subscribe((provincia: any) => {
      this.selectedProvincia = provincia.nombre;
      console.log(this.selectedProvincia)
    });

    setTimeout(() => {

      this._route.queryParams.subscribe(params => {  //DE AQUI LEES LOS PARAMETROS DE LA URL PARAMETROS URL

        let tipoLocalidad = params['tipo'];

        if (tipoLocalidad === 'provincia') {
          let idDipu = params['id'];
          this.selectProvinciasFromURL(idDipu);
        }

      });
    }, 50);

  }

  initForm() {

    this.formControlProvincia.valueChanges.subscribe(response => {
      if (response !== '' && response !== undefined) {
        this.selectProvincia(response);
      }
    });

    this.formGroup = this.fb.group({
      'municipio': [this.selectedProvincia]
    })
    this.formGroup.get('municipio')?.valueChanges.subscribe(response => {
      this.selectedProvincia = response;
      this.provinciasParsed.forEach((provincia: any) => {
        if (provincia.nombre.toLowerCase() === this.selectedProvincia.toLowerCase()) {
          this.selectedId = provincia.id;
        }
      });
      this.filterData(response);
    });

  }

  selectProvincia(prov: any) {

    this.formGroup = this.fb.group({
      'municipio': [this.selectedProvincia]
    })
    //////console.log(prov)
    this.provinciasParsed.forEach((provincia: any) => {
      //////console.log("foreach: " + prov.nombre)
      if (prov.nombre && provincia.nombre.toLowerCase() === prov.nombre.toLowerCase()) {
        this.selectedProvincia = provincia.nombre;
        if (this.locationService.comarcaNombre != '' || this.locationService.municipioNombre != '' || this.locationService.provincia != prov.nombre) {

          this.locationService.changeComarca('', '');
          this.locationService.changeMunicipio('', '');
          this.locationService.changeProvincia(provincia);
        }
        //////console.log("foreach dentro: " + prov)
      }
    });
  }

  selectProvinciasFromURL(idDipu: any) {

    this.provinciasParsed.forEach((provincia: any) => {
      if (provincia.id === idDipu) {

        this.selectedProvincia = provincia.nombre;

        if (this.locationService.comarcaNombre != '' || this.locationService.municipioNombre != '' || this.locationService.provincia != idDipu) {
          this.locationService.changeComarca('', '');
          this.locationService.changeMunicipio('', '');
          this.locationService.changeProvincia(provincia);
        }
      }
    });
  }

  filterData(enteredData: any) {

    this.filteredProvincias = this.provincias.filter((item: any) => {
      return item.nombre.toLowerCase().indexOf(enteredData.toLowerCase()) > -1
    })
  }

  getNames() {
    this.provincias = ['Huesca', 'Zaragoza', 'Teruel'];
  }

}
