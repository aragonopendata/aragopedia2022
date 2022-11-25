import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonaService } from './persona.service';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.scss']
})
export class PersonaComponent implements OnInit {

  constructor(private _route: ActivatedRoute, personaSvc: PersonaService) { }

  idPersona: any;
  queryUrlPersonas!: string;

  ngOnInit(): void {
    this.idPersona = this._route.snapshot.paramMap.get('id');


  }

}
