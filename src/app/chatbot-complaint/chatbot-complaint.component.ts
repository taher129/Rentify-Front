import { Component, ViewChild, ElementRef, AfterViewChecked, HostListener, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChatbotComplaintService } from '../services/chatbot-complaint.service';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ChatbotpopupcomplaintService } from '../services/chatbotpopupcomplaint.service';

@Component({
  selector: 'app-chatbot-complaint',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './chatbot-complaint.component.html',
  styleUrl: './chatbot-complaint.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('messageAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('popupAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ])
  ]
})
export class ChatbotComplaintComponent implements AfterViewChecked {
  userMessage = '';
  chatHistory: { sender: string, text: string, timestamp?: Date }[] = [];
  isTyping = false;
  messageTimes: string[] = [];
  windowWidth: number;

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  
  constructor(
    private chatbotComplaintService: ChatbotComplaintService,
    public chatbotPopupService: ChatbotpopupcomplaintService
  ) {
    this.windowWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = event.target.innerWidth;
  }
  
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  
  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  closeChatbot(): void {
    this.chatbotPopupService.closeChatbot();
  }

  sendMessage() {
    if (!this.userMessage.trim() || this.isTyping) return;
    
    const message = this.userMessage.trim();
    this.chatHistory.push({
      sender: 'You',
      text: message,
      timestamp: new Date()
    });
    
    this.userMessage = '';
    this.isTyping = true;

    // Simulate network delay
    setTimeout(() => {
      this.chatbotComplaintService.sendMessage(message).subscribe({
        next: (res) => {
          setTimeout(() => {
            this.chatHistory.push({
              sender: 'Chatbot',
              text: res.response,
              timestamp: new Date()
            });
            this.isTyping = false;
          }, 700); // Simulate typing time
        },
        error: (error) => {
          setTimeout(() => {
            this.chatHistory.push({
              sender: 'Chatbot',
              text: 'Sorry, there was an error communicating with the server. Please try again later.',
              timestamp: new Date()
            });
            this.isTyping = false;
          }, 700); // Simulate typing time
        },
      });
    }, 500); // Simulate network delay
  }

  getMessageTime(index: number): string {
    const timestamp = this.chatHistory[index].timestamp;
    if (!timestamp) return '';
    
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}