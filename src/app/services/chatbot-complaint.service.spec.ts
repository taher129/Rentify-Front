import { TestBed } from '@angular/core/testing';

import { ChatbotComplaintService } from './chatbot-complaint.service';

describe('ChatbotComplaintService', () => {
  let service: ChatbotComplaintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatbotComplaintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
