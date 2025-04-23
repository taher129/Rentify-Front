import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product';
import {map, Observable, of} from 'rxjs';
import { environment } from "../environments/environment";
import {Category} from "../models/category";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8084/api/products'; // Update the API URL as needed

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
}
