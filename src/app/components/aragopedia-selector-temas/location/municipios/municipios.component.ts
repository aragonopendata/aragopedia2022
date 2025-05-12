import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { param } from 'jquery';
import { AragopediaService } from 'src/app/components/aragopedia-tabla-datos/aragopediaService';
import { LocationServiceService } from '../location-service.service';

@Component({
  selector: 'app-municipios',
  templateUrl: './municipios.component.html',
  styleUrls: ['./municipios.component.scss']
})
export class MunicipiosComponent implements OnInit {

  constructor(private router: Router, private _route: ActivatedRoute, private aragopediaSvc: AragopediaService, private fb: FormBuilder, public locationService: LocationServiceService) { }

  formControlMunicipio = new FormControl('');

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
  municipiosURL: string = 'https://opendata.aragon.es/sparql?default-graph-uri=http%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2&query=select+distinct+%3Fnombre+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A%3Fx+a+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23Organization%3E%3B%0D%0A++++++dc%3Atitle+%3Fnombre.%0D%0Afilter%28ucase%28%3Fnombre%29%21%3D%3Fnombre%29.%0D%0Afilter%28regex%28%3Fx+%2C+%22http%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fmunicipio%2F%22%29%29%0D%0A%7D%0D%0Aorder+by+%3Fnombre&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';

  URLparameters: any = [];

  ngOnInit(): void {
    this.initForm();
    this.getNames();
    setTimeout(() => {


      this.locationService.municipioObserver.subscribe((municipio: any) => {
        this.selectedMunicipio = municipio;
      });

      this.queryIdWikiData = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+%3Fs+str%28%3Fnombre%29+%3Fid+%3Fclasif%0D%0Awhere++%7B%0D%0A++++++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23classification%3E+%3Fclasif.+%0D%0A++++++%3Fs+dc%3Aidentifier+%3Fid.+%0D%0A+++++%3Fs+dc%3Atitle+%3Fnombre.%0D%0A+++++VALUES+%3Fclasif+%7B%3Chttps%3A%2F%2Fwww.geonames.org%2Fontology%23A.ADM2%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fkos%2Fcomarca%3E+%3Chttps%3A%2F%2Fwww.geonames.org%2Fontology%23P.PPL%3E%7D%0D%0A%7D%0D%0Aorder+by+asc%28%3Fclasif%29+%3Fid+%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

      //Añado URL e ID a la lista de municipios
      this.aragopediaSvc.getData(this.queryIdWikiData).subscribe(data => {
        const listId = data.results.bindings;
        let index = 0;

        this.municipios.forEach((municipio: any) => {
          listId.forEach((element: any) => {
            if (municipio.nombre.value.toLowerCase() == element['callret-1'].value.toLowerCase()) {
              this.municipiosParsed[index] = { nombre: municipio.nombre.value, url: element.s.value, id: element.id.value, codigoIne: '' }
              index++;
            }
          });
        });

        this._route.queryParams.subscribe(params => {  //DE AQUI LEES LOS PARAMETROS DE LA URL PARAMETROS URL

          this.URLparameters = params;
        });
        let tipoLocalidad = this.URLparameters['tipo'];

        if (tipoLocalidad === 'municipio' && this.URLparameters['id'] !== this.selectedId) {
          let idMuni = this.URLparameters['id'];
          this.selectMunicipioFromURL(idMuni);
        }


      });

    }, 200);

  }

  initForm() {

    this.formGroup = this.fb.group({
      'municipio': [this.selectedMunicipio]
    })
    this.formGroup.get('municipio')?.valueChanges.subscribe(response => {
      this.selectedMunicipio = response;
      this.selected = this.selectedMunicipio;
      if (response !== '') {
        this.selectMunicipio(response);
      }

      this.municipiosParsed.forEach((municipio: any) => {
        if (municipio.nombre === this.selectedMunicipio) {
          this.selectedId = municipio.id;
        }
      })
      this.filterData(response);



    });
  }

  selectMunicipio(municipioAux: any) {

    this.selectedMunicipio = municipioAux;
    this.selected = this.selectedMunicipio;

    this.municipiosParsed.forEach((municipio: any) => {
      if (municipio.nombre === this.selectedMunicipio) {
        
        this.selectedId = municipio.id;
        if (this.locationService.comarcaNombre != '' || this.locationService.provincia != '' || this.locationService.provincia != undefined) {

          this.locationService.changeComarca('', '');
          this.locationService.changeProvincia('');
          this.locationService.changeMunicipio(this.selectedMunicipio, this.selectedId);
        }
      }
    });
  }

  selectMunicipioFromURL(idMuni: any) {

    this.municipiosParsed.forEach((municipio: any) => {
      if (municipio.id === idMuni) {

        this.selectedId = municipio.id;
        this.selectedMunicipio = municipio.nombre;

        if (this.locationService.comarcaNombre != '' || this.locationService.provincia != '') {

          this.locationService.changeComarca('', '');
          this.locationService.changeProvincia('');
          this.locationService.changeMunicipio(this.selectedMunicipio, this.selectedId);
          setTimeout(() => {
            this.clearFilter();
          }, 100);
        }
      }
    });
  }

  filterData(enteredData: any) {
    this.filteredMunicipios = this.municipios.filter((item: any) => {
      if (item.nombre.value.toLowerCase().includes('(la)')) {
        let stringOrdenado = 'La ';
        stringOrdenado += item.nombre.value.toLowerCase().substring(0, item.nombre.value.toLowerCase().indexOf('(la)'));
        item.nombre.value = stringOrdenado;
      } else if (item.nombre.value.toLowerCase().includes('(el)')) {
        let stringOrdenado = 'El ';
        stringOrdenado += item.nombre.value.toLowerCase().substring(0, item.nombre.value.toLowerCase().indexOf('(el)'));
        item.nombre.value = stringOrdenado;
      } else if (item.nombre.value.toLowerCase().includes('(los)')) {
        let stringOrdenado = 'Los ';
        stringOrdenado += item.nombre.value.toLowerCase().substring(0, item.nombre.value.toLowerCase().indexOf('(los)'));
        item.nombre.value = stringOrdenado;
      } else if (item.nombre.value.toLowerCase().includes('(las)')) {
        let stringOrdenado = 'Las ';
        stringOrdenado += item.nombre.value.toLowerCase().substring(0, item.nombre.value.toLowerCase().indexOf('(las)'));
        item.nombre.value = stringOrdenado;
      }
      return this.removeAccents(item.nombre.value.toLowerCase()).indexOf(this.removeAccents(enteredData.toLowerCase())) > -1
    });
  }

  removeAccents(str: any): any {
    
    const acentos: any = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u' };
    return str.split('').map((letra: any) => acentos[letra] || letra).join('').toString();
  }

  getNames() {
    this.aragopediaSvc.getData(this.municipiosURL).subscribe(response => {
      this.municipios = response.results.bindings;
      this.filteredMunicipios = response.results.bindings;
    })
  }

  clearFilter() {
    this.filteredMunicipios = this.municipios
  }

}