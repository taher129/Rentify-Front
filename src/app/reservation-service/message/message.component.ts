import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Message {
  content: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  messageType?: 'TEXT' | 'IMAGE';
}

interface ImageContent {
  text: string | null;
  imageUrl: string;
}

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  @Input() message!: Message;
  @Input() isSent: boolean = false;
  @Input() showDateSeparator: boolean = false;
  @Input() dateForSeparator: string = '';

  imageContent: ImageContent | null = null;
  textContent: string = '';

  ngOnInit() {
    this.processMessageContent();
  }

  private processMessageContent() {
    if (!this.message || !this.message.content) return;

    // Check if message appears to be JSON (for image messages)
    if (this.message.content.startsWith('{') && this.message.content.includes('imageUrl')) {
      try {
        this.imageContent = JSON.parse(this.message.content) as ImageContent;
        // Set the text content in case we need it
        this.textContent = this.imageContent.text || '';
      } catch (e) {
        console.error('Failed to parse message content as JSON:', e);
        this.textContent = this.message.content;
      }
    } else {
      this.textContent = this.message.content;
    }
  }

  get isImageMessage(): boolean {
    return this.message.messageType === 'IMAGE' ||
      (this.imageContent !== null && !!this.imageContent.imageUrl);
  }

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();

    // If message is from today, show only time
    if (this.isSameDay(date, now)) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // If message is from yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (this.isSameDay(date, yesterday)) {
      return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Otherwise show date and time
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
  }
}
