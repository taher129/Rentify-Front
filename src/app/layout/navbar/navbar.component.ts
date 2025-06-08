import { Component, ChangeDetectorRef } from '@angular/core';
import { Product } from "../../models/product";
import { Category } from "../../models/category";
import { CategoryService } from "../../services/category.service";
import { ProductService } from "../../services/product.service";
import {NavigationEnd, Router, RouterLink} from "@angular/router";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';
import {NavChatContainerComponent} from "../../reservation-service/nav-chat-container/nav-chat-container.component";
import {MessageService} from "../../services/message.service";
import {AuthService} from "../../userManagement/services/auth.service";


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    FormsModule,
    CurrencyPipe,
    RouterModule,
    NavChatContainerComponent,
    NgIf
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isProfilePage: boolean = false;
  isLoggedIn = false;
  isChatOpen: boolean = false;
  isNotificationsOpen: boolean = false;
  isProfileOpen: boolean = false;
  unreadMessages: number = 0;
  products: Product[] = [];
  selectedCategoryId: number | null = null;
  searchQuery: string = '';
  categories: Category[] = [];

  isSticky: boolean = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {
  }

  toggleChat(event: Event): void {
    event.stopPropagation();
    this.isChatOpen = !this.isChatOpen;

    // Reset unread count when opening chat
    if (this.isChatOpen) {
      this.messageService.resetUnreadCount();
    }

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
    this.loadCategories();
    this.categoryService.getAllCategories().subscribe({
      next: (data: Category[]) => (this.categories = data),
      error: (err: any) => console.error('Failed to load categories', err),
    });

    // Subscribe to unread message count
    this.messageService.unreadMessages$.subscribe(count => {
      console.log('NavbarComponent: Received unread count update:', count);
      this.unreadMessages = count;
      this.cdr.detectChanges();
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onCategoryChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCategoryId = value !== '' ? parseInt(value, 10) : null;
    this.searchQuery = '';

    if (this.selectedCategoryId !== null) {
      this.productService.getProductsByCategory(this.selectedCategoryId).subscribe({
        next: (data: Product[]) => {
          this.products = data.map(product => {
            // Fixed: Use relative path through nginx proxy instead of hardcoded URL
            if (product.productImage && !product.productImage.startsWith('http')) {
              product.productImage = '' + product.productImage;
            }
            return product;
          });
          console.log('Products from category:', this.products);
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Category fetch error:', err);
          this.products = [];
          this.cdr.detectChanges(); // Force change detection
        },
      });
    } else {
      this.products = [];
      this.cdr.detectChanges(); // Force change detection
    }
  }

  onSearch(event: Event): void {
    event.preventDefault();
    this.selectedCategoryId = null;

    if (this.searchQuery.trim()) {
      this.productService.searchProduct(this.searchQuery).subscribe({
        next: (data: Product[]) => {
          this.products = data.map(product => {
            // Fixed: Use relative path through nginx proxy instead of hardcoded URL
            if (product.productImage && !product.productImage.startsWith('http')) {
              product.productImage = '' + product.productImage;
            }
            return product;
          });
          console.log('Products from search:', this.products);
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Search error:', err);
          this.products = [];
          this.cdr.detectChanges(); // Force change detection
        },
      });
    } else {
      this.products = [];
      this.cdr.detectChanges(); // Force change detection
    }
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Failed to load categories', err),
    });
  }
}
