import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChatbotpopupcomplaintService {
  private isVisibleSubject = new BehaviorSubject<boolean>(false);
  isVisible$ = this.isVisibleSubject.asObservable();

  toggleChatbot(): void {
    this.isVisibleSubject.next(!this.isVisibleSubject.value);
  }

  openChatbot(): void {
    this.isVisibleSubject.next(true);
  }

  closeChatbot(): void {
    this.isVisibleSubject.next(false);
  }
}