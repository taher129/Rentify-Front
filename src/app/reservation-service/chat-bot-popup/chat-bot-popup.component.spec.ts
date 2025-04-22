import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBotPopupComponent } from './chat-bot-popup.component';

describe('ChatBotPopupComponent', () => {
  let component: ChatBotPopupComponent;
  let fixture: ComponentFixture<ChatBotPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatBotPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatBotPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
