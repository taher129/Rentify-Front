import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReservationService } from '../../services/reservation.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import jsPDF from "jspdf";
import { Reservation } from "../../models/reservation";
import {UserDetails} from "../../userManagement/models/user";
import {AuthService} from "../../userManagement/services/auth.service";

interface BookingViewModel {
  id?: number;
  productName: string;
  productAddress: string;
  startDateTime: Date;
  endDateTime: Date;
  bookedBy: string;
  status: 'upcoming' | 'completed' | 'canceled' | 'rejected';
  totalPrice: number;
  productImgPath: string;
  productCategory?: number;
  reservationDetails: Reservation;
  productDetails?: Product;
  userDetails?: UserDetails;
}

@Component({
  selector: 'app-myreservation',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './myreservation.component.html',
  styleUrls: ['./myreservation.component.css']
})
export class MyreservationComponent implements OnInit {
  activeTab: 'upcoming' | 'canceled' | 'completed' = 'upcoming';

  allBookings: BookingViewModel[] = [];
  upcomingBookings: BookingViewModel[] = [];
  completedBookings: BookingViewModel[] = [];
  canceledBookings: BookingViewModel[] = [];

  isLoading: boolean = true;
  error: string | null = null;

  // User details from auth service
  currentUser: UserDetails | null = null;

  constructor(
    private reservationService: ReservationService,
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get user details from auth service
    this.loadUserDetails();
  }

  loadUserDetails(): void {
    // Get the authentication token (you may need to adjust this based on how you store the token)
    const token = this.authService.getToken(); // Assuming you have a getToken method

    if (token) {
      // Get user details using the token
      this.currentUser = this.authService.getUserDetails(token);

      if (this.currentUser && this.currentUser.id) {
        // Load reservations once we have the user details
        this.loadReservations();
      } else {
        this.error = 'User details not found. Please login again.';
        this.isLoading = false;
      }
    } else {
      this.error = 'You are not logged in. Please login to view your reservations.';
      this.isLoading = false;
    }
  }

  loadReservations(): void {
    if (!this.currentUser || !this.currentUser.id) {
      this.error = 'User ID not found. Please login again.';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.reservationService.showMyBookingByUserId(this.currentUser.id).subscribe({
      next: (reservations: Reservation[]) => {
        this.processReservations(reservations);
      },
      error: (err) => {
        this.error = 'Failed to load reservations. Please try again later.';
        this.isLoading = false;
        console.error('Error loading reservations:', err);
      }
    });
  }

  processReservations(reservations: Reservation[]): void {
    // Reset collections
    this.allBookings = [];
    this.upcomingBookings = [];
    this.completedBookings = [];
    this.canceledBookings = [];

    if (reservations.length === 0) {
      this.isLoading = false;
      return;
    }

    // Create an array of product ID observables
    const productObservables: Observable<Product>[] = [];

    // Collect unique product IDs
    const uniqueProductIds = new Set<number>();
    reservations.forEach(reservation => {
      if (reservation.productId) {
        uniqueProductIds.add(reservation.productId);
      }
    });

    // Create an observable for each product ID
    uniqueProductIds.forEach(productId => {
      productObservables.push(
        this.productService.getProductById(productId).pipe(
          catchError(error => {
            console.error(`Error fetching product with ID ${productId}:`, error);
            // Return a default product in case of error
            return of({
              id: productId,
              name: 'Unknown Product',
              price: 0,
              description: 'Product information not available',
              productImage: '/assets/placeholder.jpg'
            } as Product);
          })
        )
      );
    });

    // If there are no products to fetch, finish loading
    if (productObservables.length === 0) {
      this.isLoading = false;
      return;
    }

    // Fetch all products in parallel
    forkJoin(productObservables).subscribe({
      next: (products: Product[]) => {
        // Create a map of productId to Product
        const productMap = new Map<number, Product>();
        products.forEach(product => {
          if (product.id) {
            productMap.set(product.id, product);
          }
        });

        // Process each reservation with the fetched product data
        reservations.forEach((reservation: Reservation) => {
          const productId = reservation.productId;
          if (!productId) return;

          const product = productMap.get(productId);
          if (!product) return;

          // Use current user details for bookedBy
          const bookedBy = this.currentUser ?
            `${this.currentUser.firstName} ${this.currentUser.lastName}` :
            'Unknown User';

          const startDate = new Date(reservation.startDate);
          const endDate = new Date(reservation.endDate);

          // Determine status based on reservation status
          let status: 'upcoming' | 'completed' | 'canceled' | 'rejected';
          if (reservation.status === 'canceled') {
            status = 'canceled';
          } else if (reservation.status === 'rejected') {
            status = 'rejected';
          } else if (endDate < new Date()) {
            status = 'completed';
          } else {
            status = 'upcoming';
          }

          // Get the category name from the product or use a default
          const categoryName = product.categoryId ? `Category ${product.categoryId}` : 'Uncategorized';

          const booking: BookingViewModel = {
            productName: product.name || 'Unnamed Product',
            productAddress: product.description?.split('\n')[0] || 'No address available',
            startDateTime: startDate,
            endDateTime: endDate,
            bookedBy: bookedBy,
            status: status,
            totalPrice: reservation.totalPrice || 0,
            productImgPath: product.productImage || '/assets/placeholder.jpg',
            productCategory: product.categoryId,
            reservationDetails: reservation,
            productDetails: product,
            userDetails: this.currentUser || undefined
          };

          this.allBookings.push(booking);

          // Add to appropriate collection based on status
          if (status === 'upcoming') {
            this.upcomingBookings.push(booking);
          } else if (status === 'completed') {
            this.completedBookings.push(booking);
          } else if (status === 'canceled' || status === 'rejected') {
            this.canceledBookings.push(booking);
          }
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.error = 'Failed to load product information. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  setActiveTab(tab: 'upcoming' | 'canceled' | 'completed'): void {
    this.activeTab = tab;
  }

  formatDate(date: Date): string {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  calculateDuration(start: Date, end: Date): string {
    if (!(start instanceof Date)) {
      start = new Date(start);
    }
    if (!(end instanceof Date)) {
      end = new Date(end);
    }

    const durationMs = end.getTime() - start.getTime();
    const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''}${hours > 0 ? `, ${hours} hour${hours !== 1 ? 's' : ''}` : ''}`;
    } else {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
  }

  getCategoryIcon(categoryId: number | null | undefined): string {
    // Handle null/undefined case right away
    if (categoryId == null) {  // This covers both null and undefined
      return '📦'; // Default icon
    }

    // Map category IDs to their respective icons
    const categoryIcons: { [key: number]: string } = {
      1: '🚗', // Car
      2: '💻', // IT & Multimedia
      3: '🏠', // Home
      4: '⛺', // Camping
      5: '🏗️', // Building
      6: '🚲', // Eco-Friendly Mobility
      7: '⚽', // Sports
      8: '🎉', // Events & Party
      9: '🧹', // Cleaning Equipment
      10: '💼'  // Work & Office
    };

    // Return the icon for the given category ID, or a default icon if not found
    return categoryIcons[categoryId] || '📦';
  }

  cancelBooking(booking: BookingViewModel): void {
    const reservationId = booking.reservationDetails.id;

    if (!reservationId) return;

    this.reservationService.updateReservationStatus(reservationId, 'canceled')
      .subscribe({
        next: () => {
          // Update the UI after status change
          booking.status = 'canceled';

          // Re-process bookings to reflect updated tab data
          this.loadReservations(); // or manually move it between arrays
        },
        error: (err) => {
          console.error('Failed to cancel booking:', err);
        }
      });
  }

  downloadpdf(booking: BookingViewModel): void {
    // Create a new PDF document
    const doc = new jsPDF('p', 'mm', 'a4');

    // Add background color
    doc.setFillColor(248, 249, 250);
    doc.rect(0, 0, 210, 297, 'F');

    const img = new Image();
    img.src = booking.productImgPath;
    img.onload = () => {
      doc.addImage(img, 'JPEG', 0, 0, 210, 80);
      this.continuePdfGeneration(doc, booking);
    };

    // If the image fails to load, continue with the PDF generation
    img.onerror = () => {
      this.continuePdfGeneration(doc, booking);
    };
  }

  private continuePdfGeneration(doc: jsPDF, booking: BookingViewModel): void {
    // Set fonts and colors
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);

    // Add destination title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(81, 45, 168); // Purple color like in template
    doc.text(booking.productName, 105, 120, { align: 'center' });

    // Create a table-like structure for booking details
    const startY = 135;
    const middleCol = 60;
    const leftCol = 25;
    const rightCol = 160;
    const lineHeight = 12;

    // Set text properties for details
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');

    // Booking ID
    doc.text('Booking ID:', leftCol, startY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(booking.reservationDetails.id?.toString() || 'BS-' + Math.floor(Math.random() * 100000), middleCol, startY);

    // Date
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Date:', rightCol - 65, startY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(new Date().toLocaleDateString(), rightCol - 30, startY);

    // Booked by
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Booked by:', leftCol, startY + lineHeight);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(booking.bookedBy, middleCol, startY + lineHeight);

    // Tour Date
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Tour Date:', rightCol - 65, startY + lineHeight);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(this.formatDate(booking.startDateTime).split(',')[0], rightCol - 30, startY + lineHeight);

    // Payment Method
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Payment Method:', leftCol, startY + lineHeight * 2);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Credit card', middleCol, startY + lineHeight * 2);

    // Total Price
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Total Price:', leftCol, startY + lineHeight * 3);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('$' + booking.totalPrice.toString(), middleCol, startY + lineHeight * 3);

    // Add accommodation information
    const accommodationY = startY + lineHeight * 5;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Accommodation Details', leftCol, accommodationY);

    // Address
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Address:', leftCol, accommodationY + lineHeight);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(booking.productAddress, leftCol + 60, accommodationY + lineHeight);

    // Pick-up
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Pick-up:', leftCol, accommodationY + lineHeight * 3);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(this.formatDate(booking.startDateTime), leftCol + 60, accommodationY + lineHeight * 3);

    // Return
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Return:', leftCol, accommodationY + lineHeight * 4);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(this.formatDate(booking.endDateTime), leftCol + 60, accommodationY + lineHeight * 4);

    // Add footer
    const footerY = 270;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for booking with us. For any assistance, please contact customer support.', 105, footerY, { align: 'center' });
    doc.text('Booking confirmation - ' + new Date().toLocaleDateString(), 105, footerY + 5, { align: 'center' });

    // Download the PDF
    doc.save(`booking-${booking.reservationDetails.id || 'confirmation'}.pdf`);
  }
}
