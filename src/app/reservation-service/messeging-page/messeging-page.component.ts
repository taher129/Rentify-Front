import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatContainerComponent } from "../chatcontainer/chatcontainer.component";
import { CommonModule } from "@angular/common";
import { Subscription } from 'rxjs';
import {WebsocketService} from "../../services/websocket.service";
@Component({
  selector: 'app-messeging-page',
  standalone: true,
  imports: [ChatContainerComponent, CommonModule],
  templateUrl:"messeging-page.component.html",
  styleUrls: ['./messeging-page.component.css']
})
export class MessegingPageComponent implements OnInit, OnDestroy {
  private staticUserId = 15;
  private staticUsername = 'abdou';
  private subscription: Subscription | null = null;

  constructor(private websocketService: WebsocketService) {
    console.log('MessagingPageComponent constructed');
  }


  ngOnInit() {
    console.log('MessagingPageComponent initializing');

    // Connect to websocket without checking connection status
    try {
      this.websocketService.connect(this.staticUsername, this.staticUserId);
    } catch (error) {
      console.error('Error connecting to websocket:', error);
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
