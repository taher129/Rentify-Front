import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
// import {UserDTO} from "../models/user-dto";
import {PasswordUpdateRequestDTO, ProfileUpdateRequestDTO, UserDTO} from "../models/user";
import {environment} from "../../../environment";
import {AuthService} from "./auth.service";
import {AbstractControl, ValidationErrors, ɵElement, ɵValue} from "@angular/forms";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

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

  initiateReset(phone: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/initiate-password-reset`, { phoneNumber: phone });
  }

  verifyOtp(phone: string, otp: ɵValue<ɵElement<(string | ((control: AbstractControl) => (ValidationErrors | null)))[], null>> | undefined): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-otp`, { phoneNumber: phone, otp });
  }

  resetPassword(phone: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { phoneNumber: phone, newPassword: password });
  }
}
