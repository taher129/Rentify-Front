import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageComponent } from '../message/message.component';
import { WebsocketService } from '../../services/websocket.service';
import { MessageInputComponent } from '../messageinput/messageinput.component';
import { EmojiPickerComponent } from '../emoji-picker/emoji-picker.component';
import { ContactInfoComponent } from '../contact-info/contact-info.component';
import {Router} from "@angular/router";

interface Message {
  content: string;
  timestamp: string;
  senderId: number;
  messageType?: 'TEXT' | 'IMAGE';
  status?: 'sent' | 'delivered' | 'read';
}

@Component({
  selector: 'app-chat-area',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MessageComponent,
    MessageInputComponent,
    EmojiPickerComponent,
    ContactInfoComponent
  ],
  templateUrl: './chatarea.component.html',
  styleUrls: ['./chatarea.component.css']
})
export class ChatAreaComponent implements AfterViewInit, OnChanges {
  @Input() conversation: any = null;
  @Input() currentOtherUserName: string = '';
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  isDropdownOpen = false;
  showContactInfo = false;
  private shouldAutoScroll = true; // only true for the first load

  // Contact info data for the other user
  contactInfo = {
    name: '',
    status: 'Hi there! I\'m using FuseChat.',
    avatarUrl: '',
    email: '',
    phone: '',
    title: '',
    company: '',
    media: []
  };

  get userId(): number | null {
    return this.websocketService.userId;
  }

  constructor(private websocketService: WebsocketService,private router: Router ) {}

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  documentClick(event: MouseEvent): void {
    // Check if the click was outside the dropdown
    const clickedElement = event.target as HTMLElement;
    if (!clickedElement.closest('.dropdown-container')) {
      this.isDropdownOpen = false;
    }
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation(); // Prevent the document click listener from firing
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  handleMenuAction(action: string): void {
    this.isDropdownOpen = false; // Close dropdown after selection

    switch(action) {
      case 'contact':
        console.log('Contact info clicked');
        this.openContactInfo();
        break;
      case 'report':
        console.log('Select messages clicked');
        this.router.navigate(['/report']);
        break;
    }
  }

  openContactInfo(): void {
    // In a real app, you'd fetch this data from a service
    this.contactInfo = {
      avatarUrl: `/avatar-${this.currentOtherUserName}.jpg`,
      company: 'Boilcat',
      email: `${this.currentOtherUserName.toLowerCase().replace(' ', '')}@mail.com`,
      media: [],
      name: this.currentOtherUserName,
      phone: '893 548 2862',
      status: 'Place holder',
      title: 'reting xx product or category'
    };

    this.showContactInfo = true;
  }

  closeContactInfo(): void {
    this.showContactInfo = false;
  }

  // Method to handle sending messages - updated to handle complex message data
  handleSendMessage(messageData: any) {
    if (!this.conversation?.messageBoxId) return;

    const { text, file } = messageData;

    if (file) {
      // Upload file first, then send message with image
      this.websocketService.uploadFile(file).subscribe({
        next: (fileUrl: string) => {
          this.websocketService.sendImageMessage(text, fileUrl, this.conversation.messageBoxId);
        },
        error: (error) => {
          console.error('Error uploading file:', error);
          // Fallback to text-only if there was an error
          if (text && text.trim()) {
            this.websocketService.sendMessage(text, this.conversation.messageBoxId);
          }
        }
      });
    } else if (text && text.trim()) {
      // Text-only message
      this.websocketService.sendMessage(text, this.conversation.messageBoxId);
    }
  }

  ngAfterViewInit(): void {
    // You can keep or remove this; ngOnChanges will handle initial scroll
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversation']) {
      // Scroll to bottom only on the first time this conversation is loaded
      if (this.shouldAutoScroll) {
        setTimeout(() => {
          this.scrollToBottom();
          this.shouldAutoScroll = false; // don't scroll on subsequent changes
        }, 100);
      }
    }

    if (changes['currentOtherUserName']) {
      // Reset contact info when changing conversations
      this.showContactInfo = false;
    }
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }

  // Date separator logic
  shouldShowDateSeparator(index: number): boolean {
    if (index === 0) {
      // Always show date separator for the first message
      return true;
    }

    const currentMessage = this.conversation.messages[index];
    const previousMessage = this.conversation.messages[index - 1];

    // Compare dates to see if they're from different days
    const currentDate = new Date(currentMessage.timestamp);
    const previousDate = new Date(previousMessage.timestamp);

    return !this.isSameDay(currentDate, previousDate);
  }

  formatDateForSeparator(timestamp: string): string {
    const date = new Date(timestamp);
    const today = new Date();

    if (this.isSameDay(date, today)) {
      return 'Today';
    }

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (this.isSameDay(date, yesterday)) {
      return 'Yesterday';
    }

    // Format for other dates
    return date.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
  }
}
