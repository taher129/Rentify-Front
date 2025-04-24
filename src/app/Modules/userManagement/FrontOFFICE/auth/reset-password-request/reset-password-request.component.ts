import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { PasswordResetService } from '../../services/password-reset.service';
import { Router } from '@angular/router';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-reset-password-request',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './reset-password-request.component.html',
  styleUrl: './reset-password-request.component.css'
})
export class ResetPasswordRequestComponent {
  form: FormGroup;
  message: string = '';
  error: string = '';

  constructor(private fb: FormBuilder, private passwordService: PasswordResetService, private router: Router) {
    this.form = this.fb.group({
      phoneNumber: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    this.passwordService.initiateReset(this.form.value.phoneNumber).subscribe({
      next: res => {
        this.message = res;
        this.router.navigate(['/verify-otp'], { queryParams: { phone: this.form.value.phoneNumber } });
      },
      error: err => this.error = err.error.message || 'Error sending OTP'
    });
  }
}
