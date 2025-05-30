import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-select-provincia',
  templateUrl: './provincias.component.html',
  styleUrls: ['./provincias.component.scss'],
})

export class SelectProvinciaComponent implements OnInit {
  constructor(private fb: FormBuilder, private router: Router) { }

  selected: string = '';
  formGroup!: FormGroup;
  selectedProvincia: string = '';
  provincias!: string[];
  filteredProvincias: any;
  myControlProvincias = new FormControl('');
  idLocalidad!: string;
  selectedId!: string;
  queryIdWikiData!: string;

  provinciasParsed: object[] = [
    {
      nombreCompleto: 'Diputación Provincial de Zaragoza',
      nombre: 'Zaragoza',
      url: 'https://opendata.aragon.es/recurso/sector-publico/organizacion/diputacion/7823',
      id: '7823',
      codigoIne: ''
    },
    {
      nombreCompleto: 'Diputación Provincial de Huesca',
      nombre: 'Huesca',
      url: 'https://opendata.aragon.es/recurso/sector-publico/organizacion/diputacion/7824',
      id: '7824',
      codigoIne: ''
    },
    {
      nombreCompleto: 'Diputación Provincial de Teruel',
      nombre: 'Teruel',
      url: 'https://opendata.aragon.es/recurso/sector-publico/organizacion/diputacion/7825',
      id: '7825',
      codigoIne: ''
    }
  ];

  ngOnInit(): void {
    this.initForm();
    this.getNames();
  }

  initForm() {
    this.formGroup = this.fb.group({
      'municipio': [this.selectedProvincia]
    })
    this.formGroup.get('municipio')?.valueChanges.subscribe(response => {
      this.selected = this.selectedProvincia;
      this.selectedProvincia = response;
      this.findSelectedId();
      this.filterData(response);
    });
  }

  // Función para manejar la selección desde el desy-option
  selectProvincia(provincia: string) {
    this.selectedProvincia = provincia;
    this.formGroup.get('municipio')?.setValue(provincia);
    this.findSelectedId();
  }

  // Extrae la búsqueda de ID a una función separada
  findSelectedId() {
    this.provinciasParsed.forEach((provincia: any) => {
      if (provincia.nombre.toLowerCase() === this.selectedProvincia.toLowerCase()) {
        this.selectedId = provincia.id;
      }
    });
    if (this.selectedId) {
      this.router.navigate(['detalles'], { queryParams: { tipo: 'diputacion', id: this.selectedId } })
    }
  }

  filterData(enteredData: any) {
    this.filteredProvincias = this.provincias.filter((item: any) => {
      return item.toLowerCase().indexOf(enteredData.toLowerCase()) > -1
    })
  }

  getNames() {
    this.provincias = ['Huesca', 'Zaragoza', 'Teruel'];
    this.filteredProvincias = this.provincias;
  }
}
