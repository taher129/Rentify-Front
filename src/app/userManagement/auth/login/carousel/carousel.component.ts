import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import {NgClass, NgForOf, NgIf} from "@angular/common";

interface RentalItem {
  id: number;
  type: 'stats' | 'testimonial' | 'category' | 'clients' | 'chart';
  title?: string;
  description?: string;
  value?: string;
  subValue?: string;
  author?: {
    name: string;
    title: string;
  };
  quote?: string;
  chartData?: number[];
  clientData?: {
    total: string;
    growth: string;
    period: string;
  };
  categories?: {
    name: string;
    count: string;
  }[];
}

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgClass
  ],

  animations: [
    trigger('slideAnimation', [
      transition('void => *', [
        style({opacity: 0, transform: 'translateY(40px)'}),
        animate('600ms ease-out', style({opacity: 1, transform: 'translateY(0)'}))
      ]),
      transition('* => void', [
        animate('600ms ease-in', style({opacity: 0, transform: 'translateY(-40px)'}))
      ])
    ])
  ]
})
export class CarouselComponent  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('carouselTrack') carouselTrack!: ElementRef;

  currentIndex = 0;
  isTransitioning = false;
  autoplayInterval: Subscription | null = null;
  touchStartY = 0;

  rentalItems: RentalItem[] = [
    {
      id: 1,
      type: 'stats',
      title: 'Monthly Rentals',
      value: '1,248',
      subValue: '+18% from last month',
      description: 'Total number of items rented this month across all categories.'
    },
    {
      id: 2,
      type: 'chart',
      title: 'Growth Trajectory',
      description: 'Our rental volume has shown consistent growth over the past six months.',
      chartData: [15, 28, 32, 45, 55, 68]
    },
    {
      id: 3,
      type: 'testimonial',
      quote: "The equipment quality exceeded my expectations. Everything arrived on time and in perfect condition.",
      author: {
        name: 'Emma Richardson',
        title: 'Event Photographer'
      }
    },
    {
      id: 4,
      type: 'category',
      title: 'Equipment Categories',
      description: 'Browse our extensive collection of rental equipment.',
      categories: [
        { name: 'Photography', count: '124 items' },
        { name: 'Audio', count: '87 items' },
        { name: 'Lighting', count: '56 items' },
        { name: 'Video', count: '93 items' },
        { name: 'Computers', count: '42 items' }
      ]
    },
    {
      id: 5,
      type: 'clients',
      title: 'Client Growth',
      description: 'Our community of renters continues to expand.',
      clientData: {
        total: '12,847',
        growth: '+24%',
        period: 'year-over-year'
      }
    }
  ];

  ngOnInit(): void {
    this.startAutoplay();
  }

  ngAfterViewInit(): void {
    // Initialize any DOM-dependent functionality here
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  startAutoplay(): void {
    this.stopAutoplay();
    this.autoplayInterval = interval(4000).subscribe(() => {
      this.nextSlide();
    });
  }

  stopAutoplay(): void {
    if (this.autoplayInterval) {
      this.autoplayInterval.unsubscribe();
      this.autoplayInterval = null;
    }
  }

  goToSlide(index: number): void {
    if (this.isTransitioning || index === this.currentIndex) return;

    this.isTransitioning = true;
    this.currentIndex = index;

    setTimeout(() => {
      this.isTransitioning = false;
    }, 800);
  }

  nextSlide(): void {
    if (this.isTransitioning) return;
    const nextIndex = (this.currentIndex + 1) % this.rentalItems.length;
    this.goToSlide(nextIndex);
  }

  prevSlide(): void {
    if (this.isTransitioning) return;
    const prevIndex = (this.currentIndex - 1 + this.rentalItems.length) % this.rentalItems.length;
    this.goToSlide(prevIndex);
  }

  handleTouchStart(e: TouchEvent): void {
    this.touchStartY = e.touches[0].clientY;
    this.stopAutoplay();
  }

  handleTouchMove(e: TouchEvent): void {
    const touchY = e.touches[0].clientY;
    const diff = this.touchStartY - touchY;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
      this.touchStartY = touchY;
    }
  }

  handleTouchEnd(): void {
    this.startAutoplay();
  }

  trackByFn(index: number, item: RentalItem): number {
    return item.id;
  }
}
