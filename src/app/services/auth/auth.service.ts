import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { UserDTO } from '../../models/user.model';
import { catchError } from 'rxjs/operators';
import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  ɵElement,
  ɵFormGroupValue,
  ɵTypedOrUntyped
} from "@angular/forms";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8082/auth';

  constructor(private http: HttpClient) {}

  signup(user: ɵTypedOrUntyped<{
    [K in keyof {
      firstName: (string | ((control: AbstractControl) => (ValidationErrors | null)))[];
      lastName: (string | ((control: AbstractControl) => (ValidationErrors | null)))[];
      password: (string | (((control: AbstractControl) => (ValidationErrors | null)) | ValidatorFn)[])[];
      phoneNumber: (string | (((control: AbstractControl) => (ValidationErrors | null)) | ValidatorFn)[])[];
      address: FormGroup<{
        [K in keyof {
          country: string[];
          zipCode: string[];
          city: string[];
          street: string[];
          state: string[]
        }]: ɵElement<{
          country: string[];
          zipCode: string[];
          city: string[];
          street: string[];
          state: string[]
        }[K], null>
      }>;
      gender: (string | ((control: AbstractControl) => (ValidationErrors | null)))[];
      email: (string | ((control: AbstractControl) => (ValidationErrors | null))[])[]
    }]: ɵElement<{
      firstName: (string | ((control: AbstractControl) => (ValidationErrors | null)))[];
      lastName: (string | ((control: AbstractControl) => (ValidationErrors | null)))[];
      password: (string | (((control: AbstractControl) => (ValidationErrors | null)) | ValidatorFn)[])[];
      phoneNumber: (string | (((control: AbstractControl) => (ValidationErrors | null)) | ValidatorFn)[])[];
      address: FormGroup<{
        [K in keyof {
          country: string[];
          zipCode: string[];
          city: string[];
          street: string[];
          state: string[]
        }]: ɵElement<{
          country: string[];
          zipCode: string[];
          city: string[];
          street: string[];
          state: string[]
        }[K], null>
      }>;
      gender: (string | ((control: AbstractControl) => (ValidationErrors | null)))[];
      email: (string | ((control: AbstractControl) => (ValidationErrors | null))[])[]
    }[K], null>
  }, ɵFormGroupValue<{
    [K in keyof {
      firstName: (string | ((control: AbstractControl) => (ValidationErrors | null)))[];
      lastName: (string | ((control: AbstractControl) => (ValidationErrors | null)))[];
      password: (string | (((control: AbstractControl) => (ValidationErrors | null)) | ValidatorFn)[])[];
      phoneNumber: (string | (((control: AbstractControl) => (ValidationErrors | null)) | ValidatorFn)[])[];
      address: FormGroup<{
        [K in keyof {
          country: string[];
          zipCode: string[];
          city: string[];
          street: string[];
          state: string[]
        }]: ɵElement<{
          country: string[];
          zipCode: string[];
          city: string[];
          street: string[];
          state: string[]
        }[K], null>
      }>;
      gender: (string | ((control: AbstractControl) => (ValidationErrors | null)))[];
      email: (string | ((control: AbstractControl) => (ValidationErrors | null))[])[]
    }]: ɵElement<{
      firstName: (string | ((control: AbstractControl) => (ValidationErrors | null)))[];
      lastName: (string | ((control: AbstractControl) => (ValidationErrors | null)))[];
      password: (string | (((control: AbstractControl) => (ValidationErrors | null)) | ValidatorFn)[])[];
      phoneNumber: (string | (((control: AbstractControl) => (ValidationErrors | null)) | ValidatorFn)[])[];
      address: FormGroup<{
        [K in keyof {
          country: string[];
          zipCode: string[];
          city: string[];
          street: string[];
          state: string[]
        }]: ɵElement<{
          country: string[];
          zipCode: string[];
          city: string[];
          street: string[];
          state: string[]
        }[K], null>
      }>;
      gender: (string | ((control: AbstractControl) => (ValidationErrors | null)))[];
      email: (string | ((control: AbstractControl) => (ValidationErrors | null))[])[]
    }[K], null>
  }>, any>): Observable<string> {
    return this.http.post(`${this.baseUrl}/signup`, user, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }



  private handleError(error: HttpErrorResponse) {
    let errorMsg = 'Something went wrong';
    if (error.error instanceof ErrorEvent) {
      errorMsg = `Error: ${error.error.message}`;
    } else if (typeof error.error === 'string') {
      errorMsg = error.error;
    }
    return throwError(() => new Error(errorMsg));
  }
}
