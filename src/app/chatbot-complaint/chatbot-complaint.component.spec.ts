import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotComplaintComponent } from './chatbot-complaint.component';

describe('ChatbotComplaintComponent', () => {
  let component: ChatbotComplaintComponent;
  let fixture: ComponentFixture<ChatbotComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotComplaintComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatbotComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
