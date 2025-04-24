import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {NgIf, NgClass, NgOptimizedImage} from '@angular/common';
import {FaceAuthComponent} from "../face-auth/face-auth.component";
import {MatDialog, MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, NgOptimizedImage],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;
  hasLogo: boolean = false;

  constructor(
    private fb: FormBuilder,
    protected authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  markEmailAsTouched() {
    this.loginForm.get('email')?.markAsTouched();
  }

  markPasswordAsTouched() {
    this.loginForm.get('password')?.markAsTouched();
  }

  onSubmit() {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      this.errorMessage = 'Please correct the errors in the form';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.authService.getUserDetailsFromServer().subscribe((user) => {
          console.log(user); // Now you have the user details in the localStorage
        });
        // Store token
        this.authService.setToken(res.token);

        // Redirect
        if (res.role === 'ROLE_ADMIN') {
          this.router.navigate(['/dashboard']);
        } else if (res.role === 'ROLE_USER') {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = this.getFriendlyErrorMessage(err);
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private getFriendlyErrorMessage(error: any): string {
    if (!error) return 'An unexpected error occurred. Please try again later.';

    const errorStr = typeof error === 'string' ? error.toLowerCase() : error.message?.toLowerCase() || '';

    if (errorStr.includes('locked')) {
      return 'Your account has been temporarily locked due to multiple failed attempts. Please try again in 30 minutes or contact support.';
    } else if (errorStr.includes('not verified') || errorStr.includes('verify')) {
      return 'Please verify your email address before logging in. Check your inbox for the verification link.';
    } else if (errorStr.includes('credentials') || errorStr.includes('invalid') || errorStr.includes('incorrect')) {
      return 'The email or password you entered is incorrect. Please try again.';
    } else if (errorStr.includes('network')) {
      return 'Network error. Please check your internet connection and try again.';
    } else if (errorStr.includes('timeout')) {
      return 'The request timed out. Please check your connection and try again.';
    } else if (errorStr.includes('required') || errorStr.includes('empty')) {
      return 'Please fill in all required fields.';
    } else {
      return 'Login failed. Please check your credentials and try again.';
    }
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  loginWithFacebook() {
    this.authService.loginWithFacebook();
  }

  openFaceLogin() {
    const dialogRef = this.dialog.open(FaceAuthComponent);
    dialogRef.componentInstance.isLoginMode = true;
  }
}
