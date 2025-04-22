import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import {DatePipe, NgClass, NgForOf, NgIf, PercentPipe} from "@angular/common";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { StripeService } from "../../services/stripe.service";
import { ReservationService } from "../../services/reservation.service";
import {Reservation,SpecialRequest} from "../../models/reservation";
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



@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    NgForOf,
    FormsModule,
    PercentPipe,
    DatePipe,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent implements OnInit {
  user: User = {
    userId: 1,
    firstName: 'Taher',
    lastName: 'Ezzine',
    email: 'taherezzine@gmail.com',
    phoneNumber: 56142979,
    isLoggedIn: true
  };

  product: Product = {
    productId: 1,
    productName: 'Bosh Blower',
    productAddress: 'Rue Abdelwaheb El Hafsi, 7000, street 3',
    productPrice: 5,
    productImgPath: '/blower.png',
    productCategory: 'Gardening',
    productRatingValue: 4.4,
    productShortDescription: 'Bosh Blower with high intensity for blowing leafs'
  };

  reservation: Reservation = {
    id:null,
    userId: this.user.userId,
    productId: this.product.productId,
    couponName: 'First Time User',
    couponPrice: 0.05,
    rentingDuration: 5,
    totalPrice: null,
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 4)),
    status: 'upcoming'
  };

  specialRequests: SpecialRequest[] = [
    { id: 'cleanliness', label: 'Cleanliness Guarantee', price: 5, checked: false },
    { id: 'delivery', label: 'Delivery and Pickup Service', price: 10, checked: false },
    { id: 'insurance', label: 'Insurance Coverage', price: 8, checked: false },
    { id: 'extended', label: 'Extended Rental Period', price: 7, checked: false },
    { id: 'instruction', label: 'Instructional Support or Demonstration', price: 6, checked: false },
    { id: 'mileage', label: 'Mileage or Usage Limit Flexibility', price: 4, checked: false },
    { id: 'backup', label: 'Backup or Spare Equipment', price: 9, checked: false }
  ];

  existingReservations: Reservation[] = [];
  unavailableDates: Date[] = [];
  nextAvailableStartDate: Date | null = null;
  datePickerDisabledDates: string[] = []; // ISO format dates that should be disabled

  paymentForm!: FormGroup;
  userDetailsForm!: FormGroup;
  minDate: string;
  dateError: string = '';
  selectedRequests: { label: string; price: number }[] = [];
  isLoading: boolean = false;

  tempDate = {
    pickup: new Date(),
    return: new Date(new Date().setDate(new Date().getDate() + 4))
  };

  showPickupDatePicker = false;
  showReturnDatePicker = false;
  formSubmitted = false;

  constructor(
    private router: Router,
    private stripeService: StripeService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private rs: ReservationService
  ) {
    const state = this.router.getCurrentNavigation()?.extras.state as {
      productId: number;
      price: number;
      userId: number;
    };

    if (state) {
      this.product.productId = state.productId;
      this.product.productPrice = state.price;
      this.user.userId = state.userId;
    }

    // Set minimum date to today's date in YYYY-MM-DD format
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    // Initialize forms
    this.initForms();
  }

  initForms() {
    // User details form
    this.userDetailsForm = this.formBuilder.group({
      firstName: [this.user.isLoggedIn ? this.user.firstName : '', [Validators.required]],
      lastName: [this.user.isLoggedIn ? this.user.lastName : '', [Validators.required]],
      email: [this.user.isLoggedIn ? this.user.email : '', [Validators.required, Validators.email]],
      phoneNumber: [this.user.isLoggedIn ? this.user.phoneNumber : '', [Validators.required, Validators.pattern(/^\d{8,}$/)]]
    });

    // Payment form
    this.paymentForm = this.formBuilder.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]],
      expiryMonth: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])$/)]],
      expiryYear: ['', [Validators.required, Validators.pattern(/^[0-9]{2}$/), this.validateExpiryDate.bind(this)]],
      cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]],
      cardholderName: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.tempDate.pickup = new Date(this.reservation.startDate);
    this.tempDate.return = new Date(this.reservation.endDate);
    this.calculateRentingDuration();

    // Initialize Stripe
    this.stripeService.initializeStripe().then(() => {
      console.log("✅ Stripe initialized");
    }).catch(error => {
      console.error("❌ Failed to initialize Stripe:", error);
    });

    // Load existing reservations for this product
    this.loadExistingReservations();
  }

  loadExistingReservations() {
    if (this.product.productId) {
      this.rs.showMyBookingByProductId(this.product.productId).subscribe({
        next: (reservations) => {
          this.existingReservations = reservations;
          this.calculateUnavailableDates();
          this.findNextAvailableStartDate();
          this.updateInitialDates();
        },
        error: (err) => {
          console.error('Failed to load reservations:', err);
        }
      });
    }
  }

  calculateUnavailableDates() {
    this.unavailableDates = [];

    this.existingReservations.forEach(reservation => {
      const startDate = new Date(reservation.startDate);
      const endDate = new Date(reservation.endDate);

      // Add all dates between start and end (inclusive) to unavailable dates
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        this.unavailableDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    // Convert to ISO strings for easier comparison
    this.datePickerDisabledDates = this.unavailableDates.map(date =>
      date.toISOString().split('T')[0]
    );
  }

  findNextAvailableStartDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let potentialStartDate = new Date(today);
    let found = false;

    // Look for the next 90 days maximum
    for (let i = 0; i < 90 && !found; i++) {
      const isUnavailable = this.unavailableDates.some(unavailableDate =>
        this.isSameDay(potentialStartDate, unavailableDate)
      );

      if (!isUnavailable) {
        // Check if there are 4 consecutive available days
        let consecutiveAvailableDays = 1;
        let tempDate = new Date(potentialStartDate);

        for (let j = 1; j <= 4; j++) {
          tempDate.setDate(tempDate.getDate() + 1);

          const dayIsUnavailable = this.unavailableDates.some(unavailableDate =>
            this.isSameDay(tempDate, unavailableDate)
          );

          if (!dayIsUnavailable) {
            consecutiveAvailableDays++;
          } else {
            break;
          }
        }

        if (consecutiveAvailableDays >= 5) { // We need 5 days (4 nights)
          found = true;
          this.nextAvailableStartDate = new Date(potentialStartDate);
        }
      }

      potentialStartDate.setDate(potentialStartDate.getDate() + 1);
    }
  }

  updateInitialDates() {
    if (this.nextAvailableStartDate) {
      // Update the reservation dates with next available slot
      this.reservation.startDate = new Date(this.nextAvailableStartDate);
      this.reservation.endDate = new Date(this.nextAvailableStartDate);
      this.reservation.endDate.setDate(this.reservation.endDate.getDate() + 4); // 4 days duration

      // Update temp dates as well
      this.tempDate.pickup = new Date(this.reservation.startDate);
      this.tempDate.return = new Date(this.reservation.endDate);

      this.calculateRentingDuration();
    }
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  validateExpiryDate(control: any) {
    if (!control.value) return null;

    const month = this.paymentForm?.get('expiryMonth')?.value;
    const year = parseInt(control.value); // 2-digit year input by user
    if (!month || isNaN(year)) return null;

    const today = new Date();
    const currentYear2Digits = parseInt(today.getFullYear().toString().slice(-2)); // e.g., '25' from 2025
    const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed

    // Compare year and month
    if (year < currentYear2Digits || (year === currentYear2Digits && parseInt(month) < currentMonth)) {
      return { expired: true };
    }

    return null;
  }

  isDateUnavailable(date: string | null): boolean {
    if (!date) return false;

    return this.datePickerDisabledDates.includes(date);
  }
  getFormattedUnavailableDates(): string {
    if (!this.unavailableDates || this.unavailableDates.length === 0) {
      return 'No unavailable dates';
    }

    // Sort dates chronologically
    const sortedDates = [...this.unavailableDates].sort((a, b) => a.getTime() - b.getTime());

    // Group consecutive dates
    const dateRanges: { start: Date, end: Date }[] = [];
    let currentRange: { start: Date, end: Date } | null = null;

    sortedDates.forEach(date => {
      if (!currentRange) {
        currentRange = { start: date, end: date };
      } else {
        const nextDay = new Date(currentRange.end);
        nextDay.setDate(nextDay.getDate() + 1);

        if (this.isSameDay(nextDay, date)) {
          currentRange.end = date;
        } else {
          dateRanges.push(currentRange);
          currentRange = { start: date, end: date };
        }
      }
    });

    if (currentRange) {
      dateRanges.push(currentRange);
    }

    // Format the date ranges
    return dateRanges.map(range => {
      if (this.isSameDay(range.start, range.end)) {
        return this.formatDate(range.start);
      } else {
        return `${this.formatDate(range.start)} - ${this.formatDate(range.end)}`;
      }
    }).join(', ');
  }
  // Add this method to the component class
  isDateDisabled(dateString: string): boolean {
    if (!dateString) return false;

    // Convert dateString to Date for comparison
    const dateParts = dateString.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[2]);

    const dateToCheck = new Date(year, month, day);
    dateToCheck.setHours(0, 0, 0, 0);

    // Check if this date exists in unavailable dates
    return this.unavailableDates.some(unavailableDate =>
      this.isSameDay(dateToCheck, unavailableDate)
    );
  }
  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    return !this.unavailableDates.some(unavailableDate =>
      this.isSameDay(date, unavailableDate)
    );
  }
// Update the HTML template to show unavailable dates list
  getUnavailableDatesDisplay(): string {
    if (this.unavailableDates.length === 0) return 'All dates available';

    // Show up to 3 ranges
    const formattedRanges = this.getFormattedUnavailableDates().split(', ');
    const displayRanges = formattedRanges.slice(0, 3);

    if (formattedRanges.length > 3) {
      return displayRanges.join(', ') + ` and ${formattedRanges.length - 3} more...`;
    }

    return displayRanges.join(', ');
  }
  onCheckboxChange(option: any) {
    if (option.checked) {
      this.selectedRequests.push({ label: option.label, price: option.price });
    } else {
      this.selectedRequests = this.selectedRequests.filter(
        item => item.label !== option.label
      );
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  get totalExtrasPrice(): number {
    return this.selectedRequests.reduce((sum, item) => sum + item.price, 0);
  }

  get totalPrice(): number {
    return (this.product.productPrice * this.reservation.rentingDuration) + this.totalExtrasPrice;
  }

  async processPayment() {
    this.formSubmitted = true;
    this.isLoading = true;

    // Mark all form controls as touched to trigger validation display
    this.markFormGroupTouched(this.userDetailsForm);
    this.markFormGroupTouched(this.paymentForm);

    // Check if user details form is valid
    if (this.userDetailsForm.invalid) {
      this.isLoading = false;
      return;
    }
    if (this.paymentForm.invalid) {
      this.isLoading = false;
      return;
    }

    // Validate date ranges
    if (this.validateDates() !== true) {
      this.isLoading = false;
      return;
    }

    // Check for date conflicts
    if (this.hasDateConflict(this.reservation.startDate, this.reservation.endDate)) {
      this.dateError = 'Selected dates conflict with existing reservations';
      this.isLoading = false;
      return;
    }

    try {
      const amount = this.totalPrice;
      const productName = this.product.productName;
      const description = this.product.productShortDescription;
      const productId = this.product.productId as number;
      const userId = this.user.userId as number;
      const rentDuration = this.reservation.rentingDuration;
      const startDate = this.formatDateForBackend(this.reservation.startDate);
      const endDate = this.formatDateForBackend(this.reservation.endDate);

      const session = await this.stripeService.createCheckoutSession(
        amount,
        productName,
        description,
        productId,
        userId,
        rentDuration,
        startDate,
        endDate
      );

      // Create the reservation object using the model
      const reservation: Reservation = {
        id:null,
        productId: this.product.productId as number,
        userId: this.user.userId as number,
        couponName: this.reservation.couponName,
        couponPrice: this.reservation.couponPrice,
        rentingDuration: this.reservation.rentingDuration,
        totalPrice: this.totalPrice,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status:'upcoming'
      };

      // Pass the reservation object to the backend
      this.rs.createReservation(reservation).subscribe({
        next: () => {
          this.router.navigate(['/myreservation'], {
            state: {
              product: this.product,
              reservation: reservation,
              user: this.user
            }
          });
        },
        error: (err) => {
          console.error('Failed to create reservation:', err);
          this.isLoading = false;
          alert('Payment was successful, but reservation could not be created. Please contact support.');
        }
      });

    } catch (error) {
      console.error('Payment failed:', error);
      this.isLoading = false;
    }
  }

  hasDateConflict(startDate: Date, endDate: Date): boolean {
    // Create copies to avoid mutating original dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Normalize times to midnight for comparing calendar days only
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // Check each day in the requested range
    let current = new Date(start);
    while (current <= end) {
      // Check if this specific day is in the unavailable dates array
      if (this.unavailableDates.some(unavailableDate => this.isSameDay(current, new Date(unavailableDate)))) {
        return true; // Conflict found
      }
      current.setDate(current.getDate() + 1);
    }

    return false; // No conflicts
  }

  private formatDateForBackend(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  calculateRentingDuration(): void {
    const start = new Date(this.reservation.startDate);
    const end = new Date(this.reservation.endDate);

    const diffInMs = end.getTime() - start.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    this.reservation.rentingDuration = diffInDays > 0 ? diffInDays : 1;
  }

  validateDates(): boolean | string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pickup = new Date(this.reservation.startDate);
    const returnDate = new Date(this.reservation.endDate);

    if (pickup < today) {
      this.dateError = 'Pickup date cannot be earlier than today';
      return this.dateError;
    }

    if (returnDate <= pickup) {
      this.dateError = 'Return date must be after pickup date';
      return this.dateError;
    }

    // Check for conflicts with existing reservations
    if (this.hasDateConflict(pickup, returnDate)) {
      this.dateError = 'Selected dates conflict with existing reservations';
      return this.dateError;
    }

    this.dateError = '';
    return true;
  }

  setPickupDate(dateString: string): void {
    // First check if this date is available
    if (this.isDateUnavailable(dateString)) {
      this.dateError = 'This date is not available for booking';
      return;
    }

    const dateParts = dateString.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[2]);

    const newDate = new Date(this.tempDate.pickup);
    newDate.setFullYear(year, month, day);
    this.tempDate.pickup = newDate;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (newDate < today) {
      this.dateError = 'Pickup date cannot be earlier than today';
    } else {
      this.dateError = '';

      // Adjust return date if there's a conflict
      const potentialEndDate = new Date(newDate);
      potentialEndDate.setDate(potentialEndDate.getDate() + 4); // Default 4-day duration

      if (this.hasDateConflict(newDate, potentialEndDate)) {
        // Find next available end date
        let validEndDate = new Date(newDate);
        validEndDate.setDate(validEndDate.getDate() + 1); // At least one day

        while (this.hasDateConflict(newDate, validEndDate)) {
          validEndDate.setDate(validEndDate.getDate() + 1);
        }

        this.tempDate.return = validEndDate;
      } else {
        this.tempDate.return = potentialEndDate;
      }
    }
  }

  setPickupTime(timeString: string): void {
    const timeParts = timeString.split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);

    const newDate = new Date(this.tempDate.pickup);
    newDate.setHours(hours, minutes);
    this.tempDate.pickup = newDate;
  }

  setReturnDate(dateString: string): void {
    // First check if this date is available
    if (this.isDateUnavailable(dateString)) {
      this.dateError = 'This date is not available for booking';
      return;
    }

    const dateParts = dateString.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[2]);

    const newDate = new Date(this.tempDate.return);
    newDate.setFullYear(year, month, day);
    this.tempDate.return = newDate;

    if (newDate <= this.tempDate.pickup) {
      this.dateError = 'Return date must be after pickup date';
    } else if (this.hasDateConflict(this.tempDate.pickup, newDate)) {
      this.dateError = 'Selected return date conflicts with existing reservations';
    } else {
      this.dateError = '';
    }
  }

  setReturnTime(timeString: string): void {
    const timeParts = timeString.split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);

    const newDate = new Date(this.tempDate.return);
    newDate.setHours(hours, minutes);
    this.tempDate.return = newDate;
  }

  togglePickupDatePicker(): void {
    this.showPickupDatePicker = !this.showPickupDatePicker;
    this.showReturnDatePicker = false;
  }

  toggleReturnDatePicker(): void {
    this.showReturnDatePicker = !this.showReturnDatePicker;
    this.showPickupDatePicker = false;
  }

  closeDatePicker(type: string): void {
    if (type === 'pickup') {
      this.showPickupDatePicker = false;
    } else {
      this.showReturnDatePicker = false;
    }
  }

  savePickupDateTime(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (this.tempDate.pickup < today) {
      this.dateError = 'Pickup date cannot be earlier than today';
      return;
    }

    if (this.tempDate.pickup >= this.tempDate.return) {
      this.dateError = 'Pickup date must be before return date';
      return;
    }

    if (this.hasDateConflict(this.tempDate.pickup, this.tempDate.return)) {
      this.dateError = 'Selected dates conflict with existing reservations';
      return;
    }

    this.reservation.startDate = new Date(this.tempDate.pickup);
    this.calculateRentingDuration();
    this.showPickupDatePicker = false;
    this.dateError = '';
  }

  saveReturnDateTime(): void {
    if (this.tempDate.return <= this.tempDate.pickup) {
      this.dateError = 'Return date must be after pickup date';
      return;
    }

    if (this.hasDateConflict(this.tempDate.pickup, this.tempDate.return)) {
      this.dateError = 'Selected dates conflict with existing reservations';
      return;
    }

    this.reservation.endDate = new Date(this.tempDate.return);
    this.calculateRentingDuration();
    this.showReturnDatePicker = false;
    this.dateError = '';
  }

  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (!field) return '';

    if (field.errors?.['required']) return 'This field is required';
    if (field.errors?.['email']) return 'Please enter a valid email address';
    if (field.errors?.['pattern']) {
      if (fieldName === 'phoneNumber') return 'Please enter a valid phone number';
      if (fieldName === 'cardNumber') return 'Please enter a valid 16-digit card number';
      if (fieldName === 'expiryMonth') return 'Please enter a valid month (01-12)';
      if (fieldName === 'expiryYear') return 'Please enter a valid 4-digit year';
      if (fieldName === 'cvv') return 'Please enter a valid 3 or 4 digit CVV';
      return 'Invalid format';
    }
    if (field.errors?.['expired']) return 'Card has expired';

    return '';
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  formatTime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    return date.toLocaleTimeString('en-US', options).toLowerCase();
  }

  protected readonly Date = Date;
}
