import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationServiceService {

  provincia!: string;
  provinciaObserver: Subject<string> = new Subject<string>();

  comarcaNombre!: string;
  comarcaId!: string;
  comarcaObserver: Subject<string> = new Subject<string>();

  municipioNombre!: string;
  municipioId!: string;
  municipioObserver: Subject<string> = new Subject<string>();

  constructor() { }

  changeProvincia(newProvincia: any) {
    this.provincia = newProvincia;

    if (newProvincia !== '' && newProvincia !== undefined) {
      this.provinciaObserver.next(this.provincia)
    }
  }

  changeComarca(newComarcaNombre: any, newComarcaId: any) {
    this.comarcaNombre = newComarcaNombre;
    this.comarcaId = newComarcaId;
    if (newComarcaNombre !== '') {
      this.comarcaObserver.next(this.comarcaNombre)
    }
  }

  changeMunicipio(newMunicipioNombre: any, newMunicipioId: any) {
    this.municipioNombre = newMunicipioNombre;
    this.municipioId = newMunicipioId;
    if (newMunicipioNombre !== '') {
      this.municipioObserver.next(this.municipioNombre)
    }
  }
}
