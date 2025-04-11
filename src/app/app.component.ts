import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';  // Importation de isPlatformBrowser
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./layout/navbar/navbar.component";
import { FooterComponent } from "./layout/footer/footer.component";
import { FormsModule } from '@angular/forms';
import AOS from 'aos';  // Importation de AOS

import { InsuranceComponent } from './pages/insurance/insurance.component';
import { AboutComponent } from './pages/about/about.component';
import { HomeComponent } from './layout/home/home.component';
import {ChatBubbleComponent} from "./reservation-service/chat-bubble/chat-bubble.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FooterComponent,
    NavbarComponent,
    ChatBubbleComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Rentify';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // Vérification que nous sommes dans un environnement de navigateur
    if (isPlatformBrowser(this.platformId)) {
      // Initialisation de AOS uniquement si l'exécution est côté client
      AOS.init();
    }
  }
}
