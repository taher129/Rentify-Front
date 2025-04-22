import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsocketService } from '../../services/websocket.service';
import { ChatNavbarComponent } from '../chat-navbar/chat-navbar.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-chat-container',
  standalone: true,
  imports: [CommonModule, ChatNavbarComponent],
  templateUrl:'nav-chat-container.component.html',
  styleUrl:'nav-chat-container.component.css'
})
export class NavChatContainerComponent implements OnInit, OnDestroy {
  private static readonly USER_ID = 15;
  private static readonly USERNAME = 'CurrentUser';

  userId: number = NavChatContainerComponent.USER_ID;
  conversations: any[] = [];

  private conversationSubscription: Subscription | null = null;
  private connectionSubscription: Subscription | null = null;

  constructor(private websocketService: WebsocketService) {}

  ngOnInit(): void {
    // Set user info in the service
    this.websocketService.setUserInfo(
        NavChatContainerComponent.USER_ID,
        NavChatContainerComponent.USERNAME
    );

    // Connect to WebSocket
    this.websocketService.connect(
        NavChatContainerComponent.USERNAME,
        NavChatContainerComponent.USER_ID
    );

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
