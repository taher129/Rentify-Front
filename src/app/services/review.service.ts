import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Rating {
  id: number;
  productId: number;
  userId: number;
  value: number;
}

export interface Review {
  id: number;
  userName: string;
  userImage: string;
  date: string;
  rating: number;
  description: string;       // Champ description pour l'utilisateur
  reviewsWritten: number;
  comment?: string;          // Champ comment pour le manager (optionnel)
  images?: string[];
  isManager?: boolean;
  productId: number;
  userId: number;
  parentReviewId: number;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { percentage: number, stars: number }[];
}

export interface ReviewRequest {
  productId: number;
  description: string;       // Changé de comment à description
  rating: number;
  images?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:8085/reviews';

  // Mock user ID for demo purposes - in a real app, this would come from auth service
  private userId = 1;

  constructor(private http: HttpClient) { }

  getAllReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/all`);
  }

  getReviewsByProductId(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/product/${productId}`);
  }

  getReviewSummary(productId: number): Observable<ReviewSummary> {
    return this.http.get<ReviewSummary>(`${this.apiUrl}/product/${productId}/summary`);
  }

  submitReview(reviewRequest: ReviewRequest): Observable<Review> {
    // Utiliser le nouvel endpoint create/{userId}
    return this.http.post<Review>(`${this.apiUrl}/create/${this.userId}`, reviewRequest);
  }

  submitManagerResponse(reviewId: number, comment: string): Observable<Review> {
    // Utiliser le nouvel endpoint PATCH /{reviewId}/manager-response
    return this.http.patch<Review>(`${this.apiUrl}/${reviewId}/manager-response?comment=${comment}`, {});
  }
}
