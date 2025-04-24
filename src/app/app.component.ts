import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import {isPlatformBrowser, NgIf} from '@angular/common';  // Importation de isPlatformBrowser
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import { NavbarComponent } from "./layout/navbar/navbar.component";
import { FooterComponent } from "./layout/footer/footer.component";
import AOS from 'aos';  // Importation de AOS

import { InsuranceComponent } from './pages/insurance/insurance.component';
import { AboutComponent } from './pages/about/about.component';
import { HomeComponent } from './layout/home/home.component';
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FooterComponent,
    NavbarComponent,
    NgIf
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Rentify';
  showHeaderAndFooter = true;
  hideNavbar = false;


  constructor(@Inject(PLATFORM_ID) private platformId: Object,private router: Router) {this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      // Check the route data
      const route = this.router.routerState.snapshot.root.firstChild;
      this.hideNavbar = route?.data?.['hideNavbar'] || false;
    }
  });
  }

  ngOnInit(): void {
    // Vérification que nous sommes dans un environnement de navigateur
    if (isPlatformBrowser(this.platformId)) {
      // Initialisation de AOS uniquement si l'exécution est côté client
      AOS.init();
    }
  }
}
