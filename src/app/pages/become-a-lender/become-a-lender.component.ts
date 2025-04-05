import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-become-a-lender',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './become-a-lender.component.html',
  styleUrls: ['./become-a-lender.component.css']
})
export class BecomeALenderComponent {
  title = 'How to become a lender';
  introduction = 'Start your journey as a lender today!';
  howItWorks = [
    { icon: '💡', title: 'Easy', description: 'Open a new account for free and within 2 minutes.' },
    { icon: '💡', title: 'Carefree', description: 'Upload your items. They are automatically linked to Zurich during the rental period.' },
    { icon: '💡', title: 'Direct', description: 'Reach thousands of tenants and new potential customers.' },
    { icon: '💡', title: 'Big impact', description: 'Reduce your carbon footprint and increase your sales at the same time.' }
  ];
  premiumModel = {
    basicPremium: '20% on the rental price',
    powerLender: 'After 5 successful rentals within 12 months, benefit from our regressive cashback model.'
  };
  support = 'For problems, questions, and suggestions, you can reach us here.';
}
