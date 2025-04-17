import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product';
import { Observable, of } from 'rxjs';
import { environment } from "../environments/environment";
import {Category} from "../models/category";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8084/api/products'; // Update the API URL as needed

  constructor(private http: HttpClient) {}

  create(product: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/upload`, product);
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  updateProduct(id: number, product: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    if (!categoryId) {
      console.error('Invalid categoryId');
      return of([]); // Return an empty array in case of invalid categoryId
    }
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`);
  }

}
