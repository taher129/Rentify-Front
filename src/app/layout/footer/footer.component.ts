import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from "@angular/common/http";


@Component({
  selector: 'app-footer',
   standalone: true,
   providers: [NgbActiveModal],
    imports: [
      NgbModalModule,
      CommonModule,
      RouterModule,
      HttpClientModule// Ajouté aux imports
    ],

  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();

  // Données pour les liens du footer
  supportLinks = [
    { text: 'Contact Us', link: '/contact' },
    { text: 'FAQs', link: '/faq' },
    { text: 'How It Works', action: 'sizeGuide' },
    { text: 'Shipping & Returns', link: '#' }
  ];

  shopLinks = [
    { text: "Home & Lifestyle", link: '#' },
    { text: " Outdoor & Leisure", link: '#' },
    { text: "IT & Multimedia", link: '#' },
    { text: 'Best Deals', link: '#' }
  ];

  companyLinks = [
    { text: 'Our Story', link: '#' },
    { text: 'Careers', link: '#' },
    { text: 'Terms & Conditions', link: '#' },
    { text: 'Privacy & Cookie policy', link: '#' }
  ];

  contactInfo = [
    { text: '+216-50794341', link: 'tel:11111111111' },
    { text: '+216-58096903', link: 'tel:11111111111' },
    { text: 'rentify@gmail.com', link: 'mailto:support@example.com' }
  ];

  paymentMethods = [
    'mastercard', 'visa', 'amex', 'paypal', 'maestro', 'klarna'
  ];

  socialLinks = [
    { icon: 'facebook-f', link: '#' },
    { icon: 'youtube', link: '#' },
    { icon: 'twitter', link: '#' },
    { icon: 'instagram', link: '#' },
    { icon: 'telegram', link: '#' }
  ];

  // Fonction pour ouvrir le guide des tailles
  openSizeGuide() {
    // Implémentez la logique pour ouvrir le modal size guide
    console.log('Open size guide modal');
  }
}
