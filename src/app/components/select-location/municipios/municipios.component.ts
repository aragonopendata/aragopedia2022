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
    this.initForm();
    this.getNames();

    this.queryIdWikiData = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+%3Fs+str%28%3Fnombre%29+%3Fid+%3Fclasif%0D%0Awhere++%7B%0D%0A++++++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23classification%3E+%3Fclasif.+%0D%0A++++++%3Fs+dc%3Aidentifier+%3Fid.+%0D%0A+++++%3Fs+dc%3Atitle+%3Fnombre.%0D%0A+++++VALUES+%3Fclasif+%7B%3Chttps%3A%2F%2Fwww.geonames.org%2Fontology%23A.ADM2%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fkos%2Fcomarca%3E+%3Chttps%3A%2F%2Fwww.geonames.org%2Fontology%23P.PPL%3E%7D%0D%0A%7D%0D%0Aorder+by+asc%28%3Fclasif%29+%3Fid+%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

    //Añado URL e ID a la lista de municipios
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

    //Añado código INE a a la lista de municipios
    // setTimeout(() => {
    //   this.municipiosParsed.forEach((municipio: any, index: number) => {
    //     const id = municipio.id;
    //     const queryUrlGetCodigoIne = `https:opendata.aragon.es/sparql?default-graph-uri=http%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2&query=select+%3Fwikidata+%3Faragopedia+where+%7B%0D%0A++%3Chttp%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fmunicipio%2F${id}%3E+skos%3AexactMatch+%3Fwikidata%3B%0D%0A+++owl%3AsameAs+%3Faragopedia.%0D%0A++FILTER%28regex%28%3Fwikidata%2C+%22http%3A%2F%2Fwww.wikidata.org%2F%22%29%29.%0D%0A++FILTER%28regex%28%3Faragopedia%2C+%22http%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fterritorio%2FMunicipio%2F%22%29%29.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`

    //     this.locationSvc.getData(queryUrlGetCodigoIne).subscribe(data => {
    //       const codigoIne = data.results.bindings[0].wikidata.value.split('/')[4];
    //       this.municipiosParsed[index].codigoIne = codigoIne;
    //     })
    //   })
    // }, 1000)
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
          console.log(municipio.id);

          this.selectedId = municipio.id;
        }
      })
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