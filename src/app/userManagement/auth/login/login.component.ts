import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {NgIf, NgClass, NgOptimizedImage, NgForOf, NgSwitchCase} from '@angular/common';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {CameraService} from "../../services/camera.service";
import {HumanVerificationService} from "../../services/human-verification.service";
import {error} from "jquery";
import { trigger, transition, style, animate, state } from '@angular/animations';
import {CarouselComponent} from "./carousel/carousel.component";

interface Slide {
  image: string;
  title: string;
  description: string;
  features: {
    value: string;
    label: string;
  }[];
}


interface Card {
  type: "stats" | "testimonial" | "chart"
  title?: string
  value?: string
  percentage?: string
  description?: string
  chartType?: "bar" | "line"
  author?: {
    name: string
    title: string
    avatar: string
  }
  quote?: string
  barData?: number[]
  lineData?: { x: number; y: number }[]
  colors?: string[]
}
@Component({
  selector: 'app-login',
  standalone: true,
  animations:[
    trigger('slideAnimation', [
      // Slide entering from right
      transition(':enter', [
        style({
          transform: 'translateX(100%)',
          opacity: 0
        }),
        animate('800ms ease-out',
          style({
            transform: 'translateX(0)',
            opacity: 1
          })
        )
      ]),
      // Slide exiting to left
      transition(':leave', [
        style({
          transform: 'translateX(0)',
          opacity: 1
        }),
        animate('800ms ease-out',
          style({
            transform: 'translateX(-100%)',
            opacity: 0
          })
        )
      ])
    ]),

    // Content fade-in animation
    trigger('contentAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(20px)'
        }),
        animate('600ms 300ms ease-out',
          style({
            opacity: 1,
            transform: 'translateY(0)'
          })
        )
      ])
    ])
  ],
  imports: [ReactiveFormsModule, NgIf, NgClass, NgOptimizedImage, RouterLink, NgForOf, NgSwitchCase, CarouselComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements  AfterViewInit {

  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;
  hasLogo: boolean = false;
  verificationInProgress = false;
  currentSlide = 0;
  autoplayInterval: any;
  isTransitioning = false;
  touchStartX = 0;
  touchEndX = 0;
  transitionInProgress = false;
  carouselInterval: any;
  @ViewChild('carousel') carouselElement: ElementRef | undefined;
  slides: Slide[] = [
    {
      image: "src/assets/images/products/product-140.jpg",
      title: 'Luxury Apartments',
      description: 'Experience the height of comfort and elegance in our premium selection of luxury apartments.',
      features: [
        {value: '250+', label: 'Properties'},
        {value: '99%', label: 'Customer Satisfaction'}
      ]
    },
    {
      image: 'assets/images/products/product-140.jpg',
      title: 'Beachfront Villas',
      description: 'Wake up to stunning ocean views in our exclusive collection of beachfront properties.',
      features: [
        {value: '120+', label: 'Beach Properties'},
        {value: '24/7', label: 'Concierge Service'}
      ]
    },
    {
      image: 'assets/images/products/product-140.jpg',
      title: 'Mountain Retreats',
      description: 'Escape to tranquility with our secluded mountain properties surrounded by nature.',
      features: [
        {value: '85+', label: 'Mountain Homes'},
        {value: '100%', label: 'Scenic Views'}
      ]
    }
  ];

  constructor(
    private fb: FormBuilder,
    protected authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private humanVerificationService: HumanVerificationService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngAfterViewInit(): void {
    this.startCarousel();
  }

  startCarousel(): void {
    this.carouselInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  stopAutoplay(): void {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }

  stopCarousel(): void {
    clearInterval(this.carouselInterval);
  }

  nextSlide(): void {
    if (this.isTransitioning) return;
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  prevSlide(): void {
    if (this.isTransitioning) return;
    const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }

  goToSlide(index: number): void {
    if (this.isTransitioning || this.currentSlide === index) {
      return;
    }

    this.stopAutoplay();
    this.isTransitioning = true;

    // Get elements
    const currentSlideEl = document.querySelector(`.carousel-slide:nth-child(${this.currentSlide + 1})`);
    const nextSlideEl = document.querySelector(`.carousel-slide:nth-child(${index + 1})`);

    if (currentSlideEl && nextSlideEl) {
      // Update current slide
      this.currentSlide = index;

      // Reset transition after animation completes
      setTimeout(() => {
        this.isTransitioning = false;
        this.startAutoplay();
      }, 1000);
    } else {
      this.currentSlide = index;
      this.isTransitioning = false;
      this.startAutoplay();
    }
  }

  startAutoplay(): void {
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, 6000); // Change slide every 6 seconds
  }

  updateCarouselPosition(): void {
    if (this.carouselElement) {
      const translateValue = -this.currentSlide * 100;
      this.carouselElement.nativeElement.style.transform = `translateX(${translateValue}%)`;
    }
  }


  markEmailAsTouched() {
    this.loginForm.get('email')?.markAsTouched();
  }

  markPasswordAsTouched() {
    this.loginForm.get('password')?.markAsTouched();
  }

  async onSubmit() {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      this.errorMessage = 'Please correct the errors in the form';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.isLoading = true;
    this.errorMessage = '';

    // 🚨 Verify user is human before proceeding
    try {
      this.verificationInProgress = true;
      this.errorMessage = '';

      const isHuman = await this.humanVerificationService.verifyBlink();

      if (!isHuman) {
        this.errorMessage = "Human verification failed. Please try again.";
        return;
      }
    } catch (error) {
      console.error('Verification error:', error);
      this.errorMessage = "Error during human verification. Please try again.";
      return;
    } finally {
      this.verificationInProgress = false;
    }
    const {email, password} = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {

        this.isLoading = false;
        this.authService.getUserDetailsFromServer().subscribe((user) => {
          console.log(user); // Now you have the user details in the localStorage
        });
        // Store token
        this.authService.setToken(res.token);

        // Redirect
        if (res.role === 'ROLE_ADMIN') {
          window.location.href = 'http://www.rentify.duckdns.org:4201'; // adjust if needed

          // this.router.navigate(['/dashboard']);
        } else if (res.role === 'ROLE_USER') {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = this.getFriendlyErrorMessage(err);
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private getFriendlyErrorMessage(error: any): string {
    if (!error) return 'An unexpected error occurred. Please try again later.';

    const errorStr = typeof error === 'string' ? error.toLowerCase() : error.message?.toLowerCase() || '';

    if (errorStr.includes('locked')) {
      return 'Your account has been temporarily locked due to multiple failed attempts. Please try again in 30 minutes or contact support.';
    } else if (errorStr.includes('not verified') || errorStr.includes('verify')) {
      return 'Please verify your email address before logging in. Check your inbox for the verification link.';
    } else if (errorStr.includes('credentials') || errorStr.includes('invalid') || errorStr.includes('incorrect')) {
      return 'The email or password you entered is incorrect. Please try again.';
    } else if (errorStr.includes('network')) {
      return 'Network error. Please check your internet connection and try again.';
    } else if (errorStr.includes('timeout')) {
      return 'The request timed out. Please check your connection and try again.';
    } else if (errorStr.includes('required') || errorStr.includes('empty')) {
      return 'Please fill in all required fields.';
    } else {
      return 'Login failed. Please check your credentials and try again.';
    }
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  loginWithFacebook() {
    this.authService.loginWithFacebook();
  }


  openFaceLogin() {

  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  private getSlideElement(index: number): HTMLElement | null {
    if (!this.carouselElement) return null;

    const slides = this.carouselElement.nativeElement.querySelectorAll('.carousel-slide');
    return slides[index] || null;
  }

// Touch events for mobile swipe
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].clientX;
    this.handleSwipe();
  }

  handleSwipe(): void {
    const swipeThreshold = 50;
    const swipeDistance = this.touchEndX - this.touchStartX;

    if (swipeDistance > swipeThreshold) {
      // Swiped right, go to previous slide
      this.prevSlide();
    } else if (swipeDistance < -swipeThreshold) {
      // Swiped left, go to next slide
      this.nextSlide();
    }
  };
  getLinePath(data: { x: number; y: number }[] | undefined): string {
    if (!data || data.length === 0) return '';
    return (
      'M' +
      data
        .map((point, i) =>
          i === 0
            ? `${point.x},${80 - point.y}`
            : ` L${point.x},${80 - point.y}`
        )
        .join('')
    );
  }



}

