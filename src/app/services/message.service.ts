import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private unreadMessagesSubject = new BehaviorSubject<number>(0);
  unreadMessages$ = this.unreadMessagesSubject.asObservable();

  constructor(private websocketService: WebsocketService) {
    // Listen to conversations and calculate total unread messages
    this.websocketService.conversations$.subscribe(conversations => {
      const totalUnread = conversations.reduce((total, conv) => {
        return total + (conv.unreadCount || 0);
      }, 0);

      this.updateUnreadCount(totalUnread);
    });
  }

  updateUnreadCount(count: number): void {
    console.log('MessageService: Updating unread count to', count);
    this.unreadMessagesSubject.next(count);
  }

  incrementUnreadCount(): void {
    const currentCount = this.unreadMessagesSubject.value;
    const newCount = currentCount + 1;
    console.log('MessageService: Incrementing unread count to', newCount);
    this.unreadMessagesSubject.next(newCount);
  }

  resetUnreadCount(): void {
    console.log('MessageService: Resetting unread count');
    this.unreadMessagesSubject.next(0);
  }
}
