import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ChatAreaComponent } from '../chatarea/chatarea.component';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [CommonModule, SidebarComponent, ChatAreaComponent],
  templateUrl: './chatcontainer.component.html',
  styleUrls: ['./chatcontainer.component.css']
})
export class ChatContainerComponent implements OnDestroy {
  conversations: any[] = [];
  contacts: any[] = [];
  currentConversation: any = null;
  currentChatId: string | null = null;
  currentOtherUserName: string = '';

  constructor(private websocketService: WebsocketService) {
    this.websocketService.conversations$.subscribe(conversations => {
      this.conversations = conversations;
    });

    this.websocketService.contacts$.subscribe(contacts => {
      this.contacts = contacts;
    });

    this.websocketService.currentConversation$.subscribe(conversation => {
      this.currentConversation = conversation;
    });
  }

  startNewConversation(data: {otherUserId: number, otherUserName: string}) {
    this.websocketService.startNewConversation(data.otherUserId, data.otherUserName);
  }

  openMainChat(data: {messageBoxId: string, otherUserId: number, otherUserName: string}) {
    this.currentChatId = data.messageBoxId;
    this.currentOtherUserName = data.otherUserName;
    this.websocketService.openMainChat(data.messageBoxId, data.otherUserId, data.otherUserName);
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }
}
