import { TestBed } from '@angular/core/testing';

import { ChatbotpopupcomplaintService } from './chatbotpopupcomplaint.service';

describe('ChatbotpopupcomplaintService', () => {
  let service: ChatbotpopupcomplaintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatbotpopupcomplaintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
