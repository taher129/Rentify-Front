import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isChatOpen: boolean = false;
  isNotificationsOpen: boolean = false;
  isProfileOpen: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  toggleChat(event: Event): void {
    event.stopPropagation();
    this.isChatOpen = !this.isChatOpen;
    // Close other dropdowns
    this.isNotificationsOpen = false;
    this.isProfileOpen = false;
  }

  toggleNotifications(event: Event): void {
    event.stopPropagation();
    this.isNotificationsOpen = !this.isNotificationsOpen;
    // Close other dropdowns
    this.isChatOpen = false;
    this.isProfileOpen = false;
  }

  toggleProfile(event: Event): void {
    event.stopPropagation();
    this.isProfileOpen = !this.isProfileOpen;
    // Close other dropdowns
    this.isChatOpen = false;
    this.isNotificationsOpen = false;
  }

  // Close all dropdowns when clicking outside
  closeAllDropdowns(): void {
    this.isChatOpen = false;
    this.isNotificationsOpen = false;
    this.isProfileOpen = false;
  }
}
