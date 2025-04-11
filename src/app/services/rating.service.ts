import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  private apiUrl = 'http://localhost:8085/ratings';

  constructor(private http: HttpClient) {}

  // Pour créer une nouvelle note
  createRating(ratingData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, ratingData);
  }

  // Pour mettre à jour une note existante
  updateRating(ratingId: number, ratingData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${ratingId}`, ratingData);
  }

  // Pour récupérer les notes par utilisateur et produit
  getRatingsByUserAndProduct(userId: number, productId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}/product/${productId}`);
  }
}