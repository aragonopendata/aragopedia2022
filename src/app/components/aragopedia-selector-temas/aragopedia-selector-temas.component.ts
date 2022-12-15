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

  queryTemas!: string;
  temasControl = new FormControl('');
  selectedTema: string = '';
  unique: any;
  temas!: any;

  ngOnInit(): void {

    this.queryTemas = "https://opendata.aragon.es/solrWIKI/informesIAEST/select?q=*&rows=2000&omitHeader=true&wt=json";

    this.aragopediaSvc.getData(this.queryTemas).subscribe((data: any) => {
      console.log(data.response.docs)

      this.temas = data.response.docs;

      this.unique = [...new Set(data.response.docs.map((item: { Descripcion: any; }) => item.Descripcion))];

      console.log(this.unique)
    })

  }


}