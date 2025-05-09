import { TestBed } from '@angular/core/testing';

import { FaceService } from './face.service';

describe('FaceAuthService', () => {
  let service: FaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
