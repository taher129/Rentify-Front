import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CurrencyPipe, NgForOf} from '@angular/common';
import {environment} from "../environments/environment";

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
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categoryId: number | undefined;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const categoryIdParam = this.route.snapshot.paramMap.get('categoryId');
    this.categoryId = categoryIdParam ? Number(categoryIdParam) : undefined;

    if (this.categoryId) {
      this.loadProductsByCategory();
    } else {
      this.loadAllProducts();
    }
  }



  loadProductsByCategory(): void {
    if (this.categoryId) {
      this.productService.getProductsByCategory(this.categoryId).subscribe({
        next: (data: Product[]) => {
          this.products = data.map(product => {
            if (product.productImage && !product.productImage.startsWith('http')) {
              product.productImage = 'http://localhost:8084' + product.productImage;
            }
            return product;
          });
        },
        error: (error) => {
          console.error('Error loading products by category', error);
        }
      });
    }
  }

  loadAllProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data.map(product => {
          if (product.productImage && !product.productImage.startsWith('http')) {
            product.productImage = 'http://localhost:8084' + product.productImage;
          }
          return product;
        });
      },
      error: (error) => {
        console.error('Error loading all products', error);
      }
    });
  }



}
