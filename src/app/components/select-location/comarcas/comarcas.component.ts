import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectLocationService } from '../select-location.service';


@Component({
  selector: 'app-select-comarca',
  templateUrl: './comarcas.component.html',
  styleUrls: ['./comarcas.component.scss'],
})

export class SelectComarcaComponent implements OnInit {
  constructor(private locationSvc: SelectLocationService, private fb: FormBuilder, private router: Router) { }

  selected: string = '';
  formGroup!: FormGroup;
  selectedComarca: string = '';
  comarcas: any = [];
  filteredComarcas: any;
  myControlComarcas = new FormControl('');
  idLocalidad!: string;
  selectedId!: string;
  queryIdWikiData!: string;
  temp = undefined;
  comarcasParsed = this.temp || [{ nombre: '', url: '', id: '', codigoIne: '' }]

  ngOnInit(): void {
    this.initForm();
    this.getNames();

    this.queryIdWikiData = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+%3Fs+str%28%3Fnombre%29+%3Fid+%3Fclasif%0D%0Awhere++%7B%0D%0A++++++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23classification%3E+%3Fclasif.+%0D%0A++++++%3Fs+dc%3Aidentifier+%3Fid.+%0D%0A+++++%3Fs+dc%3Atitle+%3Fnombre.%0D%0A+++++VALUES+%3Fclasif+%7B%3Chttps%3A%2F%2Fwww.geonames.org%2Fontology%23A.ADM2%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fkos%2Fcomarca%3E+%3Chttps%3A%2F%2Fwww.geonames.org%2Fontology%23P.PPL%3E%7D%0D%0A%7D%0D%0Aorder+by+asc%28%3Fclasif%29+%3Fid+%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

    //Añado URL e ID a la lista de municipios
    this.locationSvc.getData(this.queryIdWikiData).subscribe(data => {
      const listId = data.results.bindings;
      let index = 0;


      this.comarcas.forEach((comarca: string) => {
        listId.forEach((element: any) => {
          comarca.replace('La Litera/La Llitera', 'litera/la llitera, la');

          if (this.removeSpace(this.removeAccents(comarca.toLowerCase())) == this.replaceSlash(this.removeAccents(element['callret-1'].value.toLowerCase()))) {
            this.comarcasParsed[index] = {
              nombre: comarca,
              url: element.s.value,
              id: element.id.value,
              codigoIne: ''
            }
            index++;
          }
        });
      });
    });

  }

  initForm() {
    this.formGroup = this.fb.group({
      'municipio': [this.selectedComarca]
    })
    this.formGroup.get('municipio')?.valueChanges.subscribe(response => {

      this.selected = this.selectedComarca;
      this.selectedComarca = response;

      this.comarcasParsed.forEach((comarca: any) => {
        if (comarca.nombre === this.selectedComarca) {
          comarca.id[0] === '0' ? this.selectedId = comarca.id.substring(1) : this.selectedId = comarca.id;
        }
      })
      if (this.selectedId !== '') {
        this.router.navigate(['detalles'], { queryParams: { tipo: 'comarca', id: this.selectedId } })
      }
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
      const index = this.comarcas.indexOf('La Litera/La Llitera');
      this.comarcas[index] = 'litera/la llitera, la';
    })
  }

  removeAccents(str: any): any {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  removeSpace(str: string): string {
    const i = str.indexOf('/');
    if (str[i + 1] === ' ') {
      return str.replace('/ ', '/');
    }
    return str;
  }

  replaceSlash(str: string): string {
    return str
      .replace('ANDORRA/', 'ANDORRA-')
      .replace('andorra/', 'andorra-')
      .replace('Andorra/', 'Andorra-')
      .replace('La Litera/La Llitera', 'litera/la llitera, la')
  }

  fixNames(str: string): string {
    return str
      .replace('La Litera/La Llitera', 'litera/la llitera, la')
  }
}