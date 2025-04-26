import { Component } from '@angular/core';
import {NavigationEnd, Router, RouterModule} from '@angular/router';
import {AuthService} from "../../userManagement/services/auth.service";
import {NgIf} from "@angular/common";


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isProfilePage: boolean = false;
  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.authStatusChanged.subscribe(
      (loggedIn: boolean) => {
        this.isLoggedIn = loggedIn;
      }
    );
    // Subscribe to NavigationEnd event to handle URL changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Check if the current route is the profile page
        this.isProfilePage = event.url.includes('profile');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
