// import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
// import { RatingService } from '../services/rating.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-rating',
//   templateUrl: './rating.component.html',
//   styleUrls: ['./rating.component.css'],
//   schemas: [CUSTOM_ELEMENTS_SCHEMA],
//   standalone: true,
//   imports: [CommonModule],
// })
// export class RatingComponent implements OnInit {
//   ratingValue: number = 0;
//   hoverIndex: number | null = null;
//   hoverMessage: string = '';
//   userId: number = 3;
//   productId: number = 1;
//   existingRating: any;
//   messages: string[] = ['Not great', 'Fair', 'Good', 'Very good', 'Excellent'];
//   showPopup: boolean = false;

//   constructor(private ratingService: RatingService) {}

//   ngOnInit(): void {
//     this.loadUserRating();
//   }

//   loadUserRating(): void {
//     this.ratingService.getRatingsByUserAndProduct(this.userId, this.productId).subscribe(
//       (ratings) => {
//         if (ratings && ratings.length > 0) {
//           this.existingRating = ratings[0];
//           this.ratingValue = this.existingRating.value ?? 0;
//         }
//       }
//     );
//   }

//   selectRating(index: number): void {
//     this.ratingValue = index + 1;

//     const ratingData = {
//       userId: this.userId,
//       productId: this.productId,
//       value: this.ratingValue
//     };

//     if (this.existingRating) {
//       this.ratingService.updateRating(this.existingRating.ratingId, ratingData).subscribe(
//         updated => {
//           console.log('Mise à jour réussie', updated);
//           this.showConfirmation();
//         }
//       );
//     } else {
//       this.ratingService.createRating(ratingData).subscribe(
//         created => {
//           console.log('Création réussie', created);
//           this.existingRating = created;
//           this.showConfirmation();
//         }
//       );
//     }
//   }

//   onHover(index: number): void {
//     this.hoverIndex = index;
//     this.hoverMessage = this.messages[index];
//   }

//   onLeave(): void {
//     this.hoverIndex = null;
//     this.hoverMessage = '';
//   }

//   private showConfirmation(): void {
//     this.showPopup = true;
//     setTimeout(() => this.showPopup = false, 2000); // disparaît après 2s
//   }
// }
