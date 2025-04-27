import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { CurrencyPipe, NgIf } from "@angular/common";
import { Address } from '../models/address';
import { LeafletComponent } from "../leaflet/leaflet.component";
import { Subject, takeUntil } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {CustomerReviewComponent} from "../customer-review/customer-review.component";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgIf,
    LeafletComponent,
    RouterLink,
    CustomerReviewComponent
  ],
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product!: Product;
  address: Address = {
    city: 'gabes',
    state: 'metouia',
    country: 'Tunisie',
    zipCode: '6010'
  };
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Mocked address:', this.address);

    this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      switchMap(params => {
        const productId = Number(params.get('id'));
        return this.productService.getProductById(productId);
      })
    ).subscribe({
      next: (data) => {
        if (data.productImage && !data.productImage.startsWith('http')) {
          data.productImage = 'http://localhost:8084' + data.productImage;
        }
        this.product = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching product:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
