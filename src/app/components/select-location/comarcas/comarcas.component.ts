import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SelectLocationService } from '../select-location.service';


@Component({
  selector: 'app-select-comarca',
  templateUrl: './comarcas.component.html',
  styleUrls: ['./comarcas.component.scss'],
})

export class SelectComarcaComponent implements OnInit {
  constructor(private locationSvc: SelectLocationService, private fb: FormBuilder) { }

  selected: string = '';
  formGroup!: FormGroup;
  selectedComarca: string = '';
  comarcas: any = [];
  filteredComarcas: any;
  myControlComarcas = new FormControl('');

  ngOnInit(): void {
    this.initForm();
    this.getNames();
  }

  initForm() {
    this.formGroup = this.fb.group({
      'municipio': [this.selectedComarca]
    })
    this.formGroup.get('municipio')?.valueChanges.subscribe(response => {
      this.selectedComarca = response;
      this.selected = this.selectedComarca;
      this.filterData(response);
    });
  }

  filterData(enteredData: any) {
    this.filteredComarcas = this.comarcas.filter((item: any) => {
      return item.toLowerCase().indexOf(enteredData.toLowerCase()) > -1
    })
  }

  getNames() {
    this.locationSvc.getComarcas().subscribe(response => {
      this.comarcas = response;
      this.filteredComarcas = response;
    })
  }

}