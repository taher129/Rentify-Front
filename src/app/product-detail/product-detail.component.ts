import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import {CurrencyPipe, NgIf} from "@angular/common";
import { Address } from '../models/address';
import {LeafletComponent} from "../leaflet/leaflet.component";


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgIf,
    LeafletComponent
  ],
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
  address: Address = {
    city: 'gabes',
    state: 'metouia',
    country: 'Tunisie',
    zipCode: '6010'
  };
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Mocked address:', this.address);
    this.productService.getProductById(productId).subscribe({
      next: (data) => {
        if (data.productImage && !data.productImage.startsWith('http')) {
          data.productImage = 'http://localhost:8084' + data.productImage;
        }
        this.product = data;
      },
      error: (err) => {
        console.error('Error fetching product:', err);
      }
    });
  }

}
