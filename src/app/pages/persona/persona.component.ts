import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.scss']
})
export class PersonaComponent implements OnInit {

  constructor(private _route: ActivatedRoute) { }

  idPersona: any;

  ngOnInit(): void {
    this.idPersona = this._route.snapshot.paramMap.get('id');
    console.log(this.idPersona);

  }

}
