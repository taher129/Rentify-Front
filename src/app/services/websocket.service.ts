import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Client, IMessage } from '@stomp/stompjs';
import { StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface Contact {
  id: number;
  name: string;
}

interface ChatMessage {
  senderId: number;
  senderName: string;
  content: string;
  messageBoxId: string;
  isRead: boolean;
  timestamp: string;
  messageType?: 'TEXT' | 'IMAGE';
}

interface Conversation {
  messageBoxId: string;
  user1Id: number;
  user1Name: string;
  user2Id: number;
  user2Name: string;
  messages: ChatMessage[];
  unreadCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class WebsocketService implements OnDestroy {
  private stompClient: Client | null = null;
  private serverUrl = '/api/reservations';

  private conversationSubscription: StompSubscription | null = null;
  private readTimeout: any;

  private currentChatId: string | null = null;
  public userId: number | null = null;
  public username: string | null = null;

  private connectionSubject = new BehaviorSubject<boolean>(false);
  public connectionStatus$ = this.connectionSubject.asObservable();

  private conversationsSubject = new BehaviorSubject<Conversation[]>([]);
  public conversations$ = this.conversationsSubject.asObservable();

  private currentConversationSubject = new BehaviorSubject<Conversation | null>(null);
  public currentConversation$ = this.currentConversationSubject.asObservable();

  private contactsSubject = new BehaviorSubject<Contact[]>([]);
  public contacts$ = this.contactsSubject.asObservable();

  constructor(private http: HttpClient) {
    console.log('WebsocketService initialized');
  }

  setUserInfo(userId: number, username: string): void {
    this.userId = userId;
    this.username = username;
  }

  connect(username: string, userId: number): void {
    if (this.stompClient?.active) this.disconnect();

    this.username = username;
    this.userId = userId;

    const socket = new SockJS(`${this.serverUrl}/ws`);
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (msg) => console.log('STOMP:', msg),
    });

    this.stompClient.onConnect = () => {
      this.connectionSubject.next(true);
      this.setupSubscriptions();
    };

    this.stompClient.onStompError = (frame) => {
      console.error('STOMP error:', frame.headers['message'], frame.body);
      this.connectionSubject.next(false);
      setTimeout(() => this.connect(username, userId), 5000);
    };

    this.stompClient.onWebSocketClose = () => {
      console.log('WebSocket closed');
      this.connectionSubject.next(false);
    };

    this.stompClient.activate();
  }

  private setupSubscriptions(): void {
    if (!this.stompClient || !this.userId) return;

    const userIdStr = this.userId.toString();

    this.stompClient.subscribe(`/user/${userIdStr}/queue/messages`, (msg) => {
      this.handleConversationUpdate(JSON.parse(msg.body));
    });

    this.stompClient.subscribe(`/user/${userIdStr}/queue/conversations`, (msg) => {
      this.handleConversationsList(JSON.parse(msg.body));
    });

    this.requestConversations();
    this.fetchContacts();
  }

  private requestConversations(): void {
    if (!this.stompClient || this.userId == null) return;
    this.stompClient.publish({
      destination: '/app/chat.getConversations',
      body: JSON.stringify(this.userId),
    });
  }

  private handleConversationsList(conversations: Conversation[]): void {
    this.conversationsSubject.next(conversations);
  }

  private handleConversationUpdate(conversation: Conversation): void {
    if (conversation.messageBoxId === this.currentChatId) {
      this.currentConversationSubject.next(conversation);
      this.markMessagesAsRead(conversation.messageBoxId);
    }
    this.requestConversations();
  }

  private fetchContacts(): void {
    // Replace this with an actual HTTP request to get contacts from the backend
    this.http.get<Contact[]>(`${this.serverUrl}/api/contacts`).subscribe({
      next: (contacts) => {
        // Filter out the current user if needed
        const filteredContacts = this.userId
          ? contacts.filter(c => c.id !== this.userId)
          : contacts;
        this.contactsSubject.next(filteredContacts);
      },
      error: (error) => {
        console.error('Error fetching contacts:', error);
        this.contactsSubject.next([]);
      }
    });
  }

  startNewConversation(otherUserId: number, otherUserName: string): void {
    if (!this.stompClient || !this.userId || !this.username) return;

    const request = {
      user1Id: this.userId,
      user1Name: this.username,
      user2Id: otherUserId,
      user2Name: otherUserName,
    };

    this.stompClient.publish({
      destination: '/app/chat.startConversation',
      body: JSON.stringify(request),
    });
  }

  openMainChat(messageBoxId: string, otherUserId: number, otherUserName: string): void {
    this.currentChatId = messageBoxId;
    if (this.conversationSubscription) {
      this.conversationSubscription.unsubscribe();
      this.conversationSubscription = null;
    }

    if (!this.stompClient || !this.userId) return;

    this.markMessagesAsRead(messageBoxId);

    this.conversationSubscription = this.stompClient.subscribe(
      `/user/${this.userId}/queue/conversation`,
      (msg: IMessage) => {
        const conversation = JSON.parse(msg.body);
        if (conversation.messageBoxId === this.currentChatId) {
          this.currentConversationSubject.next(conversation);
          this.markMessagesAsRead(conversation.messageBoxId);
        }
      }
    );

    const request = {
      messageBoxId,
      userId: this.userId,
    };

    this.stompClient.publish({
      destination: '/app/chat.openConversation',
      headers: { userId: this.userId.toString() },
      body: JSON.stringify(request),
    });
  }

  sendMessage(content: string, messageBoxId: string): void {
    if (!this.stompClient || !this.userId || !this.username) return;

    const message: ChatMessage = {
      senderId: this.userId,
      senderName: this.username,
      content,
      messageBoxId,
      isRead: false,
      timestamp: new Date().toISOString(),
      messageType: 'TEXT',
    };

    this.stompClient.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(message),
    });
  }

  sendImageMessage(text: string, imageUrl: string, messageBoxId: string): void {
    if (!this.stompClient || !this.userId || !this.username) return;

    const content = JSON.stringify({ text, imageUrl });
    const message: ChatMessage = {
      senderId: this.userId,
      senderName: this.username,
      content,
      messageBoxId,
      isRead: false,
      timestamp: new Date().toISOString(),
      messageType: 'IMAGE',
    };

    this.stompClient.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(message),
    });
  }

  uploadFile(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.serverUrl}/api/messages/upload`, formData, {
      responseType: 'text',
    });
  }

  private markMessagesAsRead(messageBoxId: string): void {
    if (!this.stompClient || !this.userId || !messageBoxId) return;

    clearTimeout(this.readTimeout);
    this.readTimeout = setTimeout(() => {
      const request = { messageBoxId, userId: this.userId };
      if (this.stompClient) {
        this.stompClient.publish({
          destination: '/app/chat.markAsRead',
          body: JSON.stringify(request),
        });
      }
    }, 300);
  }

  disconnect(): void {
    if (this.conversationSubscription) {
      this.conversationSubscription.unsubscribe();
    }
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
    this.connectionSubject.next(false);
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
