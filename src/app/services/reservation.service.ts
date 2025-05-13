import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Reservation} from "../models/reservation";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl: string = '/api/reservations'; // Note plural

  constructor(private http: HttpClient) {}

  createReservation(reservation: Reservation): Observable<any> {
    return this.http.post(this.apiUrl, reservation, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  showMyBooking(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  showMyBookingByUserId(userId: number | null): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/user/${userId}`);
  }

  showMyBookingByProductId(productId: number | null): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/product/${productId}`);
  }
  updateReservationStatus(reservationId: number, newStatus: string): Observable<any> {
    const body = {
      reservationId: reservationId,
      status: newStatus
    };

    return this.http.put(`${this.apiUrl}/${reservationId}/status`, body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

}
