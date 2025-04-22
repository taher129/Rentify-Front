import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { ChatBotPopupComponent } from '../chat-bot-popup/chat-bot-popup.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-bubble',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatBotPopupComponent],
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.css']
})
export class ChatBubbleComponent implements OnInit, OnDestroy {
  isChatOpen = false;
  unreadCount = 0;
  currentOtherUserName = 'Lendy';
  conversation: any = null;
  private subscription: Subscription | null = null;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.setupConversation();

    this.subscription = this.chatService.messages$.subscribe((msgs) => {
      // Update the conversation object when messages change
      if (this.conversation) {
        this.conversation.messages = msgs.map(msg => ({
          content: msg.content,
          senderId: msg.sender === 'user' ? 999 : 888, // Use consistent IDs for user/bot
          recipientId: msg.sender === 'bot' ? 999 : 888,
          timestamp: new Date().toISOString(),
          type: 'text',
          isRead: this.isChatOpen // Mark as read if chat is open
        }));
      }

      // Increment unread count if chat is closed and message is from bot
      if (!this.isChatOpen && msgs.length > 0 && msgs[msgs.length - 1].sender === 'bot') {
        this.unreadCount++;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setupConversation(): void {
    // Create a conversation object that matches what ChatBotPopupComponent expects
    this.conversation = {
      messageBoxId: 'chatbot-convo-1',
      messages: []
    };

    // Add a welcome message if needed
    if (this.chatService.messagesSubject && this.chatService.messagesSubject.getValue().length === 0) {
      this.chatService.messagesSubject.next([
        { sender: 'bot', content: 'Hi there! How can I help you today?' }
      ]);
    }
  }

  toggleChatPopup(): void {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      this.unreadCount = 0;

      // Mark all messages as read
      if (this.conversation && this.conversation.messages) {
        this.conversation.messages = this.conversation.messages.map((msg: any) => ({
          ...msg,
          isRead: true
        }));
      }
    }
  }

  handleChatClose(): void {
    this.isChatOpen = false;
  }
}
