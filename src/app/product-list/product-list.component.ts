import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, NgForOf } from '@angular/common';
import {Subject, takeUntil, tap} from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgForOf,
    RouterLink
  ],
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged(),
      tap(params => {
        const categoryId = params.get('categoryId');
        if (categoryId) {
          this.loadProductsByCategory(+categoryId);
        } else {
          this.loadAllProducts();
        }
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProductsByCategory(categoryId: number): void {
    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (data: Product[]) => {
        this.products = this.processProductImages(data);
      },
      error: (error) => {
        console.error('Error loading products by category', error);
      }
    });
  }

  loadAllProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.products = this.processProductImages(data);
      },
      error: (error) => {
        console.error('Error loading all products', error);
      }
    });
  }

  private processProductImages(products: Product[]): Product[] {
    return products.map(product => {
      // Use the uploads path from your Nginx configuration
      // This will route through your Nginx proxy to the correct service
      if (product.productImage && !product.productImage.startsWith('http')) {
        product.productImage = `${product.productImage.replace(/^\/+/, '')}`;
      }
      return product;
    });
  }
}
