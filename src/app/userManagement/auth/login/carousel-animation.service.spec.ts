import { TestBed } from '@angular/core/testing';

import { CarouselAnimationService } from './carousel-animation.service';

describe('CarouselAnimationService', () => {
  let service: CarouselAnimationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarouselAnimationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
