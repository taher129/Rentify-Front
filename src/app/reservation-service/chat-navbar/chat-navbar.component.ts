import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from '../../services/websocket.service';
import { ChatPopupComponent } from '../chat-popup/chat-popup.component';
import {RouterLink} from "@angular/router";

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
  @Input() userId: number | null = null;

  activeTab: 'chats' | 'communities' = 'chats';
  searchQuery: string = '';
  filteredConversations: Conversation[] = [];
  activeChats: ActiveChat[] = [];

  constructor(private websocketService: WebsocketService) {}

  ngOnInit(): void {
    this.filterConversations();
  }

  ngOnChanges(): void {
    this.filterConversations();
  }

  filterConversations(): void {
    if (!this.searchQuery) {
      this.filteredConversations = [...this.conversations].sort((a, b) => {
        const aTime = this.getLastMessageTime(a);
        const bTime = this.getLastMessageTime(b);
        return bTime.getTime() - aTime.getTime(); // Sort by most recent
      });
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredConversations = this.conversations.filter(conversation => {
      const otherUser = this.getOtherUser(conversation);

      // Search by user name
      if (otherUser.name.toLowerCase().includes(query)) {
        return true;
      }

      // Search in message content
      if (conversation.messages && conversation.messages.length > 0) {
        return conversation.messages.some(message =>
            message.content.toLowerCase().includes(query)
        );
      }

      return false;
    });
  }

  onSearchChange(): void {
    this.filterConversations();
  }

  getOtherUser(conversation: Conversation): { id: number, name: string } {
    if (!this.userId) return { id: 0, name: '' };

    return conversation.user1Id === this.userId
        ? { id: conversation.user2Id, name: conversation.user2Name }
        : { id: conversation.user1Id, name: conversation.user1Name };
  }

  selectConversation(conversation: Conversation): void {
    const otherUser = this.getOtherUser(conversation);

    // Check if chat is already open
    const existingChatIndex = this.activeChats.findIndex(
        chat => chat.messageBoxId === conversation.messageBoxId
    );

    if (existingChatIndex >= 0) {
      // Move to front if already open
      const chat = this.activeChats.splice(existingChatIndex, 1)[0];
      this.activeChats.push(chat);
    } else {
      // Add new chat
      this.activeChats.push({
        messageBoxId: conversation.messageBoxId,
        otherUserId: otherUser.id,
        otherUserName: otherUser.name,
        conversation: conversation
      });

      // Limit number of active chats to 3
      if (this.activeChats.length > 3) {
        this.activeChats.shift();
      }
    }

    // Open this conversation in the WebSocket service
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

    // Truncate long messages
    return lastMessage.content.length > 30
        ? lastMessage.content.substring(0, 30) + '...'
        : lastMessage.content;
  }

  getLastMessageTime(conversation: Conversation): Date {
    if (!conversation.messages || conversation.messages.length === 0) {
      return new Date(0); // Default to epoch if no messages
    }

    const lastMessage = conversation.messages[conversation.messages.length - 1];
    return new Date(lastMessage.timestamp);
  }

  formatMessageTime(date: Date): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if message is from today
    if (date >= today) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Check if message is from yesterday
    if (date >= yesterday && date < today) {
      return 'Yesterday';
    }

    // Check if message is from this week
    const sixDaysAgo = new Date(today);
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
    if (date >= sixDaysAgo) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }

    // Older messages
    return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
  }

  getOnlineStatus(userId: number): boolean {
    // This would typically come from your websocket service
    // For now, we'll just randomly determine online status
    return Math.random() > 0.5;
  }

}
