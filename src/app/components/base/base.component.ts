import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { RDFData, SparqlserviceService } from 'src/app/service/sparqlservice.service';

@Component({
  selector: 'app-list',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class AbstractBaseComponent implements OnInit {

  @Input() dataChanged!: Observable<any>;

  constructor(protected sparqlSvc: SparqlserviceService) { }

  ngOnInit() {
  }

  onClick(item: RDFData): void {

  }

}