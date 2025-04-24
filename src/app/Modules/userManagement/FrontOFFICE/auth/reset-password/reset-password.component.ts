import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {PasswordResetService} from "../../services/password-reset.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  phoneNumber: string = '';
  newPassword: string = '';
  message: string = '';
  error: string = '';

  constructor(private route: ActivatedRoute, private service: PasswordResetService, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.phoneNumber = params['phone'];
    });
  }

  reset(): void {
    this.service.resetPassword(this.phoneNumber, this.newPassword).subscribe({
      next: res => {
        this.message = res;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: err => this.error = err.error.message || 'Failed to reset password'
    });
  }
}
