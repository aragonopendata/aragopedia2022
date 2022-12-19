import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AragopediaService } from 'src/app/components/aragopedia-tabla-datos/aragopediaService';

@Component({
  selector: 'app-municipios',
  templateUrl: './municipios.component.html',
  styleUrls: ['./municipios.component.scss']
})
export class MunicipiosComponent implements OnInit {

  constructor(private aragopediaSvc: AragopediaService, private fb: FormBuilder) { }

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
  municipiosParsed = this.temp || [{ nombre: '', url: '', id: '', codigoIne: '' }];
  municipiosURL: string = 'https://opendata.aragon.es/sparql?default-graph-uri=&query=select+str%28%3Fnombre%29%0D%0Awhere++%7B%0D%0A++++++++++++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23type%3E++%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2FGovernmentalAdministrativeRegion%3E+.+%0D%0A++++++++++++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23label%3E+%3Fnombre.%0D%0A++++++++++++%3Fs+a+dbo%3AMunicipality.%0D%0A%7D%0D%0Aorder+by+asc%28%3Fs%29+&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';

  ngOnInit(): void {
    this.initForm();
    this.getNames();

    this.queryIdWikiData = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+%3Fs+str%28%3Fnombre%29+%3Fid+%3Fclasif%0D%0Awhere++%7B%0D%0A++++++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23classification%3E+%3Fclasif.+%0D%0A++++++%3Fs+dc%3Aidentifier+%3Fid.+%0D%0A+++++%3Fs+dc%3Atitle+%3Fnombre.%0D%0A+++++VALUES+%3Fclasif+%7B%3Chttps%3A%2F%2Fwww.geonames.org%2Fontology%23A.ADM2%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fkos%2Fcomarca%3E+%3Chttps%3A%2F%2Fwww.geonames.org%2Fontology%23P.PPL%3E%7D%0D%0A%7D%0D%0Aorder+by+asc%28%3Fclasif%29+%3Fid+%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

    //Añado URL e ID a la lista de municipios
    this.aragopediaSvc.getData(this.queryIdWikiData).subscribe(data => {
      const listId = data.results.bindings;
      let index = 0;

      this.municipios.forEach((municipio: any) => {
        listId.forEach((element: any) => {
          if (municipio['callret-0'].value.toLowerCase() == element['callret-1'].value.toLowerCase()) {
            this.municipiosParsed[index] = { nombre: municipio['callret-0'].value, url: element.s.value, id: element.id.value, codigoIne: '' }
            index++;
          }
        });
      });
    });

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
      this.filterData(response);

    });
  }

  selectMunicipio() {
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
    });
  }

  filterData(enteredData: any) {
    this.filteredMunicipios = this.municipios.filter((item: any) => {
      return item['callret-0'].value.toLowerCase().indexOf(enteredData.toLowerCase()) > -1
    })
  }

  getNames() {
    this.aragopediaSvc.getData(this.municipiosURL).subscribe(response => {
      this.municipios = response.results.bindings;
      this.filteredMunicipios = response.results.bindings;
    })
  }

}