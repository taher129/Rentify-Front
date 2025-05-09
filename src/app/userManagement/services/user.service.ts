import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, Observable, of, tap} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {PasswordUpdateRequestDTO, ProfileUpdateRequestDTO, UserDTO} from "../models/user";
import {environment} from "../../../environment";
import {ToastrService} from "ngx-toastr";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient, private toastr: ToastrService) {}
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getProfile(): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/profile`, {
      headers: this.getAuthHeaders(),
    });
  }

  updateProfile(data: ProfileUpdateRequestDTO, image?: File): Observable<UserDTO> {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (image) {
      formData.append('image', image);
    }
    return this.http.put<UserDTO>(`${this.apiUrl}/profile`, formData, {
      headers: this.getAuthHeaders(),
    });
  }

  updatePassword(passwordDTO: PasswordUpdateRequestDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/password`, passwordDTO, {
      headers: this.getAuthHeaders(),
      responseType: 'text',
    });
  }

  initiatePasswordReset(phoneNumber: string | null | undefined): Observable<any> {
    this.loadingSubject.next(true);
    return this.http.post(`${this.apiUrl}/forgot-password`, { phoneNumber }).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError(error => {
        this.loadingSubject.next(false);
        throw error;
      })
    );
  }

  verifyOtp(phoneNumber: string, otp: string | null | undefined): Observable<any> {
    this.loadingSubject.next(true);
    return this.http.post(`${this.apiUrl}/verify-otp`, { phoneNumber, otp }).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError(error => {
        this.loadingSubject.next(false);
        throw error;
      })
    );
  }

  resetPassword(phoneNumber: string, newPassword: string, confirmPassword: string): Observable<any> {
    this.loadingSubject.next(true);
    return this.http.post(`${this.apiUrl}/reset-password`, {
      phoneNumber,
      newPassword,
      confirmPassword
    }).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError(error => {
        this.loadingSubject.next(false);
        throw error;
      })
    );
  }
}
