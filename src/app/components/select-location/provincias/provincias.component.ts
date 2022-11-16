import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SelectLocationService } from '../select-location.service';


@Component({
  selector: 'app-select-provincia',
  templateUrl: './provincias.component.html',
  styleUrls: ['./provincias.component.scss'],
})

export class SelectProvinciaComponent implements OnInit {
  constructor(private fb: FormBuilder) { }

  selected: string = '';
  formGroup!: FormGroup;
  selectedProvincia: string = '';
  provincias!: string[];
  filteredProvincias: any;
  myControlProvincias = new FormControl('');

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
      this.selected = this.selectedProvincia
      this.filterData(response);
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