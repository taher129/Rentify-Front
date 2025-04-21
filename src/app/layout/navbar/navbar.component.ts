import { Component, ChangeDetectorRef } from '@angular/core';
import { Product } from "../../models/product";
import { Category } from "../../models/category";
import { CategoryService } from "../../services/category.service";
import { ProductService } from "../../services/product.service";
import { RouterLink } from "@angular/router";
import { CurrencyPipe, NgForOf } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    FormsModule,
    CurrencyPipe
  ],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  products: Product[] = [];
  selectedCategoryId: number | null = null;
  searchQuery: string = '';
  categories: Category[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data: Category[]) => (this.categories = data),
      error: (err: any) => console.error('Failed to load categories', err),
    });
  }

  onCategoryChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCategoryId = value !== '' ? parseInt(value, 10) : null;
    this.searchQuery = '';

    if (this.selectedCategoryId !== null) {
      this.productService.getProductsByCategory(this.selectedCategoryId).subscribe({
        next: (data: Product[]) => {
          this.products = data.map(product => {
            product.productImage = 'http://localhost:8084' + product.productImage;
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
            if (product.productImage && !product.productImage.startsWith('http')) {
              product.productImage = 'http://localhost:8084' + product.productImage;
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
}
