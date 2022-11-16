import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SelectLocationService } from '../select-location.service';


@Component({
  selector: 'app-select-municipio',
  templateUrl: './municipios.component.html',
  styleUrls: ['./municipios.component.scss'],
})

export class SelectMunicipioComponent implements OnInit {
  constructor(private locationSvc: SelectLocationService, private fb: FormBuilder) { }

  selected: string = '';
  formGroup!: FormGroup;
  selectedMunicipio: string = '';
  municipios: any = [];
  filteredMunicipios: any;
  myControlMunicipios = new FormControl('');

  ngOnInit(): void {
    this.initForm();
    this.getNames();
  }

  initForm() {
    this.formGroup = this.fb.group({
      'municipio': [this.selectedMunicipio]
    })
    this.formGroup.get('municipio')?.valueChanges.subscribe(response => {
      this.selectedMunicipio = response;
      this.selected = this.selectedMunicipio
      this.filterData(response);
    });
  }

  filterData(enteredData: any) {
    this.filteredMunicipios = this.municipios.filter((item: any) => {
      return item.toLowerCase().indexOf(enteredData.toLowerCase()) > -1
    })
  }

  getNames() {
    this.locationSvc.getMunicipios().subscribe(response => {
      this.municipios = response;
      this.filteredMunicipios = response;
    })
  }

}