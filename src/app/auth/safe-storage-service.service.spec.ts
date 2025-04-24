import { TestBed } from '@angular/core/testing';

import { SafeStorageServiceService } from './safe-storage-service.service';

describe('SafeStorageServiceService', () => {
  let service: SafeStorageServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeStorageServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
