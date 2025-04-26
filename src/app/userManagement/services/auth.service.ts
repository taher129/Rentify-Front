import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { catchError, tap } from 'rxjs/operators';
import {BehaviorSubject, Observable, Subject, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { Router } from "@angular/router";
import {UserDetails, UserDTO} from "../models/user";

interface AuthResponse {
  message: string;
  token: string;
  role: string;
  userDetails: UserDetails;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `http://localhost:8082/auth`;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLE_KEY = 'user_role';
  private readonly USER_KEY = 'user_details'; // To store user data
  private tokenSubject = new BehaviorSubject<string | null>(null);
  authStatusChanged = new Subject<boolean>();


  constructor(private http: HttpClient, private router: Router) {
    this.initializeAuthStatus();
  }

  // ======================
  // Token Management
  // ======================

  private safeGetItem(key: string): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem(key) : null;
  }
  private initializeAuthStatus(): void {
    const token = this.getToken();
    this.tokenSubject.next(token);
    if (token) {
      this.getUserDetails(token); // Fetch user details if token is present
    }
  }
  private safeSetItem(key: string, value: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }

  getToken(): string | null {
    return this.safeGetItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    this.safeSetItem(this.TOKEN_KEY, token);
    this.tokenSubject.next(token);
  }

  setRole(role: string): void {
    this.safeSetItem(this.ROLE_KEY, role);
  }

  setUserDetails(user: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  getUserDetails(token: string): any {
    const user = this.safeGetItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  getUserDetailsFromServer(): Observable<any> {
    const token = this.getToken();
    return this.http.get<any>(`${this.apiUrl}/user`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }).pipe(
      tap(user => {
        this.setUserDetails(user); // Store user details in localStorage
      })
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signin`, { email, password }).pipe(
      tap((res) => {
        this.setToken(res.token);
        this.setRole(res.role);
        this.getUserDetailsFromServer(); // Fetch user details after login
        this.redirectBasedOnRole(res.role);
        this.authStatusChanged.next(true);
      }),
      catchError(this.handleError)
    );

  }




  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData).pipe(
      catchError(error => {
        const errorMessage = this.parseSignupError(error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false; // sécurité pour SSR

    const token = this.getToken();
    return !!token;
  }



  // ======================
  // Social Login Methods
  // ======================
  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/oauth2/authorization/google`;
    this.router.navigate(['/home']);

  }

  loginWithFacebook(): void {
    window.location.href = `${this.apiUrl}/oauth2/authorization/facebook`;
  }

  // ======================
  // Email Verification
  // ======================
  verifyEmail(token: string): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.apiUrl}/verify-email?token=${token}`);
  }

  // ======================
  // Helper Methods
  // ======================
  private redirectBasedOnRole(role: string): void {
    switch (role) {
      case 'ROLE_ADMIN':
        this.router.navigate(['/dashboard']);
        break;
      case 'ROLE_USER':
        this.router.navigate(['/homepage']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }

  private parseSignupError(error: any): string {
    if (error.error && typeof error.error === 'object') {
      return error.error.error || JSON.stringify(error.error);
    }
    if (error.error) {
      return error.error;
    }
    if (error.status === 400) {
      return 'Invalid data provided';
    }
    if (error.status === 409) {
      return 'User already exists';
    }
    return 'Registration failed. Please try again.';
  }

  private handleError(error: HttpErrorResponse) {
    let errorMsg = 'An error occurred. Please try again.';

    if (error.error) {
      errorMsg = error.error.message || error.error;
    }

    switch (error.status) {
      case 401:
        errorMsg = 'Invalid email or password.';
        break;
      case 403:
        errorMsg = 'Login blocked due to unverified email.';
        break;
      case 423:
        errorMsg = 'Account is locked due to too many failed login attempts.';
        break;
    }

    return throwError(() => errorMsg);
  }

  isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false; // sécurité pour SSR

    const token = this.getToken();
    return !!token;
  }




  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.authStatusChanged.next(false);
    this.router.navigate(['/login']);  // Redirect to login after logout
  }
}
