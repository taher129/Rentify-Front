import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product';
import {forkJoin, map, Observable, of} from 'rxjs';
import { environment } from "../environments/environment";
import {Category} from "../models/category";
import {TopProductDTO} from "../models/TopProductDTO";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8084/api/products'; // Update the API URL as needed
  private apiUrlReservation = 'http://localhost:8086/api/reservations'; // Update the API URL as needed

  constructor(private http: HttpClient) {
  }


  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    if (!categoryId) {
      console.error('Invalid categoryId');
      return of([]); // Return an empty array in case of invalid categoryId
    }
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  searchProduct(query: string): Observable<Product[]> {
    if (!query.trim()) {
      return of([]);
    }
    return this.http.get<any[]>(`${this.apiUrl}/search?query=${encodeURIComponent(query)}`).pipe(
      map(response =>
        response.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          productImage: item.productImage
        }))
      )
    );
  }

  // Get top reserved products (from reservation service)
  getTopReservedProducts(): Observable<{productId: number, reservationCount: number}[]> {
    return this.http.get<{productId: number, reservationCount: number}[]>(
      `${this.apiUrlReservation}/top-products`
    );
  }

  // Get combined top products with details
  getTopProductsWithDetails(limit: number = 5): Observable<(Product & {reservationCount: number})[]> {
    return forkJoin({
      topProducts: this.getTopReservedProducts(),
      allProducts: this.getAllProducts()
    }).pipe(
      map(({topProducts, allProducts}) => {
        // Create product map for quick lookup
        const productMap = new Map<number, Product>();
        allProducts.forEach(product => {
          if (product.id) productMap.set(product.id, product);
        });

        // Combine data and limit results
        return topProducts
          .map(item => ({
            ...productMap.get(item.productId),
            reservationCount: item.reservationCount
          }))
          .filter(product => product.id) // Filter out undefined products
          .slice(0, limit); // Get top N products
      })
    );
  }
}

