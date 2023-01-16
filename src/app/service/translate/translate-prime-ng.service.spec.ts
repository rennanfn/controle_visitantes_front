import { TestBed } from '@angular/core/testing';

import { TranslatePrimeNGService } from './translate-prime-ng.service';

describe('TranslatePrimeNGService', () => {
  let service: TranslatePrimeNGService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslatePrimeNGService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
