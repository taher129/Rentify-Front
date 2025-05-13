import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';

interface ChatMessage {
  sender: 'user' | 'bot';
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: any;
  public messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  constructor() {
    this.socket = io('http://www.rentify.duckdns.org:5000'); // Your Flask-SocketIO backend
    this.listenForMessages();

    // Add welcome message on service initialization
    this.messagesSubject.next([
      { sender: 'bot', content: 'Hi there! How can I help you today?' }
    ]);
  }

  sendMessage(message: string): void {
    this.socket.emit('send_message', { message });

    // Add the user message to the local messages array
    const currentMessages = this.messagesSubject.getValue();
    this.messagesSubject.next([...currentMessages, { sender: 'user', content: message }]);
  }

  private listenForMessages(): void {
    this.socket.on('receive_message', (data: any) => {
      const currentMessages = this.messagesSubject.getValue();
      this.messagesSubject.next([...currentMessages, { sender: 'bot', content: data.message }]);
    });
  }

  // Helper method to get userId for determining message alignment
  get userId(): number {
    return 999; // Your user ID for the frontend
  }

  // Method to upload files if needed
  uploadFile(file: File): Observable<string> {
    return new Observable(observer => {
      // Mock file upload
      setTimeout(() => {
        const fileUrl = URL.createObjectURL(file);
        observer.next(fileUrl);
        observer.complete();
      }, 1000);
    });
  }
}
