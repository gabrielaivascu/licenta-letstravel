import { TestBed } from '@angular/core/testing';

import { LocationSelectedService } from './location-selected.service';

describe('LocationSelectedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocationSelectedService = TestBed.get(LocationSelectedService);
    expect(service).toBeTruthy();
  });
});
