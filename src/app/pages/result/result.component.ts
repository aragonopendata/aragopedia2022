import { Component } from '@angular/core';
import { ResultService } from './result.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})

export class ResultComponent {
  map: string = 'https://idearagon.aragon.es/Visor2D?service=WMS&version=1.1.0&request=GetMap&layers=VISOR2D%3ALimAragon,VISOR2D%3AMunicipio_t2m&bbox=569192.3553%2C4412927.4576%2C810631.1337%2C4754878.6523&width=271&height=384&srs=EPSG%3A25830&format=image/png&CQL_FILTER=1=1;c_muni_ine=22001';

  constructor(public resultSvc: ResultService) { }

  ngOnInit() {
    // this.resultSvc.getData();
  }
}
