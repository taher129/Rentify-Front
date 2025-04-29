import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatContainerComponent } from "../chatcontainer/chatcontainer.component";
import { CommonModule } from "@angular/common";
import { Subscription } from 'rxjs';
import { WebsocketService } from "../../services/websocket.service";
import {AuthService} from "../../userManagement/services/auth.service";

@Component({
  selector: 'app-messeging-page',
  standalone: true,
  imports: [ChatContainerComponent, CommonModule],
  templateUrl:"messeging-page.component.html",
  styleUrls: ['./messeging-page.component.css']
})
export class MessegingPageComponent implements OnInit, OnDestroy {
  // Remove static user data
  // private staticUserId = 15;
  // private staticUsername = 'abdou';

  private subscription: Subscription | null = null;

  constructor(
    private websocketService: WebsocketService,
    private authService: AuthService 
  ) {
    console.log('MessagingPageComponent constructed');
  }

  ngOnInit() {
    console.log('MessagingPageComponent initializing');

    // Get user data from auth service
    const userData = this.authService.getUserDetails('');

    if (userData) {
      // Get user ID from auth service
      const userId = userData.id || 0;

      // Create username from auth data (adjust property names as needed)
      let username = 'User';
      if (userData.firstName) {
        username = userData.firstName;
      } else if (userData.email) {
        username = userData.email.split('@')[0]; // Use part before @ in email
      }

      // Connect to websocket with dynamic user data
      try {
        this.websocketService.connect(username, userId);
      } catch (error) {
        console.error('Error connecting to websocket:', error);
      }
    } else {
      console.warn('No user data available. Chat functionality may be limited.');
      // Optionally handle the case where user is not logged in
    }
  }

  ngOnDestroy() {
    console.log('MessagingPageComponent destroying');
    // Clean up subscriptions
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    // Disconnect from websocket
    this.websocketService.disconnect();
  }
}
