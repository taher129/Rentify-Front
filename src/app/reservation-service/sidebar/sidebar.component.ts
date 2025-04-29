import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsocketService } from '../../services/websocket.service';
import { FormsModule } from "@angular/forms";
import {AuthService} from "../../userManagement/services/auth.service";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit { // Add OnInit interface
  @Input() conversations: any[] = [];
  @Input() contacts: any[] = [];
  @Output() startConversation = new EventEmitter<{otherUserId: number, otherUserName: string}>();
  @Output() openChat = new EventEmitter<{messageBoxId: string, otherUserId: number, otherUserName: string}>();

  selectedConversationId: string | null = null;  // Track the selected conversation ID
  searchQuery: string = ''; // Add this for search functionality
  filteredConversations: any[] = []; // Add this to store filtered conversations
  userImage: string = '';

  get username(): string {
    return this.websocketService.username || '';
  }

  get userId(): number | null {
    return this.websocketService.userId;
  }

  constructor(
    private websocketService: WebsocketService,
    private authService: AuthService
  ) {}


  ngOnInit() {
    // Check if user info is already set in WebsocketService
    if (!this.websocketService.userId || !this.websocketService.username) {
      // If not set, try to get it from AuthService
      const userData = this.authService.getUserDetails('');

      if (userData) {
        const userId = userData.id || 0;
        let username = 'User';

        // Get the user image from user data
        this.userImage = userData.userImage || '';

        if (userData.firstName && userData.lastName) {
          username = `${userData.firstName} ${userData.lastName}`;
        } else if (userData.firstName) {
          username = userData.firstName;
        } else if (userData.email) {
          username = userData.email.split('@')[0];
        }

        // Set the user info in the WebsocketService
        this.websocketService.setUserInfo(userId, username);
      }
    } else {
      // If the user info is already set, try to get the image from AuthService
      const userData = this.authService.getUserDetails('');
      if (userData) {
        this.userImage = userData.userImage || '';
      }
    }
  }

  ngOnChanges() {
    // Update filtered conversations whenever the input conversations change
    this.filterConversations();
  }

  filterConversations() {
    if (!this.searchQuery) {
      this.filteredConversations = [...this.conversations];
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
        return conversation.messages.some((message: any) =>
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
  onSearchChange(event: any) {
    this.searchQuery = event.target.value;
    this.filterConversations();
  }

  getOtherUser(conversation: any): { id: number, name: string } {
    if (!this.userId) return { id: 0, name: '' };
    return conversation.user1Id === this.userId ?
      { id: conversation.user2Id, name: conversation.user2Name } :
      { id: conversation.user1Id, name: conversation.user1Name };
  }

  getAvatarColor(name: string): string {
    const colors = ['#2196F3', '#32c787', '#00BCD4', '#ff5652', '#ffc107', '#ff85af', '#FF9800', '#39bbb0'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = 31 * hash + name.charCodeAt(i);
    }
    return colors[Math.abs(hash % colors.length)];
  }

  // Method to handle chat selection
  selectConversation(conversation: any) {
    console.log('Conversation clicked:', conversation.messageBoxId);
    this.selectedConversationId = conversation.messageBoxId;
    console.log('Selected conversation ID:', this.selectedConversationId);
    this.openChat.emit({
      messageBoxId: conversation.messageBoxId,
      otherUserId: this.getOtherUser(conversation).id,
      otherUserName: this.getOtherUser(conversation).name
    });
  }
}
