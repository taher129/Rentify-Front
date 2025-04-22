import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReservationService } from '../../services/reservation.service';

import jsPDF from "jspdf";
import {Reservation} from "../../models/reservation";
export interface Product {
  productId: number | null;
  productName: string;
  productAddress: string;
  productPrice: number;
  productImgPath: string;
  productCategory: string;
  productRatingValue: number;
  productShortDescription: string;
}
export interface User {
  userId: number | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: number;
  isLoggedIn: boolean;
}
interface BookingViewModel {
  id?: number;
  productName: string;
  productAddress: string;
  startDateTime: Date;
  endDateTime: Date;
  bookedBy: string;
  status: 'upcoming' | 'completed' | 'canceled'|'rejected';
  totalPrice: number;
  productImgPath: string;
  productCategory: string;
  reservationDetails: Reservation;
  productDetails?: Product;
  userDetails?: User;
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

  // Mock user with userId = 1
  mockUser: User = {
    userId: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: 1234567890,
    isLoggedIn: true
  };

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.isLoading = true;
    this.reservationService.showMyBookingByUserId(this.mockUser.userId).subscribe({
      next: (reservations: Reservation[]) => {
        this.processReservations(reservations);
        this.isLoading = false;
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

    // Mock data for products (in real app, you'd fetch this)
    const mockProducts: { [key: number]: Product } = {
      1: {
        productId: 1,
        productName: 'Luxury Beach Villa',
        productAddress: '123 Ocean Drive, Miami Beach',
        productPrice: 450,
        productImgPath: '/assets/beach-villa.jpg',
        productCategory: 'Villa',
        productRatingValue: 4.8,
        productShortDescription: 'Beachfront villa with private pool'
      },
      2: {
        productId: 2,
        productName: 'Downtown Apartment',
        productAddress: '456 Main St, New York',
        productPrice: 200,
        productImgPath: '/assets/downtown-apt.jpg',
        productCategory: 'Apartment',
        productRatingValue: 4.5,
        productShortDescription: 'Modern apartment in city center'
      },
      3: {
        productId: 3,
        productName: 'Mountain Cabin',
        productAddress: '789 Pine Trail, Aspen',
        productPrice: 350,
        productImgPath: '/assets/mountain-cabin.jpg',
        productCategory: 'Cabin',
        productRatingValue: 4.9,
        productShortDescription: 'Cozy cabin with mountain view'
      }
    };

    // Process each reservation
    reservations.forEach((reservation: Reservation) => {
      const productId = reservation.productId || 1;
      const userId = reservation.userId || 1;

      const product = mockProducts[productId];

      // Check if product is defined before accessing its properties
      const bookedBy = `${this.mockUser.firstName} ${this.mockUser.lastName}`;

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

      // Ensure status is correctly set before pushing into the booking array
      const booking: BookingViewModel = {
        productName: product.productName,
        productAddress: product.productAddress,
        startDateTime: startDate,
        endDateTime: endDate,
        bookedBy: bookedBy,
        status: status,
        totalPrice: reservation.totalPrice || 0,
        productImgPath: product.productImgPath,
        productCategory: product.productCategory,
        reservationDetails: reservation,
        productDetails: product,
        userDetails: this.mockUser
      };

      this.allBookings.push(booking);

      // Add to appropriate collection based on status
      if (status === 'upcoming') {
        this.upcomingBookings.push(booking);
      } else if (status === 'completed') {
        this.completedBookings.push(booking);
      } else if (status === 'canceled'|| status === 'rejected') {
        this.canceledBookings.push(booking);
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

  getCategoryIcon(category: string): string {
    const categoryIcons: { [key: string]: string } = {
      'Villa': '🏡',
      'Apartment': '🏢',
      'Cabin': '🌲',
      'Hotel': '🏨',
      'House': '🏠'
    };

    return categoryIcons[category] || '🏠';
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
    img.src = booking.productImgPath ;
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
    const middleCol=60;
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
    doc.text(new Date().toLocaleDateString(), rightCol  - 30 , startY);

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
