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
  reviewsWritten: number;
  comment: string;
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
  comment: string;
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
    const headers = new HttpHeaders().set('User-Id', this.userId.toString());
    return this.http.post<Review>(this.apiUrl, reviewRequest, { headers });
  }

  submitManagerResponse(productId: number, comment: string): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/manager-response`, 
      { productId, comment },  // Changed to send both productId and comment in the request body
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }
    );
  }
}