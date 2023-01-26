import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectLocationService } from '../select-location.service';


@Component({
  selector: 'app-select-municipio',
  templateUrl: './municipios.component.html',
  styleUrls: ['./municipios.component.scss'],
})

export class SelectMunicipioComponent implements OnInit {
  constructor(private locationSvc: SelectLocationService, private fb: FormBuilder, private router: Router) { }

  show: boolean = false;
  selected: string = '';
  selectedId!: string;
  formGroup!: FormGroup;
  selectedMunicipio: string = '';
  municipios: any = [];
  filteredMunicipios: any;
  myControlMunicipios = new FormControl('');
  temp = undefined;

  idLocalidad!: string;
  queryUrlGetCodigoIne!: string;
  queryIdWikiData!: string;
  municipiosParsed = this.temp || [{ nombre: '', url: '', id: '', codigoIne: '' }]

  ngOnInit(): void {

    this.queryIdWikiData = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+%3Fs+str%28%3Fnombre%29+%3Fid+%3Fclasif%0D%0Awhere++%7B%0D%0A++++++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23classification%3E+%3Fclasif.+%0D%0A++++++%3Fs+dc%3Aidentifier+%3Fid.+%0D%0A+++++%3Fs+dc%3Atitle+%3Fnombre.%0D%0A+++++VALUES+%3Fclasif+%7B%3Chttps%3A%2F%2Fwww.geonames.org%2Fontology%23A.ADM2%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fkos%2Fcomarca%3E+%3Chttps%3A%2F%2Fwww.geonames.org%2Fontology%23P.PPL%3E%7D%0D%0A%7D%0D%0Aorder+by+asc%28%3Fclasif%29+%3Fid+%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

    //Añado URL e ID a la lista de municipios

    setTimeout(() => {
      this.locationSvc.getData(this.queryIdWikiData).subscribe(data => {
        const listId = data.results.bindings;

        let index = 0;
        this.municipios.forEach((municipio: string) => {
          listId.forEach((element: any) => {
            if (municipio.toLowerCase() == element['callret-1'].value.toLowerCase()) {
              this.municipiosParsed[index] = { nombre: municipio, url: element.s.value, id: element.id.value, codigoIne: '' }
              index++;
            }
          });
        });
      });
      this.show = true;
    }, 500);

    this.initForm();
    this.getNames();
  }

  initForm() {
    this.formGroup = this.fb.group({
      'municipio': [this.selectedMunicipio]
    })
    this.formGroup.get('municipio')?.valueChanges.subscribe(response => {
      this.selectedMunicipio = response;
      this.selected = this.selectedMunicipio;
      this.municipiosParsed.forEach((municipio: any) => {
        if (municipio.nombre === this.selectedMunicipio) {
          this.selectedId = municipio.id;
        }
      })
      if (this.selectedId !== '') {
        this.router.navigate(['detalles'], { queryParams: { tipo: 'municipio', id: this.selectedId } })
      }
      this.filterData(response);
    });
  }

  filterData(enteredData: any) {
    this.filteredMunicipios = this.municipios.filter((item: any) => {
      if (item.toLowerCase().includes('(la)')) {
        let stringOrdenado = 'La ';
        stringOrdenado += item.toLowerCase().substring(0, item.toLowerCase().indexOf('(la)'));
        item = stringOrdenado;
      } else if (item.toLowerCase().includes('(el)')) {
        let stringOrdenado = 'El ';
        stringOrdenado += item.toLowerCase().substring(0, item.toLowerCase().indexOf('(el)'));
        item = stringOrdenado;
      } else if (item.toLowerCase().includes('(los)')) {
        let stringOrdenado = 'Los ';
        stringOrdenado += item.toLowerCase().substring(0, item.toLowerCase().indexOf('(los)'));
        item = stringOrdenado;
      } else if (item.toLowerCase().includes('(las)')) {
        let stringOrdenado = 'Las ';
        stringOrdenado += item.toLowerCase().substring(0, item.toLowerCase().indexOf('(las)'));
        item = stringOrdenado;
      }
      return this.removeAccents(item.toLowerCase()).indexOf(enteredData.toLowerCase()) > -1
    });
  }

  getNames() {
    this.locationSvc.getMunicipios().subscribe(response => {
      this.municipios = response;
      this.filteredMunicipios = response;
    });
  }
  removeAccents(str: any): any {
    // return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const acentos: any = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u' };
    return str.split('').map((letra: any) => acentos[letra] || letra).join('').toString();
  }

}