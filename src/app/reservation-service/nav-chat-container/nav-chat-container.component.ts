import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsocketService } from '../../services/websocket.service';
import { ChatNavbarComponent } from '../chat-navbar/chat-navbar.component';
import { Subscription } from 'rxjs';
import {AuthService} from "../../userManagement/services/auth.service";

@Component({
  selector: 'app-nav-chat-container',
  standalone: true,
  imports: [CommonModule, ChatNavbarComponent],
  templateUrl:'nav-chat-container.component.html',
  styleUrl:'nav-chat-container.component.css'
})
export class NavChatContainerComponent implements OnInit, OnDestroy {

  userId: number = 0; // Initialize with default value
  username: string = ''; // Add a username variable
  conversations: any[] = [];

  private conversationSubscription: Subscription | null = null;
  private connectionSubscription: Subscription | null = null;

  constructor(
    private websocketService: WebsocketService,
    private authService: AuthService // Add AuthService
  ) {}

  ngOnInit(): void {
    // Get user data from auth service
    const userData = this.authService.getUserDetails('');

    if (userData) {
      // Set user ID from auth service
      this.userId = userData.id || 0;

      // Create username from first and last name, or use email as fallback
      if (userData.firstName && userData.lastName) {
        this.username = `${userData.firstName} ${userData.lastName}`;
      } else if (userData.email) {
        this.username = userData.email;
      } else {
        this.username = 'User'; // Default if no name data available
      }

      // Set user info in the service
      this.websocketService.setUserInfo(this.userId, this.username);

      // Connect to WebSocket
      this.websocketService.connect(this.username, this.userId);

      // Subscribe to connection status
      this.connectionSubscription = this.websocketService.connectionStatus$.subscribe(
        isConnected => {
          if (isConnected) {
            console.log('Connected to chat server');
          } else {
            console.log('Disconnected from chat server');
          }
        }
      );

      // Subscribe to conversations
      this.conversationSubscription = this.websocketService.conversations$.subscribe(
        conversations => {
          this.conversations = conversations;
          console.log('Received conversations:', conversations);
        }
      );
    } else {
      console.warn('No user data available. Chat functionality may be limited.');
      // Optionally handle the case where user is not logged in
    }
  }

  ngOnDestroy(): void {
    // Clean up subscriptions when component is destroyed
    if (this.conversationSubscription) {
      this.conversationSubscription.unsubscribe();
    }

    if (this.connectionSubscription) {
      this.connectionSubscription.unsubscribe();
    }

    // Disconnect from WebSocket service
    this.websocketService.disconnect();
  }
}
