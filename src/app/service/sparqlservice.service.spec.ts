import { TestBed } from '@angular/core/testing';

import { SparqlserviceService } from './sparqlservice.service';

describe('SparqlserviceService', () => {
  let service: SparqlserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SparqlserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
