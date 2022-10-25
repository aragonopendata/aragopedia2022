import { Component, Input, OnInit } from '@angular/core';
import { AbstractBaseComponent } from 'src/app/components/base/base.component';
import { RDFData, SparqlserviceService } from 'src/app/service/sparqlservice.service';
import { ResultService } from './result.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})

export class ResultComponent extends AbstractBaseComponent implements OnInit {

  override ngOnInit() {
    this.sparqlSvc.getData().subscribe((data) => {
      this.onDataLoaded(data);
    }, () => {
      console.log('error loading data');
    }, () => {
      console.log('completed loading data');
    });
  }
  constructor(protected override sparqlSvc: SparqlserviceService) {
    super(sparqlSvc);
  }
  @Input() data!: RDFData[];

  map: string = 'https://idearagon.aragon.es/Visor2D?service=WMS&version=1.1.0&request=GetMap&layers=VISOR2D%3ALimAragon,VISOR2D%3AMunicipio_t2m&bbox=569192.3553%2C4412927.4576%2C810631.1337%2C4754878.6523&width=271&height=384&srs=EPSG%3A25830&format=image/png&CQL_FILTER=1=1;c_muni_ine=22001';



  onDataLoaded(data: Array<RDFData>): void {
    this.data = data;
    console.log('received: ', this.data);
  }

}
