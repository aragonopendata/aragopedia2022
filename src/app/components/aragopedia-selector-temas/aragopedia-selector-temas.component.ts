import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AragopediaService } from '../aragopedia-tabla-datos/aragopediaService';

@Component({
  selector: 'app-aragopedia-selector-temas',
  templateUrl: './aragopedia-selector-temas.component.html',
  styleUrls: ['./aragopedia-selector-temas.component.scss']
})
export class AragopediaSelectorTemasComponent implements OnInit {

  constructor(public aragopediaSvc: AragopediaService) { }


  temp = undefined;

  queryTemas!: string;
  temasControl = new FormControl('');
  selectedTema: string = '';
  unique: any;
  temas!: any;

  provincias = this.temp || [{ nombre: 'Huesca', selected: false, id: '7824' }, { nombre: 'Zaragoza', selected: false, id: '7823' }, { nombre: 'Teruel', selected: false, id: '7825' }]
  comarcas = this.temp || [{ nombre: '', selected: false, id: '' }]
  municipios = this.temp || [{ nombre: '', selected: false, id: '' }]

  temasComunidad = [{}];
  temasProvincia = [{}];
  temasComarca = [{}];
  temasMunicipio = [{}];

  queryUrlComarcas: string = 'https://opendata.aragon.es/sparql?default-graph-uri=&query=select+%3Fs+str%28%3Fnombre%29+%3Fid+%3Fclasif%0D%0Awhere++%7B%0D%0A++++++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Forg%23classification%3E+%3Fclasif.+%0D%0A++++++%3Fs+dc%3Aidentifier+%3Fid.+%0D%0A+++++%3Fs+dc%3Atitle+%3Fnombre.%0D%0A+++++VALUES+%3Fclasif+%7B%3Chttps%3A%2F%2Fwww.geonames.org%2Fontology%23A.ADM2%3E+%3Chttp%3A%2F%2Fopendata.aragon.es%2Fkos%2Fcomarca%3E+%3Chttps%3A%2F%2Fwww.geonames.org%2Fontology%23P.PPL%3E%7D%0D%0A%7D%0D%0Aorder+by+asc%28%3Fclasif%29+%3Fid+%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&signal_void=on';

  ngOnInit(): void {

    this.queryTemas = "https://opendata.aragon.es/solrWIKI/informesIAEST/select?q=*&rows=2000&omitHeader=true&wt=json";

    this.aragopediaSvc.getData(this.queryTemas).subscribe((data: any) => {
      console.log(data.response.docs)

      this.temas = data.response.docs;

      this.unique = [...new Set(data.response.docs.map((item: { Descripcion: any; }) => item.Descripcion))];

      console.log(this.unique)

      // Construcción temas por tipo de territorio
      this.temas.forEach((tema: any) => {
        if (tema.Tipo === 'A') {
          this.temasComunidad.push(tema)
        } else if (tema.Tipo === 'TP') {
          this.temasProvincia.push(tema)
        } else if (tema.Tipo === 'TC') {
          this.temasComarca.push(tema)
        } else if (tema.Tipo === 'TC') {
          this.temasMunicipio.push(tema);
        }
      });
    });

    this.aragopediaSvc.getData(this.queryUrlComarcas).subscribe(data => {
      const comarcas = data?.results.bindings;
      const comarcasUnicas = data?.results.bindings;

      comarcas.forEach((comarca: any, i: number) => {
        let index = 0;
        // console.log(comarca.id.value);
        // console.log(comarcasUnicas[i].id.value);
        if (comarca.id.value !== comarcasUnicas[index].id.value) {
          this.comarcas[i] = { nombre: comarca['callret-1'].value, selected: false, id: comarca.id.value }
          index++
        }
      });
      console.log(this.comarcas);
    })

  }


}