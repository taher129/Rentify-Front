import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {Review, ReviewSummary, ReviewRequest, ReviewService} from "../services/review.service";
//import {  Review, ReviewSummary, ReviewRequest, ReviewService } from '../../../../Rentify-Admin-Front/src/app/pages/service/reviews/review.service';

@Component({
  selector: 'app-customer-review',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './customer-review.component.html',
  styleUrl: './customer-review.component.scss',
  providers: [ReviewService]
})
export class CustomerReviewComponent implements OnInit {
  @Input() productId: number = 1; // Default value, should be provided by parent component

  averageRating: number = 0;
  totalReviews: number = 0;
  ratingDistribution: { percentage: number, stars: number }[] = [];
  userRating: number = 5;
  userReviewText: string = '';

  reviews: Review[] = [];
  displayedReviews: number = 2; // Initially show 2 reviews
  isLoading: boolean = false;

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.loadReviewData();
  }

  loadReviewData(): void {
    this.isLoading = true;

    // Get review summary (average rating, distribution, etc.)
    this.reviewService.getReviewSummary(this.productId).subscribe({
      next: (summary: ReviewSummary) => {
        this.averageRating = summary.averageRating;
        this.totalReviews = summary.totalReviews;
        this.ratingDistribution = summary.ratingDistribution;
      },
      error: (error) => {
        console.error('Error fetching review summary:', error);
      }
    });

    // Get reviews for this product
    this.reviewService.getReviewsByProductId(this.productId).subscribe({
      next: (reviews: Review[]) => {
        this.reviews = reviews;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching reviews:', error);
        this.isLoading = false;
      }
    });
  }

  submitReview(): void {
    if (!this.userReviewText.trim()) {
      alert('Please enter a review comment');
      return;
    }

    const reviewRequest: ReviewRequest = {
      productId: this.productId,
      comment: this.userReviewText,
      rating: this.userRating,
      images: [] // In a real app, you'd handle image uploads here
    };

    this.isLoading = true;
    this.reviewService.submitReview(reviewRequest).subscribe({
      next: (review: Review) => {
        // Add the new review to the top of our list
        this.reviews.unshift(review);

        // Reset form
        this.userReviewText = '';
        this.userRating = 5;

        // Reload summary data to reflect the new review
        this.loadReviewData();
      },
      error: (error) => {
        console.error('Error submitting review:', error);
        this.isLoading = false;
        alert('Failed to submit review. Please try again.');
      }
    });
  }

  loadMoreReviews(): void {
    this.displayedReviews = this.reviews.length;
  }

  // Helper method for star display
  generateStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.floor(rating) ? 1 : (i < rating ? 0.5 : 0));
  }
}
