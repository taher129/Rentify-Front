import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {
  faqs = [
    { question: "How do I rent an item?", answer: "Search for an item, send a request, and arrange pickup with the lender.", open: false },
    { question: "What happens if an item is damaged?", answer: "If an item is damaged, additional fees may apply based on the agreement.", open: false },
    { question: "How do I list my items for rent?", answer: "Upload photos, add descriptions, and set a price for your items.", open: false },
    { question: "Is there a service fee?", answer: "Rentify may charge a small fee to ensure secure transactions.", open: false },
    { question: "Can I cancel a rental request?", answer: "Yes, but cancellations may be subject to specific policies.", open: false }
  ];

  toggleFaq(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }
}
