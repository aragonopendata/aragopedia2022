import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-provincias',
  templateUrl: './provincias.component.html',
  styleUrls: ['./provincias.component.scss']
})
export class ProvinciasComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  selected: string = '';
  formGroup!: FormGroup;
  selectedProvincia: string = '';
  provincias!: string[];
  filteredProvincias: any;
  myControlProvincias = new FormControl('');
  idLocalidad!: string;
  selectedId: string = '';
  queryIdWikiData!: string;
  // temp = undefined;
  provinciasParsed: object[] = [
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
  }

  initForm() {
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

  selectProvincia() {
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
    });
  }

  filterData(enteredData: any) {
    this.filteredProvincias = this.provincias.filter((item: any) => {
      return item.toLowerCase().indexOf(enteredData.toLowerCase()) > -1
    })
  }

  getNames() {
    this.provincias = ['Huesca', 'Zaragoza', 'Teruel'];
  }

}
