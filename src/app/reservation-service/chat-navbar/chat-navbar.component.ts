import { Component, OnInit, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from '../../services/websocket.service';
import { ChatPopupComponent } from '../chat-popup/chat-popup.component';
import { RouterLink } from "@angular/router";
import {UserDetails} from "../../userManagement/models/user";
import {AuthService} from "../../userManagement/services/auth.service";

interface Conversation {
  messageBoxId: string;
  user1Id: number;
  user2Id: number;
  user1Name: string;
  user2Name: string;
  messages: Message[];
  muted?: boolean;
  lastMessageTime?: Date;
}

interface Message {
  id: string;
  senderId: number;
  content: string;
  timestamp: string;
  isImage?: boolean;
  imageUrl?: string;
}

interface ActiveChat {
  messageBoxId: string;
  otherUserId: number;
  otherUserName: string;
  conversation: Conversation;
}

@Component({
  selector: 'app-chat-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatPopupComponent, RouterLink],
  templateUrl: './chat-navbar.component.html',
  styleUrls: ['./chat-navbar.component.css']
})
export class ChatNavbarComponent implements OnInit {
  @Input() conversations: Conversation[] = [];
  @Input() isOpen: boolean = false;
  @Input() closeNavbar: () => void = () => {};

  @ViewChild('navbarContainer') navbarContainer!: ElementRef;

  activeTab: 'chats' | 'communities' = 'chats';
  searchQuery: string = '';
  filteredConversations: Conversation[] = [];
  activeChats: ActiveChat[] = [];

  // Current user from auth service
  currentUser: UserDetails | null = null;

  constructor(
    private websocketService: WebsocketService,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserDetails();
    this.filterConversations();
  }

  ngOnChanges(): void {
    this.filterConversations();
  }

  // Load user details from auth service
  loadUserDetails(): void {
    const token = this.authService.getToken(); // Assuming you have a getToken method
    if (token) {
      this.currentUser = this.authService.getUserDetails(token);
      if (!this.currentUser) {
        console.error('User details not found. Please login again.');
      }
    } else {
      console.error('No authentication token found. Please login.');
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    // Check if click is outside the navbar and not on a chat popup
    if (this.isOpen &&
      !this.navbarContainer.nativeElement.contains(event.target) &&
      !this.isClickOnChatPopup(event)) {
      this.closeNavbar();
    }
  }

  private isClickOnChatPopup(event: MouseEvent): boolean {
    const chatPopups = document.querySelectorAll('app-chat-popup');
    for (let i = 0; i < chatPopups.length; i++) {
      if (chatPopups[i].contains(event.target as Node)) {
        return true;
      }
    }
    return false;
  }

  filterConversations(): void {
    if (!this.searchQuery) {
      this.filteredConversations = [...this.conversations].sort((a, b) => {
        const aTime = this.getLastMessageTime(a);
        const bTime = this.getLastMessageTime(b);
        return bTime.getTime() - aTime.getTime();
      });
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredConversations = this.conversations.filter(conversation => {
      const otherUser = this.getOtherUser(conversation);

      if (otherUser.name.toLowerCase().includes(query)) {
        return true;
      }

      if (conversation.messages && conversation.messages.length > 0) {
        return conversation.messages.some(message =>
          message.content.toLowerCase().includes(query)
        );
      }

      return false;
    });
  }
  getInitials(name: string): string {
    if (!name) return '';

    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }

    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  }

  getAvatarColor(name: string): string {
    const colors = ['#2196F3', '#32c787', '#00BCD4', '#ff5652', '#ffc107', '#ff85af', '#FF9800', '#39bbb0'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = 31 * hash + name.charCodeAt(i);
    }
    return colors[Math.abs(hash % colors.length)];
  }
  onSearchChange(): void {
    this.filterConversations();
  }

  getOtherUser(conversation: Conversation): { id: number, name: string } {
    // Get current user ID from auth service
    const userId = this.currentUser?.id;
    if (!userId) return { id: 0, name: '' };

    return conversation.user1Id === userId
      ? { id: conversation.user2Id, name: conversation.user2Name }
      : { id: conversation.user1Id, name: conversation.user1Name };
  }

  selectConversation(conversation: Conversation): void {
    const otherUser = this.getOtherUser(conversation);

    const existingChatIndex = this.activeChats.findIndex(
      chat => chat.messageBoxId === conversation.messageBoxId
    );

    if (existingChatIndex >= 0) {
      const chat = this.activeChats.splice(existingChatIndex, 1)[0];
      this.activeChats.push(chat);
    } else {
      this.activeChats.push({
        messageBoxId: conversation.messageBoxId,
        otherUserId: otherUser.id,
        otherUserName: otherUser.name,
        conversation: conversation
      });

      if (this.activeChats.length > 3) {
        this.activeChats.shift();
      }
    }

    this.websocketService.openMainChat(
      conversation.messageBoxId,
      otherUser.id,
      otherUser.name
    );
  }

  closeChat(messageBoxId: string): void {
    this.activeChats = this.activeChats.filter(
      chat => chat.messageBoxId !== messageBoxId
    );
  }

  switchTab(tab: 'chats' | 'communities'): void {
    this.activeTab = tab;
  }

  getLastMessagePreview(conversation: Conversation): string {
    if (!conversation.messages || conversation.messages.length === 0) {
      return 'No messages yet';
    }

    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (lastMessage.isImage) {
      return '📷 Image';
    }

    return lastMessage.content.length > 30
      ? lastMessage.content.substring(0, 30) + '...'
      : lastMessage.content;
  }

  getLastMessageTime(conversation: Conversation): Date {
    if (!conversation.messages || conversation.messages.length === 0) {
      return new Date(0);
    }

    const lastMessage = conversation.messages[conversation.messages.length - 1];
    return new Date(lastMessage.timestamp);
  }

  formatMessageTime(date: Date): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date >= today) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    if (date >= yesterday && date < today) {
      return 'Yesterday';
    }

    const sixDaysAgo = new Date(today);
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
    if (date >= sixDaysAgo) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }

    return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
  }

  getOnlineStatus(userId: number): boolean {
    return Math.random() > 0.5;
  }
}
