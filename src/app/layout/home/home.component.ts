// home.component.ts
import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';
import {CurrencyPipe, NgForOf, NgIf, NgStyle} from "@angular/common";
import {RouterLink} from "@angular/router";
import {SlickCarouselModule} from "ngx-slick-carousel";
import {TopProductDTO} from "../../models/TopProductDTO";
import { HttpClient } from '@angular/common/http';
import {Product} from "../../models/product";
import {ProductService} from "../../services/product.service";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    NgStyle,
    NgForOf,
    RouterLink,
    SlickCarouselModule,
    NgIf,
    CurrencyPipe
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  randomCategories: Category[] = [];
  categories: any[] = [];
  topProducts: (Product & {reservationCount: number})[] = [];
  isLoading = true;
  error: string | null = null;


  slideConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    dots: true,
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true, // Add this for infinite scrolling
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };
  constructor(private categoryService: CategoryService , private productService: ProductService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadTopProducts();

    this.categoryService.getAllCategories().subscribe({
      next: (categories: Category[]) => {
        const fullUrlCategories = categories.map(cat => ({
          ...cat,
          categoryImage: 'http://www.rentify.duckdns.org:8084' + cat.categoryImage
        }));
        this.randomCategories = this.shuffleArray(fullUrlCategories).slice(0, 4);
      },
      error: err => {
        console.error('Error loading categories', err);
      }
    });
  }


  shuffleArray(array: Category[]): Category[] {
    return array.sort(() => Math.random() - 0.5);
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories: any[]) => {
        // Map categories to include full image URLs
        this.categories = categories.map(category => ({
          ...category,
          categoryImage: 'http://www.rentify.duckdns.org:8084' + category.categoryImage
        }));
      },
      error: (err) => console.error('Error loading categories', err)
    });
  }

  loadTopProducts(): void {
    this.isLoading = true;
    this.error = null;

    this.productService.getTopProductsWithDetails(8).subscribe({
      next: (products: (Product & { reservationCount: number; })[]) => {
        this.topProducts = products;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to load top products:', err);
        this.error = 'Could not load popular products. Please try again later.';
        this.isLoading = false;
      }
    });
  }
  getProductImage(product: Product): string {
    if (!product?.productImage) {
      return 'assets/images/default-product.png'; // Fallback image
    }

    // If image already has full URL, return as-is
    if (product.productImage.startsWith('http')) {
      return product.productImage;
    }

    // Prepend base URL for relative paths
    return `http://www.rentify.duckdns.org:8084${product.productImage}`;
  }
}
