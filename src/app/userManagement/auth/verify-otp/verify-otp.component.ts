import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {PasswordResetService} from "../../services/password-reset.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.css'
})
export class VerifyOtpComponent implements OnInit {
  phoneNumber: string = '';
  otp: string = '';
  message: string = '';
  error: string = '';

  constructor(private route: ActivatedRoute, private service: PasswordResetService, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.phoneNumber = params['phone'];
    });
  }

  verify(): void {
    this.service.verifyOTP(this.phoneNumber, this.otp).subscribe({
      next: res => {
        this.message = res;
        this.router.navigate(['/reset-password'], { queryParams: { phone: this.phoneNumber } });
      },
      error: err => this.error = err.error.message || 'Invalid OTP'
    });
  }
}
