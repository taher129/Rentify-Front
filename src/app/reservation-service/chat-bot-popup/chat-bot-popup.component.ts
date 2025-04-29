import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageComponent } from '../message/message.component';
import { MessageInputComponent } from '../messageinput/messageinput.component';
import { ContactInfoComponent } from '../contact-info/contact-info.component';
import { ChatService } from '../../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-bot-popup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MessageComponent,
    MessageInputComponent,
    ContactInfoComponent
  ],
  templateUrl: './chat-bot-popup.component.html',
  styleUrls: ['./chat-bot-popup.component.css']
})
export class ChatBotPopupComponent implements AfterViewInit, OnChanges, OnInit, OnDestroy {
  @Input() conversation: any = null;
  @Input() currentOtherUserName: string = '';
  @Output() close = new EventEmitter<void>();

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  isMinimized = false;
  isDropdownOpen = false;
  showContactInfo = false;
  private shouldAutoScroll = true;
  private subscription: Subscription | null = null;

  // User ID for the current user (for determining message alignment)
  userId: number = 999; // Default user ID

  contactInfo = {
    name: '',
    status: 'Hi there! I\'m Lendy',
    avatarUrl: '',
    email: '',
    title: '',
    company: '',
    media: []
  };

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    // Subscribe to message updates
    this.subscription = this.chatService.messages$.subscribe(messages => {
      if (this.conversation) {
        // Check if there are new messages
        if (this.shouldShowNewMessageIndicator()) {
          setTimeout(() => this.scrollToBottom(), 0);
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Check if new messages have arrived that might need scrolling
  private shouldShowNewMessageIndicator(): boolean {
    if (!this.conversation || !this.conversation.messages || this.conversation.messages.length === 0) {
      return false;
    }

    // Get the most recent message
    const lastMessage = this.conversation.messages[this.conversation.messages.length - 1];

    // If it's from someone else and not read, it's new
    return lastMessage.senderId !== this.userId;
  }

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

  toggleMinimize(): void {
    this.isMinimized = !this.isMinimized;
  }

  closeChat(): void {
    this.close.emit();
  }

  handleMenuAction(action: string): void {
    this.isDropdownOpen = false; // Close dropdown after selection

    switch(action) {
      case 'contact':
        console.log('Contact info clicked');
        this.openContactInfo();
        break;
      case 'report':
        console.log('Report user clicked');
        // Navigate to report page or open modal
        break;
    }
  }

  openContactInfo(): void {
    // Set contact info for the chatbot
    this.contactInfo = {
      avatarUrl: `/avatar-${this.currentOtherUserName}.jpg`,
      company: 'Rentify',
      email: `${this.currentOtherUserName.toLowerCase().replace(' ', '')}@gmail.com`,
      media: [],
      name: this.currentOtherUserName,
      status: 'Online and ready to assist!',
      title: 'Virtual Assistant'
    };

    this.showContactInfo = true;
  }

  closeContactInfo(): void {
    this.showContactInfo = false;
  }

  // Method to handle sending messages
  handleSendMessage(messageData: any) {
    const { text, file } = messageData;

    if (file) {
      // In a real implementation, you'd handle file uploads
      console.log('File upload not implemented in this version');
      // For now, just send the text if there is any
      if (text && text.trim()) {
        this.chatService.sendMessage(text);
      }
    } else if (text && text.trim()) {
      // Send text message through the chat service
      this.chatService.sendMessage(text);
    }

    // Scroll to bottom after sending
    setTimeout(() => this.scrollToBottom(), 100);
  }

  ngAfterViewInit(): void {
    // Initial scroll to bottom
    setTimeout(() => this.scrollToBottom(), 100);
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
    if (!this.conversation?.messages || this.conversation.messages.length === 0) {
      return false;
    }

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
