import { TestBed } from '@angular/core/testing';

import { HumanVerificationService } from './human-verification.service';

describe('HumanVerificationService', () => {
  let service: HumanVerificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HumanVerificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
