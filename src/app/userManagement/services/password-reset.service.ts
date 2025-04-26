import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {

  private baseUrl = 'http://localhost:8082/user';

  constructor(private http: HttpClient) {}

  initiateReset(phoneNumber: string) {
    return this.http.post(`${this.baseUrl}/initiate`, phoneNumber, { responseType: 'text' });
  }

  verifyOTP(phoneNumber: string, otp: string) {
    return this.http.post(`${this.baseUrl}/verify-otp`, { phoneNumber, otp }, { responseType: 'text' });
  }

  resetPassword(phoneNumber: string, newPassword: string) {
    return this.http.post(`${this.baseUrl}/reset`, { phoneNumber, newPassword }, { responseType: 'text' });
  }}
