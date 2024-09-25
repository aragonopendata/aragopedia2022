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

  show: boolean = false;
  selected: string = '';
  formGroup!: FormGroup;
  selectedComarca: string = '';
  comarcas: any = [];
  filteredComarcas: any;
  myControlComarcas = new FormControl('');
  idLocalidad!: string;
  selectedId!: string;
  queryIdWikiData!: string;
  queryUrlComarcasId!: string;
  temp = undefined;
  comarcasParsed = this.temp || [{ nombre: '', url: '', id: '', codigoIne: '' }]

  ngOnInit(): void {


    this.queryIdWikiData = `https://opendata.aragon.es/sparql?default-graph-uri=&query=select+%3Fs+str%28%3Fnombre%29+%3Fid+%3Fclasif%0D%0Awhere++%7B%0D%0A++++++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23classification%3E+%3Fclasif.+%0D%0A++++++%3Fs+dc%3Aidentifier+%3Fid.+%0D%0A+++++%3Fs+dc%3Atitle+%3Fnombre.%0D%0A+++++VALUES+%3Fclasif+%7B%3Chttps%3A%2F%2Fwww.geonames.org%2Fontology%23A.ADM2%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fkos%2Fcomarca%3E+%3Chttps%3A%2F%2Fwww.geonames.org%2Fontology%23P.PPL%3E%7D%0D%0A%7D%0D%0Aorder+by+asc%28%3Fclasif%29+%3Fid+%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

    this.queryUrlComarcasId = `https://opendata.aragon.es/sparql?default-graph-uri=http%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2&query=select+distinct+%3Fnombre+from+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fdef%2Fei2av2%3E+where+%7B%0D%0A%3Fx+a+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23Organization%3E%3B%0D%0A++++++dc%3Atitle+%3Fnombre.%0D%0Afilter%28regex%28%3Fx+%2C+%22http%3A%2F%2Fopendata.aragon.es%2Frecurso%2Fsector-publico%2Forganizacion%2Fcomarca%2F%22%29%29%0D%0A%7D%0D%0Aorder+by+%3Fnombre&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on`;

    this.getNames();
    this.initForm();

    //Añado URL e ID a la lista de municipios
    setTimeout(() => {
      this.locationSvc.getData(this.queryIdWikiData).subscribe(data => {
        const listId = data.results.bindings;
        let index = 0;

        this.comarcas.forEach((comarca: any) => {
          listId.forEach((element: any) => {
            if (this.fixNames(comarca.nombre.value) == element['callret-1'].value) {
              this.comarcasParsed[index] = {
                nombre: comarca.nombre.value,
                url: element.s.value,
                id: element.id.value,
                codigoIne: ''
              }
              index++;
            }
          });
        });
      });
      this.show = true;
    }, 500);

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
      });

      if (this.selectedId !== '') {
        this.router.navigate(['detalles'], { queryParams: { tipo: 'comarca', id: this.selectedId } })
      }

      this.filterData(response);
    });
  }

  filterData(enteredData: any) {
    this.filteredComarcas = this.comarcas.filter((item: any) => {
      if (item.nombre.value.toLowerCase().includes(', la')) {
        let stringOrdenado = 'La ';
        stringOrdenado += item.nombre.value.toLowerCase().substring(0, item.nombre.value.toLowerCase().indexOf(', la'));
        item.nombre.value = stringOrdenado;
      } else if (item.nombre.value.toLowerCase().includes(', el')) {
        let stringOrdenado = 'El ';
        stringOrdenado += item.nombre.value.toLowerCase().substring(0, item.nombre.value.toLowerCase().indexOf(', el'));
        item.nombre.value = stringOrdenado;
      } else if (item.nombre.value.toLowerCase().includes(', los')) {
        let stringOrdenado = 'Los ';
        stringOrdenado += item.nombre.value.toLowerCase().substring(0, item.nombre.value.toLowerCase().indexOf(', los'));
        item.nombre.value = stringOrdenado;
      } else if (item.nombre.value.toLowerCase().includes(', las')) {
        let stringOrdenado = 'Las ';
        stringOrdenado += item.nombre.value.toLowerCase().substring(0, item.nombre.value.toLowerCase().indexOf(', las'));
        item.nombre.value = stringOrdenado;
      }
      return this.removeAccents(item.nombre.value.toLowerCase()).indexOf(this.removeAccents(enteredData.toLowerCase())) > -1;
    });
  }

  getNames() {
    this.locationSvc.getData(this.queryUrlComarcasId).subscribe(response => {
      this.comarcas = response.results.bindings;
      this.filteredComarcas = this.comarcas;
    })
  }

  removeAccents(str: any): any {

    const acentos: any = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u' };
    return str.split('').map((letra: any) => acentos[letra] || letra).join('').toString();
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
      .replace('JACETANIA, LA', 'la jacetania')
  }

  fixNames(str: string): string {
    return str
      .replace('Bajo Aragón-Caspe/ Baix Aragó-Casp', 'Bajo Aragón – Caspe / Baix Aragó – Casp')
      .replace('Andorra-Sierra de Arcos', 'Andorra – Sierra de Arcos')
      .replace('Bajo Cinca/Baix Cinca', 'Bajo Cinca / Baix Cinca')
      .replace('Matarraña/Matarranya', 'Matarraña / Matarranya')
      .replace('La Litera/La Llitera', 'La Litera / La Llitera')
      .replace('Gúdar-Javalambre', 'Gúdar – Javalambre')
      .replace('Hoya de Huesca/Plana de Uesca', 'Hoya de Huesca / Plana de Uesca')
  }

  capitalizeString(str: any): string {
    return str.replace(/\w\S*/g, function (txt: any) {
      const lowerTxt = txt.toLowerCase();
      if (lowerTxt === 'el' || lowerTxt === 'y' || lowerTxt === 'del' ||
        lowerTxt === 'de' || lowerTxt === 'las' || lowerTxt === 'la' || lowerTxt === 'los') {
        return lowerTxt;
      } else {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    });
  }

}